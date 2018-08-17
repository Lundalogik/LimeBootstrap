import NotYetImplementedError from '../lbs.errors'

export default class LWCPlatform {
    constructor() {
        this.type = 'LimeCRMDesktopClient'

        this.action = {
            get: () => { throw new NotYetImplementedError(); },
            register: () => { throw new NotYetImplementedError(); },
        }

        this.http = {
            delete: () => { throw new NotYetImplementedError(); },
            get: () => { throw new NotYetImplementedError(); },
            patch: () => { throw new NotYetImplementedError(); },
            post: () => { throw new NotYetImplementedError(); },
            put: () => { throw new NotYetImplementedError(); },
        }

        this.notifications = {
            alert: () => { throw new NotYetImplementedError(); },
            confirm: () => { throw new NotYetImplementedError(); },
            notify: () => { throw new NotYetImplementedError(); },
        }

        this.route = {
            dashboard: () => { throw new NotYetImplementedError(); },
            limeObject: () => { throw new NotYetImplementedError(); },
            table: () => { throw new NotYetImplementedError(); },
        }

        this.state = {
            subscribe: () => { throw new NotYetImplementedError(); },
        }

        this.translate = {
            get: () => { throw new NotYetImplementedError(); },
        }
    }
}
