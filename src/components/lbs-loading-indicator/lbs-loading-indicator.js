import ko from 'knockout'
import lbsLoadingIndicatorTemplate from './lbs-loading-indicator.tpl.html'

export default class LoadingIndicator {
    constructor({ loading, size = 'md' }) {
        this.loading = loading
        this.validSizes = ['sm', 'md', 'lg', 'xl']
        this.size = this.getSize(size)
    }

    getSize(size) {
        switch (size) {
        case 'sm':
            return ''
        case 'md':
            return 'fa-lg'
        case 'lg':
            return 'fa-2x'
        case 'xl':
            return 'fa-3x'
        default:
            lbs.log.warn(`Loader size must be on of ${this.validSizes.join(', ')}`)
            return 'fa-lg'
        }
    }
}

ko.components.register('lbs-loading-indicator', { viewModel: LoadingIndicator, template: lbsLoadingIndicatorTemplate })
