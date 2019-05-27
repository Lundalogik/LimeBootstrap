import ko from 'knockout'
import $ from 'jquery'

import lbsAppTemplate from './lbs-app.tpl.html'

import {
    AppDataSourceLoadError,
    AppTemplateLoadError,
    AppInitilizationError,
} from '../../lib/lbs.errors'

import LBSBaseComponent from '../lbs-base-component/lbs-base-component'

class LBSApp extends LBSBaseComponent {
    constructor(params, componentInfo) {
        super()
        const {
            app = '',
            config = {},
        } = params


        this.appName = app
        this.config = config
        this.element = componentInfo.element

        this.component = `lbs-app-instance-${this.appName}`

        this.loading = ko.observable(true)
        this.error = ko.observable(false)
        this.errorMsg = ko.observable(`${this.appName} encountered an fatal error: `)

        this.appPath = `apps/${this.appName}/`
        lbs.log.info(`<lbs-app>: Initializing app "${this.appName}"`)
        lbs.log.startTimer(`<lbs-app>: Init of ${this.appName}`)
        this.initApp()
        lbs.log.stopTimer(`<lbs-app>: Init of ${this.appName}`)
    }

    async initApp() {
        try {
            const AppPrototype = await this._loadAppPrototypeFromFile()
            const appInstance = this._createAppInstance(AppPrototype)
            const template = await this._loadAppTemplate()
            const appData = await this._loadAppDatasources(appInstance)

            await this._loadAppResources(appInstance.config.resources)
            const vm = appInstance.initialize(this.element, appData)
            ko.components.register(this.component, { viewModel: { createViewModel: () => vm }, template })
            this.loading(false)
        } catch (e) {
            this.loading(false)
            this.error(true)
            this.errorMsg(this.errorMsg() + e.toString())
            lbs.log.error(e)
            throw new AppInitilizationError(this.appName)
        }
    }

    async _loadAppPrototypeFromFile() {
        if (!lbs.apploader.appFactory[this.appName]) {
            if (!lbs.loader.loadScript(`${this.appPath}app.js`)) {
                throw new Error(`Could not find app ${this.appName}`) // Create custom error
            }
        }
        return lbs.apploader.appFactory[this.appName]
    }

    _createAppInstance(AppPrototype) {
        const appInstance = new AppPrototype()
        // overload config
        appInstance.config = new appInstance.config(this.config)
        return appInstance
    }

    async _loadAppTemplate() {
        const path = `${this.appPath}app.html`
        try {
            return await $.get(path, html => html)
        } catch (e) {
            throw new AppTemplateLoadError(this.appName, path)
        }
    }

    async _loadAppResources(resources) {
        $.each(resources.libs, (i, lib) => {
            lbs.loader.loadScript(`system/js/${lib}`)
        })

        $.each(resources.scripts, (i, script) => {
            lbs.loader.loadScript(this.appPath + script)
        })

        $.each(resources.styles, (i, style) => {
            lbs.loader.loadStyle(this.appPath + style)
        })
    }

    async _loadAppDatasources(appInstance) {
        try {
            const appVM = await lbs.loader._loadBothAsyncAndLegacyDataSources(appInstance.config.dataSources)
            if (lbs.vm.localize) {
                appVM.localize = lbs.vm.localize
            } else { // Localize is not garanteed to be loaded anymore
                appVM.localize = lbs.loader._loadDataSource({ type: 'localization' })
            }
            return appVM
        } catch (e) {
            throw new AppDataSourceLoadError(this.appName, e.dataSource)
        }
    }
}

ko.components.register('lbs-app', {
    viewModel: {
        createViewModel: (params, componentInfo) => new LBSApp(params, componentInfo),
    },
    template: lbsAppTemplate,
})
