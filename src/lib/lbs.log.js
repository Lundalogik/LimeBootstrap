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
        } if (!this.running && this.endTime) {
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
        try {
            if (lbs.debug && lbs.verboseLevel >= this.verboseLevelEnum.info) {
                console.info(args)
                Log._logToWindowsEventLog(args, 0)
            }
        } catch (e) {
            console.error(e)
        }
    }

    warn(args) {
        try {
            lbs.debugVm.warnings(lbs.debugVm.warnings() + 1)
            if (lbs.debug && lbs.verboseLevel >= this.verboseLevelEnum.warn) {
                console.warn(args)
                Log._logToWindowsEventLog(args, 2)
            }
        } catch (e) {
            console.error(e)
        }
    }

    error(args) {
        try {
            lbs.debugVm.errors(lbs.debugVm.errors() + 1)
            if (lbs.debug && lbs.verboseLevel >= this.verboseLevelEnum.error) {
                console.error(args)
                Log._logToWindowsEventLog(args, 1)
            }
        } catch (e) {
            console.error(e)
        }
    }

    debug(args) {
        try {
            if (lbs.debug && lbs.verboseLevel >= this.verboseLevelEnum.debug) {
                console.debug(args)
                Log._logToWindowsEventLog(args, 0)
            }
        } catch (e) {
            console.error(e)
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

    setVerboseLevel(verboseLevel) {
        switch (verboseLevel) {
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
            lbs.log.warn('Unknown verbosity level, setting level to "warn"')
            break
        }
    }

    static _logToWindowsEventLog(msg, level) {
        if (lbs.hasLimeConnection && lbs.debugLogToEventViewer) {
            try {
                const logMsg = `${lbs.activeView}.html: ${msg}`
                lbs.limeDataConnection.Run('LBSHelper.writeEventLog', `'${btoa(logMsg)}'`, `'${level}'`)
            } catch (e) {
                console.error('Failed to write to Windows EventLog', e)
            }
        }
    }
}

export default Log
