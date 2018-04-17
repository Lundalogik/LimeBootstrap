import ko from 'knockout'
import limeSplitButtonTemplate from './lbs-split-button.tpl.html'
import LBSBaseComponent from '../lbs-base-component/lbs-base-component'

class LimeSplitButtonVM extends LBSBaseComponent {

}

ko.components.register('lbs-split-button', { viewModel: LimeSplitButtonVM, template: limeSplitButtonTemplate })
