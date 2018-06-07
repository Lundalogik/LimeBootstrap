import ko from 'knockout'
import lbsLoadingIndicatorTemplate from './lbs-loading-indicator.tpl.html'

export default class LoadingIndicator {
    constructor(params) {
        this.loading = params.loading
    }
}

ko.components.register('lbs-loading-indicator', { viewModel: LoadingIndicator, template: lbsLoadingIndicatorTemplate })
