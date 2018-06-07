import ko from 'knockout'
import moment from 'moment'
import timeTemplate from './lbs-time.tpl.html'

export default class RelativeTime {
    constructor(params) {
        this.time = moment(params.time).fromNow()
    }
}

ko.components.register('lbs-relative-time', { viewModel: RelativeTime, template: timeTemplate })
