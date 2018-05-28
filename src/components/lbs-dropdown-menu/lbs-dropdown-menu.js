import ko from 'knockout'
import LBSBaseComponent from '../lbs-base-component/lbs-base-component'
import lbsDropdownMenuTemplate from './lbs-dropdown-menu.tpl.html'

class LBSDropdownMenuTemplate extends LBSBaseComponent {
    constructor(params) {
        super()

        const {
            color = 'turquoise',
            title = '',
            icon = 'fa-caret-down',
            items = [],
            fullWidth = false,
            heroMenu = false,
            borderless = false,
        } = params
        this.listItems = LBSDropdownMenuTemplate.mapItems(items)
        this.color = color
        this.title = title
        this.fullWidth = fullWidth
        this.icon = icon
        this.borderless = borderless
        this.position = heroMenu ? 'top-right' : ''
    }

    static mapItems(items) {
        return items.map((item) => {
            if (typeof item === 'object') {
                let _item = item
                if (!item.label) {
                    lbs.log.warn('Object type item parameter in dropdown must have a label!')
                    _item = { ..._item, label: '' }
                }
                if (!item.click) {
                    _item = { ..._item, click: () => {} }
                }
                if (!item.icon) {
                    _item = { ..._item, icon: null }
                }
                if (!item.vba) {
                    _item = { ..._item, vba: null }
                }
                return _item
            }
            return { label: item }
        })
    }
}

ko.components.register('lbs-dropdown-menu', { viewModel: LBSDropdownMenuTemplate, template: lbsDropdownMenuTemplate })
