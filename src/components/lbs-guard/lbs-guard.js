import ko from 'knockout'
import lbsLoadingIndicatorTemplate from './lbs-guard.tpl.html'

export default class Guard {
    constructor({ groups }) {
        this.shouldRenderContent = lbs.activeUser.isMemberInOneOf(groups)
    }
}

ko.components.register('lbs-guard', { viewModel: Guard, template: lbsLoadingIndicatorTemplate })
