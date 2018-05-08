import ko from 'knockout'
import _ from 'underscore'
import $ from 'jquery' 

export default class ComponentLoader{

    static loadComponents(globalComponents, localComponents){
        let components = _.union(localComponents, globalComponents)
        components.forEach((component) => {
            $.getScript(component.path).done((script, status) => {
                let r = require // hack to fool Brunch.io to avoid require at compile time
                ko.components.register(component.name, { viewModel: r(`src/${component.name}.js`).default, template: r(`src/${component.name}.html`) })
            })
        })
    }
}