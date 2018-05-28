import ko from 'knockout'
import limeListItemTemplate from './lbs-list-item.tpl.html'
import LBSBaseComponent from '../lbs-base-component/lbs-base-component'

class LBSListItemVM extends LBSBaseComponent {
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

ko.components.register('lbs-list-item', { viewModel: LBSListItemVM, template: limeListItemTemplate })
