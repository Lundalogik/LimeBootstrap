limejs = limejs || {};
limejs.app = {

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

            if (!limejs.loader.loadScript(path + appName + '.js')) {
                limejs.log.error("Could not find app " + appName);
            }

            config = limejs.apps[appName].config;
            limejs.loader.pushResources(config.resources, path);

            limejs.appsMetaData[appName] = limejs.appsMetaData[appName] || {};
            limejs.appsMetaData[appName].config = config;
            limejs.appsMetaData[appName].name = appName;
            limejs.appsMetaData[appName].path = path;
            limejs.appsMetaData[appName].node = htmlNode;
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

        $.each(limejs.appsMetaData, function (key, value) {

            appName = value.name;
            path = value.path;
            htmlNode = value.node;
            config = value.config;

            //to-be viewmodel
            var vm = limejs.vm;

            //load data
            vm = limejs.loader.loadDataSources(vm, config.dataSources);
            limejs.appsMetaData[key].vm = vm;

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

        $.each(limejs.appsMetaData, function (key, value) {

            appName = value.name;
            path = value.path;
            htmlNode = value.node;
            config = value.config;
            vm = limejs.appsMetaData[key].vm;

            //load view
            limejs.loader.loadView(path + appName, htmlNode);

            //run initialize
            try {
                vm = ko.mapping.fromJS(vm);
                limejs.appsMetaData[key].vm = limejs.apps[appName].initialize(vm);
            } catch (e) {
                limejs.appsMetaData[key].vm = vm;
                limejs.log.exception(e);
                limejs.log.error("Could not intialize app: " + appName);
            }

            //apply bindings
            try {
                limejs.log.debug('App ' + appName + ' ViewModel: ' + JSON.stringify(ko.mapping.toJS(vm)));
                ko.applyBindings(vm, htmlNode.get(0));
            } catch (e) {
                limejs.log.warn(limejs.common.nl2br("Binding of data to view failed for app: " + appName + "\n Displaying mapping attributes"));
                limejs.log.exception(e);
                limejs.loader.setFallBackDummyData(htmlNode);
            }

        });

    }

}
