import Bakery from '../src/lib/lbs.bakery'

test('It should set and get a cookie', () => {
    const bakery = new Bakery('company')
    bakery.setCookie('My coookiiiee!', 1)
    expect(bakery.getCookie('My coookiiiee!')).toEqual('1')
})

test('It should set and get an JSON cookie', () => {
    const bakery = new Bakery('company')
    bakery.setCookie('json', { hello: 'world' })
    expect(bakery.getCookieJSON('json')).toEqual({ hello: 'world' })
})

test('It should return undefined if there is no cookie for getJSON', () => {
    const bakery = new Bakery('company')
    expect(bakery.getCookieJSON('test')).toEqual(undefined)
})
