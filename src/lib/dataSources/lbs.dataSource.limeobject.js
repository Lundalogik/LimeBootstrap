import dataSource from './lbs.dataSource'

// Represents a request for data of a LimeObject from the rest API
export default class LimeObject extends dataSource {
    /*
    * @param {number} id ID of the LimeObject
    */
    constructor({ id, limetype, ...rest }, session) {
        super(rest)
        this.id = id
        this.limetype = limetype
        this.session = session
    }

    async fetch() {
        const response = await fetch(`/api/${this.limetype}/${this.id}/`, {
            headers: { 'x-session': this.session },
        })
        return JSON.parse(response.body)
    }
}
