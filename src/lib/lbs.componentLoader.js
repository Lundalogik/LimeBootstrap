import ko from 'knockout'
import _ from 'underscore'
import $ from 'jquery'

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
}
