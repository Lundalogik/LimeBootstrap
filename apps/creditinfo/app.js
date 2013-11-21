lbs.apploader.register('creditinfo', function () {
    var self = this;

    //config
    this.config = {
        customernbr : "5563970465",
        dataSources: [
           
        ],
        resources: {
            scripts: [],
            styles: ['app.css'],
            libs: []
        },
        customerLoginName : "",
        password : "",
        packageName : ""
    },

    //initialize
    this.initialize = function (node, viewModel) {
        
        viewModel.ratingValue = ko.observable();
        viewModel.ratingText = ko.observable();

        viewModel.getRating = function(){
            var ratingData = {};
            ratingData = lbs.loader.loadDataSources(ratingData, [{type: 'xml', source: 'CreditInfo.GetCompanyRating,556397-0465', alias:'creditdata'}], true);
            ratingData = ratingData.creditdata.DataImport2Result.Blocks.Block.Fields.Field
            
            viewModel.ratingValue(ratingData[0].Value)
            viewModel.ratingText(ratingData[1].Value)
        }

        return viewModel;
    }
});