import { Timer } from '../lib/lbs.log'

test('You should be able to start a timer', () => {
    const t = new Timer()
    t.start()
    expect(t.startTime != null)
})

test('A timer should report elapsed time at anytime', () => {
    const t = new Timer()
    t.start()
    const time = t.getEllapsedTime()
    expect(time > 0)
})

test('A timer should be able to be restared', () => {
    const t = new Timer()
    t.start()
    t.stop()
    const starttime = Object.assign({}, t.startTime)
    t.start()

    expect(t.startTime === starttime)
})

test('A timer should not change starttime if called multiple times', () => {
    const t = new Timer()
    t.start()
    const starttime = Object.assign({}, t.startTime)
    t.start()

    expect(t.startTime === starttime)
})

test('Calling start on a stoped timer should reset endtime', () => {
    const t = new Timer()
    t.start()
    t.stop()
    t.start()
    expect(t.endTime === null)
})
