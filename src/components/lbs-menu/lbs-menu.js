import ko from 'knockout'
import limeMenuTemplate from './lbs-menu.tpl.html'

class MenuVM {
    constructor(params) {
        const {
            title = '',
            expanded = true,
        } = params
        this.title = title
        this.expanded = ko.observable(expanded)
    }

    toggle() {
        this.expanded(!this.expanded())
    }
}

ko.components.register('lbs-menu', { viewModel: MenuVM, template: limeMenuTemplate })
