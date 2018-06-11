export class Timer {
    constructor() {
        this.startTime = null
        this.endTime = null
        this.running = false
    }

    start() {
        if (!this.startTime && !this.running) {
            this.startTime = performance.now()
        }
        this.endTime = null
        this.running = true
    }

    stop() {
        if (!this.endTime) {
            this.endTime = performance.now()
        }
        this.running = false
    }

    getEllapsedTime() {
        if (this.running && this.startTime) { // Timer still running
            return performance.now() - this.startTime
        } else if (!this.running && this.endTime) {
            return this.endTime - this.startTime
        }
        return null
    }
}

class Log {
    constructor() {
        this.verboseLevelEnum = {
            debug: 3,
            info: 2,
            warn: 1,
            error: 0,
        }
        this.timers = {}
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

    startTimer(name) {
        if (lbs.debug && lbs.verboseLevel >= this.verboseLevelEnum.debug) {
            this.timers[name] = new Timer()
            this.timers[name].start()
        }
    }

    stopTimer(name) {
        if (lbs.debug && lbs.verboseLevel >= this.verboseLevelEnum.debug) {
            const timer = this.timers[name]
            if (timer) {
                timer.stop()
                this.debug(`Event '${name}' took ${Math.round(timer.getEllapsedTime())}ms`)
                delete this.timers[name]
            } else {
                this.warn(`Timer '${name}' not found in active timers`)
            }
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
