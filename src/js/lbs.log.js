const log = {
    verboseLevelEnum: {
        debug: 3,
        info: 2,
        warn: 1,
        error: 0,
    },
    log() {
        if (lbs.debug) {
            console.log.apply(console, arguments);
        }
    },
    info() {
        if (lbs.debug && lbs.verboseLevel >= log.verboseLevelEnum.info) {
            console.info.apply(console, arguments);
        }
    },
    warn() {
        if (lbs.debug && lbs.verboseLevel >= log.verboseLevelEnum.warn) {
            console.warn.apply(console, arguments);
        }
    },
    error() {
        if (lbs.debug && lbs.verboseLevel >= log.verboseLevelEnum.error) {
            console.error.apply(console, arguments);
        }
    },
    debug() {
        if (lbs.debug && lbs.verboseLevel >= log.verboseLevelEnum.debug) {
            console.debug.apply(console, arguments);
        }
    },
    setVerboseLevel() {
        switch (lbs.externalConfig.verboseLevel) {
        case 'debug':
            lbs.verboseLevel = lbs.log.verboseLevelEnum.debug
            break
        case 'info':
            lbs.verboseLevel = lbs.log.verboseLevelEnum.info
            break
        case 'warn':
            lbs.verboseLevel = lbs.log.verboseLevelEnum.warn
            break
        case 'error':
            lbs.verboseLevel = lbs.log.verboseLevelEnum.error
            break
        default:
            lbs.verboseLevel = lbs.log.verboseLevelEnum.warn
            break
        }
    },
}

export default log
