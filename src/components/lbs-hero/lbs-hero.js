import ko from 'knockout'
import lbsHeroTemplate from './lbs-hero.tpl.html'
import LBSBaseComponent from '../lbs-base-component/lbs-base-component'

class LBSHeroVM extends LBSBaseComponent {
    constructor(params) {
        super()
        const {
            header = '',
            color = 'turquoise',
            img = `${lbs.activeClass}.png`,
            menuItems = [],
        } = params

        this.header = header
        this.color = color
        this.img = `resources/${img}`
        this.menuItems = menuItems
    }
}

ko.components.register('lbs-hero', { viewModel: LBSHeroVM, template: lbsHeroTemplate })
