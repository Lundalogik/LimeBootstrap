import ko from 'knockout'
import lbsIconTemplate from './lbs-icon.tpl.html'
import LBSBaseComponent from '../lbs-base-component/lbs-base-component'

class LBSIconVM extends LBSBaseComponent {
    constructor(params) {
        super()
        const {
            icon,
        } = params

        this.icon = `fa ${icon}`
    }
}

ko.components.register('lbs-icon', { viewModel: LBSIconVM, template: lbsIconTemplate })
