import ko from 'knockout'
import infoHeaderTemplate from './info-header.tpl.html'

class InfoHeaderVM {
    constructor(params) {
        this.header = params.header || ''
        this.color = params.color || 'blue'
        this.img = `resources/${params.img}`
    }
}

ko.components.register('info-header', { viewModel: InfoHeaderVM, infoHeaderTemplate })


