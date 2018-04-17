import ko from 'knockout'
import LBSBaseComponent from '../lbs-base-component/lbs-base-component'
import limeButtonTemplate from './lbs-button.tpl.html'

class LimeButtonVM extends LBSBaseComponent {
    constructor(params) {
        super()
        const {
            bootstrapClass = '',
            color = 'lime-green',
            text = '',
            icon = null,
            centered = false,
        } = params

        this.text = text
        this.icon = icon
        this.bootstrapClass = bootstrapClass
        this.centered = centered
        this.color = color
        this.cssClasses = [this.bootstrapClass, this.color]

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

ko.components.register('lbs-button', { viewModel: LimeButtonVM, template: limeButtonTemplate })
