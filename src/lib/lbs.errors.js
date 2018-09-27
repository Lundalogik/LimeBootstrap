class ExtendableError extends Error {
    constructor(message) {
        super(message)
        this.name = this.constructor.name
        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor)
        } else {
            this.stack = (new Error(message)).stack
        }
    }
}

export class NotYetImplementedError extends ExtendableError {
    constructor(
        message = 'The method you tried invoking has not yet been implemented... Go make a pull request!',
    ) {
        super(message)
    }
}

export class SetupError extends ExtendableError {}

export class StupidVBAParameterError extends ExtendableError {}
