import { Timer } from '../lib/lbs.log'

test('You should be able to start a timer', () => {
    const t = new Timer()
    t.start()
    expect(t.startTime).not.toBeNull()
})

test('A timer should report elapsed time at anytime', () => {
    const t = new Timer()
    t.start()
    setTimeout(() => {
        const time = t.getEllapsedTime()
        expect(time).toBeGreaterThan(0)
    }, 5)
    jest.runAllTimers()
})

test('A timer should be able to be restared', () => {
    const t = new Timer()
    t.start()
    t.stop()
    const starttime = Object.assign({}, t.startTime)
    t.start()

    expect(t.startTime).toEqual(starttime)
})

test('A timer should not change starttime if called multiple times', () => {
    const t = new Timer()
    t.start()
    const starttime = Object.assign({}, t.startTime)
    t.start()

    expect(t.startTime).toEqual(starttime)
})

test('Calling start on a stoped timer should reset endtime', () => {
    const t = new Timer()
    t.start()
    t.stop()
    t.start()
    expect(t.endTime).toBeNull()
})
