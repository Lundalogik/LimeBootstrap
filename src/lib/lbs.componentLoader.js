import ko from 'knockout'
import _ from 'underscore'
import $ from 'jquery'

export default class ComponentLoader {
    static loadComponents(globalComponents, localComponents) {
        const components = _.union(localComponents, globalComponents)
        components.forEach((component) => {
            $.getScript(component.path).done((script, status) => {
                const r = require // hack to fool Brunch.io to avoid require at compile time
                ko.components.register(component.name, { viewModel: r(`src/${component.name}.js`).default, template: r(`src/${component.name}.html`) })
            }).fail((jqxhr, settings, exception) => {
                lbs.log.error("Something went wrong"+exception )
            })
        })
    }
}
