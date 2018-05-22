import limeObjects from './lbs.dataSource.limeobjects'

export default class Translations extends limeObjects {
    constructor({ owner, ...rest }, session, server, database) {
        super({ rest }, session, server, database)
        this.filter = `owner=${owner}`
        this.limetype = 'localize'
    }

    async fetch(url = this.url) {
        const { body, ...rest } = await super._fetch(url, {
            headers: { sessionid: this.session },
        })

        const restructuredData = body._embedded.limeobjects.reduce(
            (leftHand, rightHand) => {
                const translation = rightHand[lbs.activeLocale]
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
