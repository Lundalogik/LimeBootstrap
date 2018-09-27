import ko from 'knockout'
import limeMenuTemplate from './lbs-menu.tpl.html'
import LBSBaseComponent from '../lbs-base-component/lbs-base-component'

class LBSMenuVM extends LBSBaseComponent {
    constructor(params) {
        super()
        const {
            title = '',
            expanded = true,
        } = params

        this.title = title
        this.cookieID = `menu-${this.title}`
        const expandedCookie = lbs.bakery.getCookieJSON(this.cookieID)
        this.expanded = ko.observable(expandedCookie ? expandedCookie.expanded : expanded)
    }

    toggle() {
        this.expanded(!this.expanded())
        lbs.bakery.setCookie(this.cookieID, { expanded: this.expanded() })
    }
}

ko.components.register('lbs-menu', { viewModel: LBSMenuVM, template: limeMenuTemplate })
