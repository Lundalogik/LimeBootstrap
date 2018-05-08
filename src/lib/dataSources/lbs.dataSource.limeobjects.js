import dataSource from './lbs.dataSource'

// Represents a request for data of a LimeObject from the rest API
export default class LimeObjects extends dataSource {
    /*
    * @param {number} id ID of the LimeObject
    */
    constructor({
        sort, sortOrder = 'desc', filter, limetype, ...rest
    }, session, server, database) {
        super(rest)
        this.filter = filter
        this.sort = sort
        this.sortOrder = sortOrder === 'asc' ? '-' : ''
        this.params = [this.filter, this.sort]
        this.limetype = limetype
        this.session = session
        this.serverURLComponent = encodeURI(server)
        this.databaseURLComponent = encodeURI(database)
        this.next = ''
    }

    addFilterParam(prop, operator, value) {
        const validOperators = ['>=', '<=', '!=', '==']
        if (!validOperators.includes(operator)) {
            throw new Error('Invalid operator. Must be one of ">=", "<=", "!=", "=="')
        }
        this.filter += `&${prop}${operator}${value}`
    }

    resetFilterParams() {
        this.filter = ''
    }

    setSortOrder(sort, sortOrder = 'desc') {
        if (!['desc', 'asc'].includes(sortOrder)) {
            lbs.log.warn('Invalid sortOrder. Must be one of "desc", "asc"')
        }
        this.sort = sort
        this.sortOrder = sortOrder === 'asc' ? '-' : ''
    }

    get url() {
        const sort = this.sort ? `&sort=${this.sortOrder}${this.sort}` : ''
        const filter = this.filter ? `&${this.filter}` : ''
        const params = `${filter}${sort}`
        return `https://${this.serverURLComponent}/${this.databaseURLComponent}/api/v1/limeobject/${this.limetype}/${params}`
    }

    async fetchNext() {
        return this.fetch(true)
    }

    async fetch(next = false) {
        const url = next ? this.next : this.url
        const response = await fetch(url, {
            headers: { 'x-session': this.session },
        })
        const body = JSON.parse(response.body)
        this.next = body._links.next
        return body._embedded.limeobjects
    }
}
