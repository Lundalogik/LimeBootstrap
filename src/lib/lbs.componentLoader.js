import ko from 'knockout'
import _ from 'underscore'
import $ from 'jquery'
import WebComponents from './dataSources/lbs.dataSource.webComponents'

export default class ComponentLoader {
    static async loadComponents(globalComponents, localComponents) {
        const components = _.union(localComponents, globalComponents)
        await Promise.all(components.map(async (component) => {
            try {
                $('<link/>', { rel: 'stylesheet', type: 'text/css', href: `${component.path}/component.css` }).appendTo('head')
                await $.getScript(`${component.path}/component.js`).done(() => {
                    const r = require // hack to fool Brunch.io to avoid require at compile time
                    lbs.log.info(`Registering component ${component.name}`)
                    ko.components.register(component.name, { viewModel: r(`components/${component.name}/viewmodel.js`).default, template: r(`components/${component.name}/template.html`) })
                })
            } catch (err) {
                lbs.log.error(`Failed to load component '${component.name}'`, err)
            }
        }))
    }
    
    static async loadWebComponents() {
        const dataSourceWebComponents = new WebComponents(
            { type: 'webComponents', alias: 'webcomponents' },
            lbs.session,
            lbs.activeServer,
            lbs.activeDatabase,
        )
        const plugins = await dataSourceWebComponents.fetch()

        // Set the base url for the page in order to load plugins correctly.
        // This will likely be incompatible with any old LBS apps that
        // load anything from the local file system after this point.
        const baseElement = document.createElement('base')
        baseElement.setAttribute('href', 'https://localhost/')
        document.head.appendChild(baseElement)

        await Promise.all(plugins.scripts.map(script => {
            return loadScript(script);
        }))

        function loadScript(script) {
            return new Promise(success => {
                const scriptElement = document.createElement('script')
                scriptElement.onload = () => {
                    success()
                };

                document.body.appendChild(scriptElement)
                scriptElement.setAttribute('src', script)
            });
        }
    }
}
