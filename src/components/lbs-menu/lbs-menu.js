import ko from 'knockout'
import limeMenuTemplate from './lbs-menu.tpl.html'
import LBSBaseComponent from '../lbs-base-component/lbs-base-component'

class LBSMenuVM extends LBSBaseComponent {
    constructor(params) {
        super()
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

ko.components.register('lbs-menu', { viewModel: LBSMenuVM, template: limeMenuTemplate })
