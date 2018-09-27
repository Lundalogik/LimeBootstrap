import Common from '../src/lib/lbs.common'

test('checks that the error text is not empty', () => {
    expect(Common.getErrorText().length).toBeGreaterThan(0)
})
