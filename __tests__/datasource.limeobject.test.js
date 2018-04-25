import f from 'jest-fetch-mock'


import LimeObject from '../src/lib/dataSources/lbs.dataSource.limeobject'

global.fetch = f

test('It should parse the body to an object', async () => {
    fetch.once(JSON.stringify({ a: 1 }))
    const limeObject = new LimeObject({ id: 1001, limetype: 'company' }, '123-abc')
    const d = await limeObject.fetch()
    expect(d.a).toEqual(1)
})

test('It should use use a correct URL', () => {
    fetch.once(JSON.stringify({ a: 1 }))
    const limeObject = new LimeObject({ id: 1001, limetype: 'company' }, '123-abc')
    limeObject.fetch()
    expect(fetch.mock.calls[0][0]).toEqual('/api/company/1001/')
})

test('It should set the correct header', () => {
    fetch.once(JSON.stringify({ a: 1 }))
    const limeObject = new LimeObject({ id: 1001, limetype: 'company' }, '123-abc')
    limeObject.fetch()
    expect(fetch.mock.calls[0][1].headers).toEqual({ 'x-session': '123-abc' })
})


test('It should set the correct ', async () => {
    fetch.once()
    const limeObject = new LimeObject({ id: 1001, limetype: 'company' }, '123-abc')
    limeObject.fetch()
    expect(fetch.mock.calls[0][1].headers).toEqual({ 'x-session': '123-abc' })
})
