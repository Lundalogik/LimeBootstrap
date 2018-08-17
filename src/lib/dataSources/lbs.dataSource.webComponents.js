import dataSource from './lbs.dataSource'

export default class WebComponents extends dataSource {
    constructor({ ...rest }, session, server, database) {
        super(rest, session, server, database)
    }

    async fetch() {
        const response = await super._fetch(`${this.protocol}://${this.serverURLComponent}/webclient/plugins/webcomponents`)

        const body = await response.json()

        return { ...body }
    }
}
