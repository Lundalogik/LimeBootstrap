import f from 'jest-fetch-mock'

import CustomEndpoint from '../src/lib/dataSources/lbs.dataSource.customEndpoint'
import { personResponse, bulkConsentPayload, bulkConsentPostResponse, bulkConsentDeleteResponse, bulkConsentDeletePayload } from '../__mocks__/api_response_gdpr'

global.fetch = f

beforeEach(() => {
    fetch.resetMocks()
})

describe('Getting data from the crm api through a datasource', () => {
    const dataSourceLiteral = { relativeUrl: '/person/expired/' }
    const myEndpoint = new CustomEndpoint(dataSourceLiteral, '123-abc', 'lime-core', 'lime_core_v6_0')

    test('It should be able to GET from an endpoint', async () => {
        fetch.once(JSON.stringify(personResponse))
        const d = await myEndpoint.get()
        const personData = d
        expect(personData.person[0]).toEqual(1034)
    })

    test('It should be able to POST to an endpoint', async () => {
        fetch.once(JSON.stringify(bulkConsentPostResponse))
        const d = await myEndpoint.post(bulkConsentPayload)
        const data = d
        expect(data.key).toEqual('bulk_anonymized')
        expect(fetch.mock.calls[0][1].body).toEqual(JSON.stringify(bulkConsentPayload))
        expect(fetch.mock.calls[0][1].method).toEqual('POST')
    })

    test('It should be able to PUT to an endpoint', async () => {
        fetch.once(JSON.stringify(bulkConsentPostResponse))
        const d = await myEndpoint.put(bulkConsentPayload)
        const data = d
        expect(data.key).toEqual('bulk_anonymized')
        expect(fetch.mock.calls[0][1].body).toEqual(JSON.stringify(bulkConsentPayload))
        expect(fetch.mock.calls[0][1].method).toEqual('PUT')
    })


    test('It should be able to DELETE to an endpoint', async () => {
        fetch.once(JSON.stringify(bulkConsentDeleteResponse))
        const d = await myEndpoint.delete(bulkConsentDeletePayload)
        const data = d
        expect(data.key).toEqual('bulk_anonymize_request_delete')
        expect(fetch.mock.calls[0][1].body).toEqual(JSON.stringify(bulkConsentDeletePayload))
        expect(fetch.mock.calls[0][1].method).toEqual('DELETE')
    })

    test('It should use use a correct URL', () => {
        myEndpoint.get()
        expect(myEndpoint.url).toEqual('https://lime-core/lime_core_v6_0/person/expired/')
    })

    test('It should build correct URL regardless of of /', () => {
        const dataSource1 = { relativeUrl: '/person/expired/' }
        const e1 = new CustomEndpoint(dataSource1, '123-abc', 'lime-core', 'lime_core_v6_0')
        const dataSource2 = { relativeUrl: 'person/expired/' }
        const e2 = new CustomEndpoint(dataSource2, '123-abc', 'lime-core', 'lime_core_v6_0')
        const dataSource3 = { relativeUrl: '/person/expired' }
        const e3 = new CustomEndpoint(dataSource3, '123-abc', 'lime-core', 'lime_core_v6_0')
        const dataSource4 = { relativeUrl: 'person/expired' }
        const e4 = new CustomEndpoint(dataSource4, '123-abc', 'lime-core', 'lime_core_v6_0')
        expect(e1.url).toEqual('https://lime-core/lime_core_v6_0/person/expired/')
        expect(e2.url).toEqual('https://lime-core/lime_core_v6_0/person/expired/')
        expect(e3.url).toEqual('https://lime-core/lime_core_v6_0/person/expired/')
        expect(e4.url).toEqual('https://lime-core/lime_core_v6_0/person/expired/')
    })

    test('It should set the correct header', () => {
        myEndpoint.get()
        expect(fetch.mock.calls[0][1].headers).toEqual({ sessionid: '123-abc' })
    })
})

