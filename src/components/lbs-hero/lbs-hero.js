import ko from 'knockout'
import lbsHeroTemplate from './lbs-hero.tpl.html'
import LBSBaseComponent from '../lbs-base-component/lbs-base-component'

class LBSHeroVM extends LBSBaseComponent {
    constructor(params) {
        super()
        const {
            header = '',
            color = 'blue',
            img,
        } = params

        this.header = header
        this.color = color
        this.img = `resources/${img}`
    }
}

ko.components.register('lbs-hero', { viewModel: LBSHeroVM, template: lbsHeroTemplate })
