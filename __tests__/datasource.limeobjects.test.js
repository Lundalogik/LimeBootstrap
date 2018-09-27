import f from 'jest-fetch-mock'

import LimeObjects from '../src/lib/dataSources/lbs.dataSource.limeobjects'
import companyResponses from '../__mocks__/api_response_lime_core_companies'

global.fetch = f
const limeObjectNoFilter = new LimeObjects({ limetype: 'company' }, '123-abc', 'lime-core', 'lime_core_v6_0')


test('It should parse the body to an array of limeobjects', async () => {
    fetch.once(JSON.stringify(companyResponses[0]))
    const response = await limeObjectNoFilter.fetch()
    expect(response).toEqual(companyResponses[0]._embedded.limeobjects)
})

test('It should fetch next objects', async () => {
    fetch.once(JSON.stringify(companyResponses[0]))
    let response = await limeObjectNoFilter.fetch()
    expect(response).toEqual(companyResponses[0]._embedded.limeobjects)
    fetch.once(JSON.stringify(companyResponses[1]))
    response = await limeObjectNoFilter.fetchNext()
    expect(response).toEqual(companyResponses[1]._embedded.limeobjects)
})

test('It should use use a correct URL', () => {
    fetch.once(JSON.stringify(companyResponses[0]))
    limeObjectNoFilter.fetch()
    expect(fetch.mock.calls[0][0]).toEqual('https://lime-core/lime_core_v6_0/api/v1/limeobject/company/?&_limit=10')
})

test('It should set the correct header', () => {
    fetch.once(JSON.stringify(companyResponses[0]))
    limeObjectNoFilter.fetch()
    expect(fetch.mock.calls[0][1].headers).toEqual({ sessionid: '123-abc' })
})


// test('It should set the correct ', async () => {
//     fetch.once(JSON.stringify(companyResponse))
//     limeObject.fetch()
//     expect(fetch.mock.calls[0][1].headers).toEqual({ 'x-session': '123-abc' })
// })
