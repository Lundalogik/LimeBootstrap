import dataSource from './lbs.dataSource'

// Represents a request for data of a LimeObject from the rest API
export default class LimeObject extends dataSource {
    /*
    * @param {number} id ID of the LimeObject
    */
    constructor({
        id, limetype, embed, ...rest
    }, session, server, database) {
        super(rest)
        this.id = id
        this.limetype = limetype
        this.embed = embed || []
        this.session = session
        this.serverURLComponent = encodeURI(server)
        this.databaseURLComponent = encodeURI(database)
    }

    get url() {
        let url = `https://${this.serverURLComponent}/${this.databaseURLComponent}/api/v1/limeobject/${this.limetype}/${this.id}/`
        this.embed.forEach((element, index, array) => {
            if (index === 0) { // first element should have a preceeding "?"
                url += '?'
            }
            url += `_embed=${element}`
            if (index !== array.length - 1) { // Last element should not have a dangeling "&"
                url += '&'
            }
        })
        return url
    }

    async fetch() {
        const response = await fetch(this.url, {
            headers: { sessionid: this.session },
        })
        return JSON.parse(response.body)
    }
}
