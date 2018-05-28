import ko from 'knockout'
import limeListDividerTemplate from './lbs-list-divider.tpl.html'
import LBSBaseComponent from '../lbs-base-component/lbs-base-component'

class LBSListDividerVM extends LBSBaseComponent {

}

ko.components.register('lbs-list-divider', { viewModel: LBSListDividerVM, template: limeListDividerTemplate })
