lbs.externalConfig = {
    /**
    Enable or disable the debug console
    for the whole application
    * */
    debug: true,
    verboseLevel: 'debug',
    /*
    Verbose levels:
        debug	: 	Shows all log levels
        info	: 	Shows information level and up
        warn	: 	Shows warning level and up
        error	: 	Shows only error level logs

    */
    /**
    Configure special use cases,
    mainly when requiring additional datasources
    * */

    components: [

    ],

    config: {
        index: {
            dataSources: [
                { type: 'localization', source: '' },
            ],
            autorefresh: false,
        },
        company: {
            dataSources: [
                { type: 'activeLimeObject', embed: ['coworker'], protocol: 'http' },
                { type: 'relatedLimeObjects', limetype: 'person', alias: 'persons', protocol: 'http' },
                { type: 'translations', owner: 'company', alias: 'txt', protocol: 'http' },
                { type: 'customEndpoint', relativeUrl: 'person/expired/', alias: 'gdpr', protocol: 'http' },
            ],
        },
    },
}
