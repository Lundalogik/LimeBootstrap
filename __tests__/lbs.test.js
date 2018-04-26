import lbs from '../src/lib/lbs'
import config from '../__mocks__/_config.mock'

lbs.externalConfig = config

beforeAll(() => {
    window.lbs = lbs
    // see issue https://github.com/facebook/jest/issues/5124 for window.location
    window.history.pushState({}, '', '?id=1001&session=123-abc-567&server=lime-core&database=core#company')
    lbs.setup()
})

test('A URL hash should be parsed and set activeClass', () => {
    expect(lbs.activeClass).toEqual('company')
})

test('URL parameters for id should be parsed', () => {
    expect(lbs.activeInspectorId).toEqual(1001)
})

test('URL parameters for session should be parsed', () => {
    expect(lbs.session).toEqual('123-abc-567')
})

test('URL parameters for server should be parsed', () => {
    expect(lbs.activeServer).toEqual('lime-core')
})

test('URL parameters for database should be parsed', () => {
    expect(lbs.activeDatabase).toEqual('core')
})
