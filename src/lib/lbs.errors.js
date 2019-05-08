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

export class ResourceLoadError extends ExtendableError {
    constructor(app, resource) {
        super(`Resource '${resource}' failed to load`)
    }
}

export class EmptyDataSourceSet extends ExtendableError {
    constructor(possibelDataSourceTypes) {
        super(`Data source set doesn't contain any of the possible data source type '${possibelDataSourceTypes.join()}'`)
    }
}

export class UnknownDataSourceType extends ExtendableError {
    constructor(dataSourceType) {
        super(`Data source of type '${dataSourceType}' is unknown`)
    }
}

export class DataSourceLoadError extends ExtendableError {
    constructor(dataSource) {
        const dataSourceString = JSON.stringify(dataSource)
        super(`Failed to load data source '${dataSourceString}'`)
        this.dataSource = dataSourceString
    }
}

export class AppDataSourceLoadError extends ExtendableError {
    constructor(app, dataSource) {
        super(`App '${app}' failed to load data source '${dataSource}'`)
    }
}

export class AppTemplateLoadError extends ExtendableError {
    constructor(app, templatePath) {
        super(`App '${app}' failed to load template ${templatePath}"`)
    }
}

export class AppInitilizationError extends ExtendableError {
    constructor(app) {
        super(`App '${app}' failed to initialize beacuse of an error. Check your apps code!`)
    }
}
