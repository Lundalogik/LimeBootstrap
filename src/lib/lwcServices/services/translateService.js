import Messages from 'messageformat/messages'
import MessageFormat from 'messageformat'
import LwcTranslations from '../../dataSources/lbs.dataSource.lwcTranslations'
import { NotYetImplementedError, SetupError } from '../../lbs.errors';

export default class TranslateService {
    constructor(locale) {
        this.init(locale);
    }

    async init(locale) {
        const endpoint = await new LwcTranslations(
            lbs.session,
            lbs.activeServer,
            lbs.activeDatabase,
        )
        const translations = await endpoint.get()
        const mf = new MessageFormat(locale)
        const msgData = mf.compile(translations)
        this.messages = new Messages(msgData, locale)
    }

    get(key, params) {
        const result = this.messages.get(key, params)
        console.log('TranslateService.get result:', result)
        return result
    }
}
