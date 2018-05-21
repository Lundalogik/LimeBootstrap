import ko from 'knockout'
import _ from 'underscore'
import $ from 'jquery'

export default class ComponentLoader {
    static async loadComponents(globalComponents, localComponents) {
        const components = _.union(localComponents, globalComponents)
        await Promise.all(components.map(async (component) => {
            await $.getScript(component.path).done((script, status) => {
                const r = require // hack to fool Brunch.io to avoid require at compile time
                lbs.log.info(`Registering component ${component.name}`)
                ko.components.register(component.name, { viewModel: r(`components/${component.name}/component.js`).default, template: r(`components/${component.name}/component.html`) })
            }).fail((jqxhr, settings, exception) => {
                lbs.log.error("Something went wrong"+exception )
            })
        }))
    }
}
