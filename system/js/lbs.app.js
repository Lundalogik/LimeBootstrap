lbs.app = {

    /**
    load all app configurations
    */
    "IdentifyApps": function () {
        var path;
        var appName;
        var htmlNode;
        var config;

        $("[data-app]").each(function () {
            appName = $(this).attr("data-app")
            path = "apps/" + appName + "/";
            htmlNode = $(this);

            if (!lbs.loader.loadScript(path + appName + '.js')) {
                lbs.log.error("Could not find app " + appName);
            }

            config = lbs.apps[appName].config;
            lbs.loader.pushResources(config.resources, path);

            lbs.appsMetaData[appName] = lbs.appsMetaData[appName] || {};
            lbs.appsMetaData[appName].config = config;
            lbs.appsMetaData[appName].name = appName;
            lbs.appsMetaData[appName].path = path;
            lbs.appsMetaData[appName].node = htmlNode;
        });

        return this;
    },

    /**
    Copy global viewmodel to app and add the datasources for the app
    */
    "buildAppViewModels": function () {
        var path;
        var appName;
        var htmlNode;

        $.each(lbs.appsMetaData, function (key, value) {

            appName = value.name;
            path = value.path;
            htmlNode = value.node;
            config = value.config;

            //to-be viewmodel
            var vm = lbs.vm;

            //load data
            vm = lbs.loader.loadDataSources(vm, config.dataSources);
            lbs.appsMetaData[key].vm = vm;

        });

    },

    /**
    Initialize the app
    Make variables observable
    Apply bindings
    */
    "InitializeApps": function () {
        var path;
        var appName;
        var htmlNode;

        $.each(lbs.appsMetaData, function (key, value) {

            appName = value.name;
            path = value.path;
            htmlNode = value.node;
            config = value.config;
            vm = lbs.appsMetaData[key].vm;

            //load view
            lbs.loader.loadView(path + appName, htmlNode);

            //run initialize
            try {
                vm = ko.mapping.fromJS(vm);
                lbs.appsMetaData[key].vm = lbs.apps[appName].initialize(vm);
            } catch (e) {
                lbs.appsMetaData[key].vm = vm;
                lbs.log.exception(e);
                lbs.log.error("Could not intialize app: " + appName);
            }

            //apply bindings
            try {
                lbs.log.debug('App ' + appName + ' ViewModel: ' + JSON.stringify(ko.mapping.toJS(vm)));
                ko.applyBindings(vm, htmlNode.get(0));
            } catch (e) {
                lbs.log.warn(lbs.common.nl2br("Binding of data to view failed for app: " + appName + "\n Displaying mapping attributes"));
                lbs.log.exception(e);
                lbs.loader.setFallBackDummyData(htmlNode);
            }

        });

    }

}
