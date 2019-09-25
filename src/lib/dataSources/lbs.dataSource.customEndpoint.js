import dataSource from './lbs.dataSource'

// Represents a request for data of a LimeObject from the rest API
export default class CustomEndpoint extends dataSource {
    constructor({ relativeUrl, params, ...rest }, session, server, database) {
        super(rest, session, server, database)
        this.relativeUrl = relativeUrl
        this.params = params
    }

    get url() {
        let url = this.relativeUrl
        if (this.relativeUrl.charAt(0) !== '/') { // Prepend slash
            url = `/${url}`
        }
        if (this.relativeUrl.charAt(this.relativeUrl.length - 1) !== '/' && !url.indexOf('?')) { // Append slash
            url = `${url}/`
        }
        if (this.params) {
            url = `${url}?${this.params}`
        }
        return `${super.serverURL}${url}`
    }

    async fetch() {
        return this.get()
    }

    async get() {
        const response = await super._fetch(this.url, {
        })
        const data = await response.json()
        return data
    }

    async post(payload) {
        const response = await super._fetch(this.url, {
            body: JSON.stringify(payload),
            method: 'POST',
        })
        const data = await response.json()
        return data
    }

    async put(payload) {
        const response = await super._fetch(this.url, {
            body: JSON.stringify(payload),
            method: 'PUT',
        })
        const data = await response.json()
        return data
    }

    async delete(payload) {
        const response = await super._fetch(this.url, {
            body: JSON.stringify(payload),
            method: 'DELETE',
        })
        const data = await response.json()
        return data
    }
}
