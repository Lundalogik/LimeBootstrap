import dataSource from './lbs.dataSource'

// Represents a request for data of a LimeObject from the rest API
export default class CustomEndpoint extends dataSource {
    constructor({ relativeUrl, ...rest }, session, server, database) {
        super(rest)
        this.relativeUrl = relativeUrl
        this.session = session
        this.serverURLComponent = encodeURI(server)
        this.databaseURLComponent = encodeURI(database)
    }

    get url() {
        let url = this.relativeUrl
        if (this.relativeUrl.charAt(0) !== '/') { // Prepend slash
            url = `/${url}`
        }
        if (this.relativeUrl.charAt(this.relativeUrl.length - 1) !== '/') { // Append slash
            url = `${url}/`
        }
        return `https://${this.serverURLComponent}/${this.databaseURLComponent}${url}`
    }

    async get() {
        const response = await super._fetch(this.url, {
            headers: { sessionid: this.session },
        })
        return JSON.parse(response.body)
    }

    async post(data) {
        const response = await super._fetch(this.url, {
            headers: { sessionid: this.session },
            body: JSON.stringify(data),
            method: 'POST',
        })
        return JSON.parse(response.body)
    }

    async put(data) {
        const response = await super._fetch(this.url, {
            headers: { sessionid: this.session },
            body: JSON.stringify(data),
            method: 'PUT',
        })
        return JSON.parse(response.body)
    }

    async delete(data) {
        const response = await super._fetch(this.url, {
            headers: { sessionid: this.session },
            body: JSON.stringify(data),
            method: 'DELETE',
        })
        return JSON.parse(response.body)
    }
}
