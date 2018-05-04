import ko from 'knockout'
import _ from 'underscore'

export default class ComponentLoader{

    static loadComponents(globalComponents, localComponents){

        let components = _.union(localComponents, globalComponents)
        components.forEach((component) => {
            $.getScript(`components/my-app/${component.name}`).done((script, status) => {
                console.log(status)
                let r = require // hack to fool Brunch.io to avoid require at compile time
                ko.components.register(component.name, { viewModel: r('src/my-app.js').default, template: r('src/my-app.html') })
            })
        })
    }
}