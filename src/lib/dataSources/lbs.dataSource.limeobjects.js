import dataSource from './lbs.dataSource'

// Represents a request for data of a LimeObject from the rest API
export default class LimeObjects extends dataSource {
    /*
    * @param {number} id ID of the LimeObject
    */
    constructor({
        sort, sortOrder = 'desc', filter = '', limetype, fetchAll, embed = [], limit = 10, ...rest
    }, session, server, database) {
        super(rest, session, server, database)
        this.filter = filter
        this.sort = sort
        this.sortOrder = sortOrder === 'asc' ? '-' : ''
        this.params = [this.filter, this.sort]
        this.limetype = limetype
        this.embed = embed
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
        const embed = this.embed.length > 0 ? `&_embed=${this.embed.join('&_embed=')}` : ''
        const params = `${filter}${sort}${limit}${embed}`

        return `${super.serverURL}/api/v1/limeobject/${this.limetype}/?${params}`
    }

    async fetchNext() {
        const url = this.next === '' ? this.url : this.next
        return this.fetch(url)
    }

    async fetch(url = this.url) {
        const response = await super._fetch(url)
        const body = await response.json()
        this.next = body._links.next ? body._links.next.href : null

        if (this.fetchAll && this.next) {
            return [...body._embedded.limeobjects, ...await this.fetch(this.next)]
        }
        return body._embedded.limeobjects.map((limeobject) => {
            const relationData = this.embed.reduce((acc, el) => {
                const retval = (acc[el] = (limeobject._embedded ? limeobject._embedded[`relation_${el}`] : null), acc)
                return retval
            }, {})

            return {
                ...limeobject,
                ...relationData,
            }
        })
    }
}
