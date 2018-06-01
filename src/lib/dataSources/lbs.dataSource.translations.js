import LimeObjects from './lbs.dataSource.limeobjects'

export default class Translations extends LimeObjects {
    constructor({ owner, locale, ...rest }, session, server, database) {
        super(rest, session, server, database)
        this.filter = `owner=${owner}`
        this.limetype = 'localize'
        this.locale = locale
    }

    async fetch(url = this.url) {
        const response = await super._fetch(url)

        const body = await response.json()

        const restructuredData = body._embedded.limeobjects.reduce(
            (leftHand, rightHand) => {
                const translation = rightHand[this.locale]
                return {
                    ...leftHand,
                    [rightHand.code]: translation,
                }
            }, {},
        )

        if (body._links.next) {
            return { ...restructuredData, ...await this.fetch(body._links.next.href) }
        }

        return restructuredData
    }
}
