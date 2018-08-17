import ko from 'knockout'

export default class LwcWrapper {
    constructor({ name, attributes, ...rest }, componentInfo) {
        this.lwcName = name
        this.attributes = attributes
        this.element = componentInfo.element

        this.renderElement(name, attributes)
    }

    renderElement(name, attributes) {
        const component = document.createElement(name)
        if (attributes) {
            Object.keys(attributes).forEach(key => component.setAttribute(key, attributes[key]))
        }
        component.platform = lbs.lwcPlatform
        component.context = {
            limetype: lbs.activeClass || null,
            id: lbs.activeLimeObjectId || null,
        }
        this.element.appendChild(component)
    }
}

ko.components.register('lbs-lwc-wrapper', {
    viewModel: {
        createViewModel: (params, componentInfo) => {
            // - 'params' is an object whose key/value pairs are the parameters
            //   passed from the component binding or custom element
            // - 'componentInfo.element' is the element the component is being
            //   injected into. When createViewModel is called, the template has
            //   already been injected into this element, but isn't yet bound.
            // - 'componentInfo.templateNodes' is an array containing any DOM
            //   nodes that have been supplied to the component. See below.

            // Return the desired view model instance, e.g.:
            return new LwcWrapper(params, componentInfo)
        },
    },
    template: '<!-- -->',
})
