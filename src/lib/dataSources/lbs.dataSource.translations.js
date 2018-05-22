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
                const { _id, sv, en_us, da, no, fi } = rightHand
                return {
                    ...leftHand,
                    [rightHand.code]: {
                        _id,
                        sv,
                        en_us,
                        da,
                        no,
                        fi,
                    },
                }
            }, {},
        )

        if (body._links.next) {
            return { ...restructuredData, ...await this.fetch(body._links.next.href) }
        }

        return restructuredData
    }
}
