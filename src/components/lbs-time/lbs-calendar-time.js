import ko from 'knockout'
import moment from 'moment'
import timeTemplate from './lbs-time.tpl.html'

export default class CalendarTime {
    constructor(params) {
        this.time = moment(params.time).calendar()
    }
}

ko.components.register('lbs-calendar-time', { viewModel: CalendarTime, template: timeTemplate })
