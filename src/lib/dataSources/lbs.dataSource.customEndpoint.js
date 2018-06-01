import dataSource from './lbs.dataSource'

// Represents a request for data of a LimeObject from the rest API
export default class CustomEndpoint extends dataSource {
    constructor({ relativeUrl, ...rest }, session, server, database) {
        super(rest, session, server, database)
        this.relativeUrl = relativeUrl
    }

    get url() {
        let url = this.relativeUrl
        if (this.relativeUrl.charAt(0) !== '/') { // Prepend slash
            url = `/${url}`
        }
        if (this.relativeUrl.charAt(this.relativeUrl.length - 1) !== '/') { // Append slash
            url = `${url}/`
        }
        return `${super.serverURL}${url}`
    }

    async get() {
        const response = await super._fetch(this.url, {
        })
        return response.json()
    }

    async post(data) {
        const response = await super._fetch(this.url, {
            body: JSON.stringify(data),
            method: 'POST',
        })
        return response.json()
    }

    async put(data) {
        const response = await super._fetch(this.url, {
            body: JSON.stringify(data),
            method: 'PUT',
        })
        return response.json()
    }

    async delete(data) {
        const response = await super._fetch(this.url, {
            body: JSON.stringify(data),
            method: 'DELETE',
        })
        return response.json()
    }
}
