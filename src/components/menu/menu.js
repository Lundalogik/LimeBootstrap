import ko from 'knockout'
import template from './menu.tpl.html'

class ViewModel {
    constructor(params) {
        this.header = params.expandable
        this.color = params.collapsed
    }
}

ko.components.register('menu', { viewModel: ViewModel, template })
