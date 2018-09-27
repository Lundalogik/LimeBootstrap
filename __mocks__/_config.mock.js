export default {
    /**
    Enable or disable the debug console
    for the whole application
    * */
    debug: false,
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
       {name:'my-components', path:'__mocks__/my-component.js'},
   ],

    config: {
        index: {
            dataSources: [
                    { type: 'localization', source: '' },
            ],
            autorefresh: false,
        },

        helpdesk: {
            dataSources: [
                { type: 'activeInspector', source: '' },
                { type: 'localization', source: '' },
                { type: 'activeUser', source: '' },
                {
                    type: 'relatedRecord', source: 'person', view: 'name;phone;email;mobilephone', alias: 'person',
                },
                {
                    type: 'relatedRecord', source: 'company', view: 'name;phone', alias: 'company',
                },
            ],
            autorefresh: false,
        },

        todo: {
            dataSources: [
                { type: 'activeInspector', source: '' },
                { type: 'localization', source: '' },
                {
                    type: 'relatedRecord', source: 'person', view: 'name;phone;email;mobilephone', alias: 'person',
                },
                {
                    type: 'relatedRecord', source: 'company', view: 'name;phone', alias: 'company',
                },
            ],
            autorefresh: false,
        },

    },
}
