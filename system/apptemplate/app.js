lbs.apploader.register('%%APP_NAME%%', function () {
    var self = this;

    //config
    self.config = {
        dataSources: [],
        resources: {
            scripts: [],
            styles: ['app.css'],
            libs: []
        }, 
    },

    //initialize
    this.initialize = function (node,viewModel) {
        
        viewModel.myappname = 'This is an example app';
        viewModel.myapptext = 'The JS solution whould work nicely as <br />a template you know ;)';
        
        return viewModel;
    };
});