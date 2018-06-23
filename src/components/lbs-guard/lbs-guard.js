import ko from 'knockout'
import lbsLoadingIndicatorTemplate from './lbs-guard.tpl.html'

export default class Guard {
    constructor({ activeUserIsMemberInOneOfGroups, isNotNull }) {
        if (typeof activeUserIsMemberInOneOfGroups !== 'undefined' && typeof isNotNull !== 'undefined') {
            this.shouldRenderContent = lbs.activeUser.isMemberInOneOf(activeUserIsMemberInOneOfGroups) && isNotNull
        } else if (typeof activeUserIsMemberInOneOfGroups !== 'undefined') {
            this.shouldRenderContent = lbs.activeUser.isMemberInOneOf(activeUserIsMemberInOneOfGroups)
        } else if (typeof isNotNull !== 'undefined') {
            this.shouldRenderContent = Boolean(isNotNull)
        }
    }
}

ko.components.register('lbs-guard', { viewModel: Guard, template: lbsLoadingIndicatorTemplate })
