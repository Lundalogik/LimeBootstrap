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

    defaultRestDataSources: false,

    dataSources: {
        index: {
            dataSources: [
                { type: 'localization', source: '' },
            ],
        },
        company: {
            dataSources: [
                { type: 'activeLimeObject', embed: ['coworker'], protocol: 'https' },
                { type: 'relatedLimeObjects', limetype: 'person', alias: 'persons', protocol: 'https' },
                { type: 'translations', owner: 'company', alias: 'txt', protocol: 'https' },
            ],
        },
    },
}
