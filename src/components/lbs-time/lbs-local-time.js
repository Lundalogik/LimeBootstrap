import ko from 'knockout'
import moment from 'moment'
import timeTemplate from './lbs-time.tpl.html'

export default class LocalTime {
    constructor(params) {
        const format = params.format || 'LLLL'
        this.time = moment(params.time).format(format)
    }
}

ko.components.register('lbs-local-time', { viewModel: LocalTime, template: timeTemplate })
