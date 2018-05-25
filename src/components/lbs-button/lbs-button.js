import ko from 'knockout'
import LBSBaseComponent from '../lbs-base-component/lbs-base-component'
import lbsButtonTemplate from './lbs-button.tpl.html'

class LBSButtonVM extends LBSBaseComponent {
    constructor(params) {
        super()

        const {
            bootstrapClass = '',
            color = 'lime-green',
            text = '',
            icon = null,
            centered = false,
            fullWidth = true,
        } = params
        this.text = text
        this.icon = icon
        this.bootstrapClass = bootstrapClass
        this.centered = centered
        this.color = color
        this.fullWidth = fullWidth ? 'full-width' : ''
        this.cssClasses = [this.bootstrapClass, this.color, this.fullWidth]

        if (this.color && this.bootstrapClass) {
            this.log.warn(
                `Cannot combine css classes '${this.bootstrapClass}' and '${this.color}'`,
            )
        }
        if (this.centered) {
            this.cssClasses.push('centered')
        }

        this.css = this.cssClasses.join(' ')
    }
}

ko.components.register('lbs-button', { viewModel: LBSButtonVM, template: lbsButtonTemplate })
