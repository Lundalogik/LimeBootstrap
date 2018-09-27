import ko from 'knockout'
import lbsCardTemplate from './lbs-card.tpl.html'
import LBSBaseComponent from '../lbs-base-component/lbs-base-component'

class LBSCard extends LBSBaseComponent {
    constructor(params) {
        super()
        const {
            title = '',
            expanded = true,
            icon = null,
            color = 'default',
            expandable = true,
        } = params

        this.title = title
        this.cookieID = `menu-${this.title}`
        const expandedCookie = lbs.bakery.getCookieJSON(this.cookieID)
        this.expanded = ko.observable(expandedCookie ? expandedCookie.expanded : expanded)
        this.icon = icon
        this.expandable = expandable
        this.css = ko.computed(() => `${this.expanded() ? 'expanded' : ''}  lbs-card--${color}`)
    }

    toggle() {
        this.expanded(!this.expanded())
        lbs.bakery.setCookie(this.cookieID, { expanded: this.expanded() })
    }
}

ko.components.register('lbs-card', { viewModel: LBSCard, template: lbsCardTemplate })
