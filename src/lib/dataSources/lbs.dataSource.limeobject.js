import dataSource from './lbs.dataSource'

// Represents a request for data of a LimeObject from the rest API
export default class LimeObject extends dataSource {

    /**
     *Creates an instance of LimeObject.
     * @param {*} {
     *         id, limetype, embed, ...rest
     *     }
     * @param {string} session
     * @param {string} server
     * @param {string} database
     * @memberof LimeObject
     */
    constructor({
        id, limetype, embed, ...rest
    }, session, server, database) {
        super(rest, session, server, database)
        this.id = id
        this.limetype = limetype
        this.embed = embed || []
    }

    /**
     *
     * @readonly
     * @memberof LimeObject
     * @returns {string} The url to be used when fetchning
     */
    get url() {
        let url = `${super.serverURL}/api/v1/limeobject/${this.limetype}/${this.id}/`
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

    /**
     * Fetch data from the Lime CRM REST api
     *
     * @returns {Promise<object>} A Promise containing requested data
     * @memberof LimeObject
     */
    async fetch() {
        const response = await super._fetch(this.url)

        const body = await response.json()

        const relationData = this.embed.reduce((acc, el) => {
            const retval = (acc[el] = (body._embedded ? body._embedded[`relation_${el}`] : null), acc)
            return retval
        }, {})

        return {
            ...body,
            ...relationData,
        }
    }
}
