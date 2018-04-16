import ko from 'knockout'
import limeButtonTemplate from './lbs-button.tpl.html'
import Log from '../../lib/lbs.log'

class LimeButtonVM {
    constructor(params) {
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
        this.logger = new Log()
        this.cssClasses = [this.bootstrapClass, this.color]

        if (this.color && this.bootstrapClass) {
            this.logger.warn(
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
