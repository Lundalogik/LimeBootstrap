import f from 'jest-fetch-mock'

import LimeObject from '../src/lib/dataSources/lbs.dataSource.limeobject'
import companyResponse from '../__mocks__/api_response_lime_core_company'
import dealEmbedResponse from '../__mocks__/api_response_lime_core_deal_embed'

global.fetch = f

beforeEach(() => {
    fetch.resetMocks()
})

describe('Getting data from the crm api through a datasource', () => {
    const dataSourceLiteral = { id: 1010, limetype: 'company' }
    const limeObject = new LimeObject(dataSourceLiteral, '123-abc', 'lime-core', 'lime_core_v6_0')

    test('It should parse the body to an object', async () => {
        fetch.once(JSON.stringify(companyResponse))
        const d = await limeObject.fetch()
        expect(d.name).toEqual('AB testforetaget (DEMO)')
    })

    test('It should use use a correct URL', () => {
        limeObject.fetch()
        expect(fetch.mock.calls[0][0]).toEqual('https://lime-core/lime_core_v6_0/api/v1/limeobject/company/1010/')
    })

    test('It should set the correct header', () => {
        limeObject.fetch()
        expect(fetch.mock.calls[0][1].headers).toEqual({ sessionid: '123-abc' })
    })
})

describe('Getting data from the crm api with embedded limetypes', () => {
    const dataSourceLiteral = { id: 1028, limetype: 'deal', embed: ['company', 'person', 'coworker'] }
    const limeObject = new LimeObject(dataSourceLiteral, '123-abc', 'lime-core', 'lime_core_v6_0')

    test('Embeded data should be parsed', async () => {
        fetch.once(JSON.stringify(dealEmbedResponse))
        const d = await limeObject.fetch()
        expect(d._embedded.relation_company.name).toEqual('Testforetagetsklubben A/S (DEMO)')
    })

    test('It should use use a correct URL', () => {
        limeObject.fetch()
        expect(fetch.mock.calls[0][0]).toEqual('https://lime-core/lime_core_v6_0/api/v1/limeobject/deal/1028/?_embed=company&_embed=person&_embed=coworker')
    })
})

