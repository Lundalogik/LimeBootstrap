class Log {
    constructor() {
        this.verboseLevelEnum = {
            debug: 3,
            info: 2,
            warn: 1,
            error: 0,
        }
    }
    info(args) {
        if (lbs.debug && lbs.verboseLevel >= this.verboseLevelEnum.info) {
            console.info(args)
        }
    }
    warn(args) {
        if (lbs.debug && lbs.verboseLevel >= this.verboseLevelEnum.warn) {
            console.warn(args)
        }
    }
    error(args) {
        if (lbs.debug && lbs.verboseLevel >= this.verboseLevelEnum.error) {
            console.error(args)
        }
    }
    debug(args) {
        if (lbs.debug && lbs.verboseLevel >= this.verboseLevelEnum.debug) {
            console.debug(args)
        }
    }

    setVerboseLevel() {
        switch (lbs.externalConfig.verboseLevel) {
        case 'debug':
            lbs.verboseLevel = this.verboseLevelEnum.debug
            break
        case 'info':
            lbs.verboseLevel = this.verboseLevelEnum.info
            break
        case 'warn':
            lbs.verboseLevel = this.verboseLevelEnum.warn
            break
        case 'error':
            lbs.verboseLevel = this.verboseLevelEnum.error
            break
        default:
            lbs.verboseLevel = this.verboseLevelEnum.warn
            break
        }
    }
}

export default Log
