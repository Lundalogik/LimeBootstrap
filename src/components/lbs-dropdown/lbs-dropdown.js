import ko from 'knockout'
import LBSBaseComponent from '../lbs-base-component/lbs-base-component'
import lbsDropdownTemplate from './lbs-dropdown.tpl.html'

class LBSDropdownTemplate extends LBSBaseComponent {
    constructor(params) {
        super()

        const {
            color = 'lime-green',
            title = '',
            icon = 'fa-caret-down',
            items = [],
            fullWidth = false,
        } = params
        this.listItems = LBSDropdownTemplate.mapItems(items)
        this.color = color
        this.title = title
        this.fullWidth = fullWidth
        this.icon = icon
    }

    static mapItems(items) {
        return items.map((item) => {
            if (typeof item === 'object') {
                let _item = item
                if (!item.label) {
                    lbs.log.warn('Object type item parameter in dropdown must have a label!')
                    _item = { ..._item, label: '' }
                }
                if (!item.label) {
                    _item = { ..._item, click: () => {} }
                }
                return _item
            }
            return { label: item }
        })
    }
}

ko.components.register('lbs-dropdown', { viewModel: LBSDropdownTemplate, template: lbsDropdownTemplate })
