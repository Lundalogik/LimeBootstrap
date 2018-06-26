import ko from 'knockout'
import lbsLoadingIndicatorTemplate from './lbs-guard.tpl.html'

export default class Guard {
    constructor({ activeUserIsMemberInOneOfGroups, exists }) {
        if (typeof activeUserIsMemberInOneOfGroups !== 'undefined' && typeof exists !== 'undefined') {
            this.shouldRenderContent = lbs.activeUser.isMemberInOneOf(activeUserIsMemberInOneOfGroups) && exists
        } else if (typeof activeUserIsMemberInOneOfGroups !== 'undefined') {
            this.shouldRenderContent = lbs.activeUser.isMemberInOneOf(activeUserIsMemberInOneOfGroups)
        } else if (typeof exists !== 'undefined') {
            this.shouldRenderContent = Boolean(exists)
        }
    }
}

ko.components.register('lbs-guard', { viewModel: Guard, template: lbsLoadingIndicatorTemplate })
