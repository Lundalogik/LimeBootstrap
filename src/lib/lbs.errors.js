class NotYetImplementedError extends Error {
    constructor(
        message = 'The method you tried invoking has not yet been implemented... Go make a pull request!',
    ) {
        super()
        this.name = 'Not yet implemented...'
        this.message = message
        Error.captureStackTrace(this, NotYetImplementedError)
    }
}

export default NotYetImplementedError
