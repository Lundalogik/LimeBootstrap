export default class DataSource {
    constructor({ type, source, alias = '' }) {
        this.type = type
        this.source = source
        this.alias = alias
    }

    async _fetch(url = '', settings = {}) {
        const { method = 'GET' } = settings
        const _settings = {
            mode: 'cors',
        }
        try {
            const response = await fetch(url, { ...settings, ..._settings })
            return response
        } catch (e) {
            lbs.log.info(`Using VBA fallback method for data source ${this.type}`)
            const payload = settings.body ? `, ${btoa(settings.body)}` : ''
            return {
                body: lbs.common.executeVba(`LBSHelper.CRMEndpoint, ${url}, ${method}${payload}`),
                status: 'Fetched through VBA... No idea',
            }
        }
    }

    static fetch() {
        throw { name: 'NotImplementedError', message: 'Should be implemented by subclass' }
    }
}
