import dataSource from './lbs.dataSource'

export default class LwcTranslations extends dataSource {
    constructor(session, server, database) {
        super({}, session, server, database)
    }

    get url() {
        return `${this.protocol}://${this.serverURLComponent}/webclient/translations`
    }

    async get() {
        console.log('LwcTranslations this.url:', this.url)
        const response = await super._fetch(this.url, {})
        console.log('LwcTranslations.get response:', response)
        const data = await response.json()
        console.log('LwcTranslations.get data:', data)
        return data
    }
}
