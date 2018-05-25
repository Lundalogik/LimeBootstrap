import ko from 'knockout'
import limeMenuItemTemplate from './lbs-menu-item.tpl.html'
import LBSBaseComponent from '../lbs-base-component/lbs-base-component'

class LBSMenuItemVM extends LBSBaseComponent {
    constructor(params) {
        super()
        const {
            text = '',
            icon,
        } = params

        this.text = text
        this.icon = icon
    }
}

ko.components.register('lbs-menu-item', { viewModel: LBSMenuItemVM, template: limeMenuItemTemplate })
