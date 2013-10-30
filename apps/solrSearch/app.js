lbs.apploader.register('solrSearch', function () {
    var self = this;

    //config
    this.config = {
        dataSources: [
        	//{type: 'records', source: 'Globals.testrecords',alias: 'rcsource'}
            // {type: 'record', source: 'Globals.testrecord',alias: 'rcsource'}
        ],
        resources: {
            scripts: ['solrClient.js'],
            styles: ['app.css'],
            libs: []
        },
        endpoint: 'http://XXX:yyy/solr/zzz',
    },

    //initialize
    this.initialize = function (node, viewModel) {
        var vm = new solrClient.viewModel();
        vm.endpoint = self.config.endpoint;
        vm.query("*");

        return vm;
    }
});