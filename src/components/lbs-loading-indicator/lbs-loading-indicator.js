import ko from 'knockout'
import lbsLoadingIndicatorTemplate from './lbs-loading-indicator.tpl.html'

export default class LoadingIndicator {
    constructor({ loading, size = 'md' }) {
        this.loading = loading
        const validSizes = ['sm', 'md', 'lg', 'xl']

        switch (size) {
        case 'sm':
            this.size = ''
            break
        case 'md':
            this.size = 'fa-lg'
            break
        case 'lg':
            this.size = 'fa-2x'
            break
        case 'xl':
            this.size = 'fa-3x'
            break
        default:
            lbs.log.warn(`Loader size must be on of ${validSizes.join(', ')}`)
            this.size = 'fa-lg'
        }
    }
}

ko.components.register('lbs-loading-indicator', { viewModel: LoadingIndicator, template: lbsLoadingIndicatorTemplate })
