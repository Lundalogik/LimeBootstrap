import ko from 'knockout'
import LBSBaseComponent from '../lbs-base-component/lbs-base-component'
import lbsDropdownMenuTemplate from './lbs-dropdown-menu.tpl.html'

class LBSDropdownMenu extends LBSBaseComponent {
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
            menuPosition = 'left',
        } = params
        if (!['right', 'left'].includes(menuPosition)) {
            lbs.log.warn('Param [menuPosition] must be either left or right!')
        }

        this.listItems = LBSDropdownMenu.mapItems(items)
        this.color = color
        this.title = title
        this.fullWidth = fullWidth
        this.icon = icon
        this.borderless = borderless
        this.position = heroMenu ? 'top-right' : ''
        this.menuPosition = this.position === 'top-right' ? 'left' : menuPosition
    }

    static mapItem({
        type = 'item',
        label = '',
        icon = '',
        vba = null,
        click = () => {},
    }) {
        return { type, label, icon, vba, click }
    }

    static mapItems(items) {
        return items.map((item) => {
            if (typeof item === 'object') {
                return LBSDropdownMenu.mapItem(item)
            }
            return { label: item, type: 'item' }
        })
    }
}

ko.components.register('lbs-dropdown-menu', { viewModel: LBSDropdownMenu, template: lbsDropdownMenuTemplate })
