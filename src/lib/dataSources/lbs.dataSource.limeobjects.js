import dataSource from './lbs.dataSource'

// Represents a request for data of a LimeObject from the rest API
export default class LimeObjects extends dataSource {
    /*
    * @param {number} id ID of the LimeObject
    */
    constructor({
        sort, sortOrder = 'desc', filter = '', limetype, fetchAll, limit = 10, ...rest
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
        this.limit = limit
        this.fetchAll = fetchAll
    }

    addFilterParam(prop, operator, value) {
        const validOperators = ['min', 'max', 'not', '=']
        if (!validOperators.includes(operator)) {
            throw new Error('Invalid operator. Must be one of "min", "max", "not", "="')
        }
        const prefix = ['min', 'max', 'not'].includes(operator) ? `${operator}-` : ''
        this.filter += `&${prefix}${prop}=${value}`
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
        const filter = this.filter ? `${this.filter}` : ''
        const limit = `&_limit=${this.limit}`
        const params = `${filter}${sort}${limit}`
        return `https://${this.serverURLComponent}/${this.databaseURLComponent}/api/v1/limeobject/${this.limetype}/?${params}`
    }

    async fetchNext() {
        const url = this.next === '' ? this.url : this.next
        return this.fetch(url)
    }

    async fetch(url = this.url) {
        const { body, ...rest } = await super._fetch(url, {
            headers: { sessionid: this.session },
        })

        this.next = body._links.next ? body._links.next.href : null

        if (this.fetchAll && this.next) {
            return [...body._embedded.limeobjects, ...await this.fetch(this.next)]
        }
        return body._embedded.limeobjects
    }
}
