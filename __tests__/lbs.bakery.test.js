import Bakery from '../src/lib/lbs.bakery'

test('It should set and get a cookie', () => {
    const bakery = new Bakery('company')
    bakery.setCookie('My coookiiiee!', 1)
    expect(bakery.getCookie()).toEqual('My coookiiiee!')
})
