import ko from 'knockout'
import lbsSearchTemplate from './lbs-search.tpl.html'
import LBSBaseComponent from '../lbs-base-component/lbs-base-component'

class LBSSearch extends LBSBaseComponent {
    constructor({
        filter = ko.observable(''),
        clear,
        icon = 'fa-search',
        placeholder,
        showList = ko.observable(false),
    }) {
        super()

        this.filter = filter
        this.showList = showList
        this.clear = clear
        this.icon = icon
        this.placeholder = placeholder
    }
}

ko.components.register('lbs-search', { viewModel: LBSSearch, template: lbsSearchTemplate })
