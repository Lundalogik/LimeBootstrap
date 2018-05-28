import ko from 'knockout'
import LBSBaseComponent from '../lbs-base-component/lbs-base-component'
import lbsButtonTemplate from './lbs-button.tpl.html'

class LBSButtonVM extends LBSBaseComponent {
    constructor(params) {
        super()

        const {
            bootstrapClass = '',
            color = 'turquoise',
            text = '',
            icon = null,
            centered = false,
            fullWidth = true,
            borderless = false,
            outline = false,
        } = params
        this.text = text
        this.icon = icon
        this.bootstrapClass = bootstrapClass
        this.centered = centered
        this.color = color
        this.fullWidth = fullWidth ? 'full-width' : ''
        this.borderless = borderless ? 'borderless' : ''
        this.btnIcon = text === '' ? 'btn-icon' : ''
        this.btnOutline = outline ? 'btn-outline' : ''
        this.cssClasses = [
            this.bootstrapClass,
            this.color,
            this.fullWidth,
            this.borderless,
            this.btnIcon,
            this.btnOutline,
        ]

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
