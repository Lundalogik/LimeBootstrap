import dataSource from './lbs.dataSource'

// Represents a request for data of a LimeObject from the rest API
export default class LimeObjects extends dataSource {
    /*
    * @param {number} id ID of the LimeObject
    */
    constructor({
        sort, sortOrder = 'desc', filter, limetype, fetchAll, limit = 10, ...rest
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
        this.fetchAll = fetchAll
    }

    addFilterParam(prop, operator, value) {
        const validOperators = ['>=', '<=', '!=', '=']
        if (!validOperators.includes(operator)) {
            throw new Error('Invalid operator. Must be one of ">=", "<=", "!=", "="')
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
        const filter = this.filter ? `${this.filter}` : ''
        const limit = `&limit=${this.limit}`
        const params = `${filter}${sort}${limit}`
        return `https://${this.serverURLComponent}/${this.databaseURLComponent}/api/v1/limeobject/${this.limetype}/?${params}`
    }

    async fetchNext() {
        const url = this.next === '' ? this.url : this.next
        return this.fetch(url)
    }

    async fetch(url = this.url) {
        let data = {}
        try {
            const response = await fetch(url, {
                headers: { sessionid: this.session },
            })
            data = JSON.parse(response).body
        } catch (e) {
            data = JSON.parse(lbs.common.executeVba(`LBSHelper.CRMEndpoint, ${url}, GET`))
        }
        this.next = data._links.next ? data._links.next.href : null

        if (this.fetchAll && this.next) {
            return [...data._embedded.limeobjects, ...await this.fetch(this.next)]
        }
        return data._embedded.limeobjects
    }
}
