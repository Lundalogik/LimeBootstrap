import { NotYetImplementedError } from '../lbs.errors'

export default class DataSource {
    constructor({
        type, source, alias = '', protocol = 'https',
    }, session, server, database) {
        this.type = type
        this.source = source
        this.alias = alias
        this.protocol = protocol
        this.session = session
        this.serverURLComponent = encodeURI(server)
        this.databaseURLComponent = encodeURI(database)
        this.protocol = protocol
    }

    get serverURL() {
        return `${this.protocol}://${this.serverURLComponent}/${this.databaseURLComponent}`
    }

    async _fetch(url = '', settings = {}) {
        const { method = 'GET' } = settings
        const _settings = {
            mode: 'cors',
            headers: { sessionid: this.session },
        }
        try {
            const response = await fetch(url, { ...settings, ..._settings })
            return response
        } catch (e) {
            lbs.log.info(`Using VBA fallback method for data source ${this.type}`)
            const payload = settings.body ? `, ${btoa(settings.body)}` : ''
            return {
                json: async () => JSON.parse(lbs.common.executeVba(`LBSHelper.CRMEndpoint, ${url}, ${method}${payload}`)),
                status: 'Fetched through VBA... No idea',
            }
        }
    }

    static fetch() {
        throw new NotYetImplementedError('Should be implemented by subclass')
    }
}
