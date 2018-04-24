import lbs from '../src/lib/lbs'
import config from '../__mocks__/_config.mock'

lbs.externalConfig = config

test('A URL should be parsed', () => {
    // see issue https://github.com/facebook/jest/issues/5124 for window.location
    window.lbs = lbs
    lbs.setup()
    expect(lbs.activeInspector).toEqual('company')
})
