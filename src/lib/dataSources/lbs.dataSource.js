export default class DataSource {
    constructor({ type, source, alias = '' }) {
        this.type = type
        this.source = source
        this.alias = alias
    }

    static fetch() {
        throw { name: 'NotImplementedError', message: 'Should be implemented by subclass' }
    }
}
