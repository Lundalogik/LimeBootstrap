import ko from 'knockout'
import limeButtonGroupTemplate from './lbs-button-group.tpl.html'
import LBSBaseComponent from '../lbs-base-component/lbs-base-component'

class LimeSplitButtonVM extends LBSBaseComponent {

}

ko.components.register('lbs-button-group', { viewModel: LimeSplitButtonVM, template: limeButtonGroupTemplate })
