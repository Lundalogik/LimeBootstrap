import f from 'jest-fetch-mock'

import LimeObject from '../src/lib/dataSources/lbs.dataSource.limeobject'
import companyResponse from '../__mocks__/api_response_lime_core_company'

global.fetch = f
const limeObject = new LimeObject({ id: 1010, limetype: 'company' }, '123-abc', 'lime-core', 'lime_core_v6_0')


test('It should parse the body to an object', async () => {
    fetch.once(JSON.stringify({ a: 1 }))
    const d = await limeObject.fetch()
    expect(d.a).toEqual(1)
})

test('It should use use a correct URL', () => {
    fetch.once(JSON.stringify({ a: 1 }))
    limeObject.fetch()
    expect(fetch.mock.calls[0][0]).toEqual('https://lime-core/lime_core_v6_0/api/v1/limeobject/company/1010/')
})

test('It should set the correct header', () => {
    fetch.once(JSON.stringify({ a: 1 }))
    limeObject.fetch()
    expect(fetch.mock.calls[0][1].headers).toEqual({ 'x-session': '123-abc' })
})


test('It should set the correct ', async () => {
    fetch.once(JSON.stringify(companyResponse))
    limeObject.fetch()
    expect(fetch.mock.calls[0][1].headers).toEqual({ 'x-session': '123-abc' })
})
