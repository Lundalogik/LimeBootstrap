import dataSource from './lbs.dataSource'

export default class RuntimeConfig extends dataSource {
    constructor({ packageName, ...rest }, session, server, database) {
        super(rest, session, server, database)
        this.packageName = packageName
    }

    get url() {
        let url = this.packageName ? `${this.packageName}/` : ''
        return `${super.serverURL}/lime-admin/config/${url}`
    }

    async fetch() {
        return this.get()
    }

    async get() {
        const response = await super._fetch(this.url)
        const data = await response.json()
        return data
    }
}
