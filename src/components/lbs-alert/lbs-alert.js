import ko from 'knockout'
import lbsAlertTemplate from './lbs-alert.tpl.html'
import LBSBaseComponent from '../lbs-base-component/lbs-base-component'

class LBSAlertVM extends LBSBaseComponent {
    constructor(params) {
        super()
        const {
            text = '',
            icon,
            alertType = 'info',
        } = params


        this.text = text
        this.icon = icon
        this.alertType = `alert-${alertType}`
    }
}

ko.components.register('lbs-alert', { viewModel: LBSAlertVM, template: lbsAlertTemplate })
