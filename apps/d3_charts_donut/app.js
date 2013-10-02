lbs.app.register('d3_charts_donut',function(){

    //config
    this.config = {
        dataSources: [

        ],
        resources: {
            scripts: [],
            styles: ['app.css'],
            libs: ['d3.v3.min.js']
        }
    },

    //initialize
    this.initialize = function (viewModel, element) {

        viewModel.name = 'Chart Donut';

        return viewModel;
    },

    this.buildChart = function () {


    }


});