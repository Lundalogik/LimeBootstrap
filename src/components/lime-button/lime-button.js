import ko from 'knockout'
import limeButtonTemplate from './lime-button.tpl.html'
import Log from '../../lib/lbs.log'

class LimeButtonVM {
    constructor(params) {
        const {
            bootstrapClass = '',
            color = '',
            text = '',
            icon = '',
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

ko.components.register('lime-button', { viewModel: LimeButtonVM, template: limeButtonTemplate })
