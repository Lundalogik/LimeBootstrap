import ko from 'knockout'
import lbsExpansionPanel from './lbs-expansion-panel.tpl.html'
import LBSBaseComponent from '../lbs-base-component/lbs-base-component'

class LBSExpansionPanel extends LBSBaseComponent {
    constructor(params) {
        super()
        const {
            title = '',
            expanded = true,
            icon = null,
            color = 'turquoise',
        } = params

        this.title = title
        this.cookieID = `menu-${this.title}`
        const expandedCookie = lbs.bakery.getCookieJSON(this.cookieID)
        this.expanded = ko.observable(expandedCookie ? expandedCookie.expanded : expanded)
        this.icon = icon
        this.css = ko.computed(() => `${this.expanded() ? 'expanded' : ''} ${color}`)
    }

    toggle() {
        this.expanded(!this.expanded())
        lbs.bakery.setCookie(this.cookieID, { expanded: this.expanded() })
    }
}

ko.components.register('lbs-expansion-panel', { viewModel: LBSExpansionPanel, template: lbsExpansionPanel })
