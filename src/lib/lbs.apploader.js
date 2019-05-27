import $ from 'jquery'
import ko from 'knockout'


export default class AppLoader {
    /**
    holds a reference to all factory methods
    */
    constructor() {
        this.appFactory = {}
        this.apps = {}
    }

    /**
    Register app
    */
    register(name, func) {
        this.appFactory[name] = func
        lbs.log.debug(`AppLoader: App '${name}' has been succesfully registered`)
    }

    /**
    load all app configurations
    */
    identifyApps() {
        $('[data-app]').each((_, element) => {
            let path
            let htmlNode
            let instanceConfig
            let binding
            let appName
            let instance
            let guid
            let appAttributeValue
            try {
                lbs.log.warn('[Deprecation] AppLoader: You are using the legacy app binding ("data-app"), please change to the "<lbs-app>" component')
                // try to parse input to app from view
                try {
                    appAttributeValue = $(element).attr('data-app')
                    eval(`binding = ${appAttributeValue}`)
                    appName = binding.app
                    instanceConfig = binding.config || {}
                } catch (e1) {
                    lbs.log.error(`AppLoader: 'data-app=' has a syntax error: ${e1.message}.
                        Your value: ${appAttributeValue}
                        Expected format: '{app:'app-name', config:{}}'
                    `)
                    throw e1
                }

                // set basic properties
                path = `apps/${appName}/`
                htmlNode = $(element)
                guid = lbs.common.generateGuid()

                // load app
                if (!this.appFactory[appName]) {
                    if (!lbs.loader.loadScript(`${path}app.js`)) {
                        throw new Error(`AppLoader: Could not find app ${appName}`)
                    }
                }

                // create an instance
                instance = new this.appFactory[appName]()

                // merge instance with app config
                if (instanceConfig) {
                    // New config format
                    if (typeof (instance.config) === 'function') {
                        instance.config = new instance.config(instanceConfig)
                    } else { // old format
                        instance.config = lbs.common.mergeOptions(instance.config, instanceConfig, true)
                    }
                }

                // push resources
                lbs.loader.pushResources(instance.config.resources, path)

                // add app instance to lbs
                this.apps[guid] = {
                    name: appName,
                    path,
                    node: htmlNode,
                    instance,
                }
            } catch (e) {
                lbs.log.error(`AppLoader: Could not load app ${appName}`, e)
            }
        })

        return this.appFactory
    }

    /**
    Copy global viewmodel to app and add the datasources for the app
    */
    async buildApps() {
        if (!Object.keys(this.apps)) {
            return
        }
        await Promise.all(Object.keys(this.apps).map(async (key) => {
            // to-be viewmode
            // load data
            const vm = await lbs.loader._loadBothAsyncAndLegacyDataSources(this.apps[key].instance.config.dataSources)
            if (lbs.vm.localize) {
                vm.localize = lbs.vm.localize
            } else { // Localize is not garanteed to be loaded anymore
                vm.localize = lbs.loader._loadDataSource({ type: 'localization' })
            }
            this.apps[key].vm = vm
        }))
    }

    /**
    Initialize the app
    Make variables observable
    Apply bindings
    */
    initializeApps() {
        let appName
        let htmlNode
        $.each(this.apps, (key, app) => {
            appName = app.name
            const { path } = app
            htmlNode = app.node
            let { vm } = this.apps[key]

            // load view
            lbs.loader.loadView(`${path}app`, htmlNode)

            // run initialize
            try {
                vm = app.instance.initialize(htmlNode, vm)
                this.apps[key].vm = vm
            } catch (e) {
                this.apps[key].vm = vm
                lbs.log.error(`AppLoader: Could not intialize app: ${appName}`, e)
                throw e
            }

            // apply bindings
            try {
                ko.cleanNode(htmlNode.get(0))
                ko.applyBindings(vm, htmlNode.get(0))
            } catch (e) {
                lbs.log.error(lbs.common.nl2br(`AppLoader: Binding of data to view failed for app: ${appName}`))
                lbs.log.error(e)
            }
        })
    }
}
