import ko from 'knockout'

class ViewModel {
    constructor(params) {
        this.header = params.header || ''
        this.color = params.color || 'blue'
    }
}

const template = `
<div data-bind='css: color' class="header-container">
    <div class="header-icon"></div>
    <h2 data-bind="text:header"></h2>
    <!-- ko template: { nodes: $componentTemplateNodes } --><!-- /ko -->
</div>
`

ko.components.register('info-header', { viewModel: ViewModel, template })
