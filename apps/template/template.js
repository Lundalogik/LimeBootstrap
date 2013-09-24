limejs.apps.template = {

    //config
    config: {
        dataSources: [
            
        ],
        resources: {
            scripts: ['template.js'],
            styles: ['template.css'],
            libs: ['json2xml.js']
        }
    },

    //initialize
    initialize: function (viewModel) {

        //Use this method to setup you app. 
        //
        //The data you requested along with activeInspector are delivered in the variable viewModel.
        //You may make any modifications you please to it or replace is with a entirely new one before returning it.
        //The returned viewmodel will be used to build your app.

        viewModel.myappname = 'Min App heter Template';


        return viewModel;
    }
}