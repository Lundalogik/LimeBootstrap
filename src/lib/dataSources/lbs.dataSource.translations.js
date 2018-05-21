import limeObjects from './lbs.dataSource.limeobjects'

export default class Translations extends limeObjects {
    constructor({ owner, ...rest }, session, server, database) {
        super({ rest }, session, server, database)
        this.filter = `owner=${owner}`
        this.limetype = 'localize'
    }

    async fetch(url = this.url) {
        let data = {}

        try {
            const response = await fetch(url, {
                headers: { sessionid: this.session },
            })
            data = JSON.parse(response).body
        } catch (e) {
            data = JSON.parse(lbs.common.executeVba(`LBSHelper.CRMEndpoint, ${url}, GET`))
        }

        const restructuredData = data._embedded.limeobjects.reduce(
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

        if (data._links.next) {
            return { ...restructuredData, ...await this.fetch(data._links.next.href) }
        }

        return restructuredData
    }
}
