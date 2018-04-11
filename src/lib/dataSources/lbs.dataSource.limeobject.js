import dataSource from './lbs.dataSource'

export default class LimeObject extends dataSource {
    constructor({ id, limetype, ...rest }) {
        super(rest)
        this.id = id
        this.limetype = limetype
    }

    async fetch() {
        const response = fetch(`/api/${this.limetype}/${this.id}/`, {
            headers: { 'x-session': lbs.session },
        })
        return response
    }
}
