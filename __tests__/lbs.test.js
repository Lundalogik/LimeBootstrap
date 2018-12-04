import lbs from '../src/lib/lbs'
import config from '../__mocks__/_config.mock'


lbs.externalConfig = config

beforeAll(async () => {
    window.lbs = lbs
    // see issue https://github.com/facebook/jest/issues/5124 for window.location
    window.history.pushState({}, '', '?apsid=123-abc-567&apsrv=https://lime-core&apdb=core&apait=company&limeobjectid=1001&locale=en_us&apusr=%7B%0A%09%22groups%22%20:%20%0A%09%5B%0A%09%09%7B%0A%09%09%09%22id%22%20:%201,%0A%09%09%09%22isActive%22%20:%20true,%0A%09%09%09%22localName%22%20:%20%22Administrat%C3%B6rer%22,%0A%09%09%09%22name%22%20:%20%22Administrators%22%0A%09%09%7D%0A%09%5D,%0A%09%22id%22%20:%202901,%0A%09%22isAdmin%22%20:%20true,%0A%09%22isSuperUser%22%20:%20true,%0A%09%22name%22%20:%20%22Lime%20Administrator%22,%0A%09%22username%22%20:%20%22limeadmin%22%0A%7D')
    lbs.setActionPadEnvironment()
})

test('A URL hash should be parsed and set activeClass', () => {
    expect(lbs.activeClass).toEqual('company')
})

test('URL parameters for id should be parsed', () => {
    expect(lbs.activeLimeObjectId).toEqual(1001)
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

test('Language should be set', () => {
    expect(lbs.activeLocale).toEqual('en_us')
})
