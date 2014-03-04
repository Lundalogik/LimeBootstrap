lbs.apploader = {

    /**
    holds a reference to all factory methods
    */
    appFactory : {},

    /**
    Register app
    */
    register: function (name,func) {
        this.appFactory[name] = func;
        lbs.log.debug("App '{0}' has been succesfully registered".format(name));
    },

    /**
    load all app configurations
    */
    identifyApps: function () {
        var path;
        var raw;
        var htmlNode;
        var config;
        var instanceConfig;
        var binding;
        var appName;
        var instance;
        var guid;

        $("[data-app]").each(function () {
            try {

                //try to parse input to app from view
                try {
                    eval('binding = ' + $(this).attr("data-app"))
                    appName = binding.app;
                    instanceConfig = binding.config;
                } catch (e1) {
                    e1.message = "App definition invalid\n" + e1.message;
                    throw e1;
                }

                //set basic properties
                path = "apps/" + appName + "/";
                htmlNode = $(this);
                guid = lbs.common.generateGuid();

                //load app
                if (!lbs.apploader.appFactory[appName]){
                    if (!lbs.loader.loadScript(path + 'app.js')) {
                        throw new Error("Could not find app " + appName);
                    }
                }

                //create an instance
                instance = new lbs.apploader.appFactory[appName]();

                //merge instance with app config
                if (instanceConfig) {
                    instance.config = lbs.common.mergeOptions(instance.config, instanceConfig, true);
                }
                
                
                //push resources
                lbs.loader.pushResources(instance.config.resources, path);

                //add app instance to lbs
                lbs.apps[guid] = lbs.apps[guid] || {};
                lbs.apps[guid].name = appName;
                lbs.apps[guid].path = path;
                lbs.apps[guid].node = htmlNode;
                lbs.apps[guid].instance = instance;


            } catch (e) {
                lbs.log.warn("Could not load app", e);
            }
        });

        return this;
    },

    /**
    Copy global viewmodel to app and add the datasources for the app
    */
    "buildApps": function () {
        var path;
        var appName;
        var htmlNode;

        $.each(lbs.apps, function (key, app) {

            //to-be viewmodel
            var vm = {};
            vm.localize = lbs.vm.localize;

            //load data
            vm = lbs.loader.loadDataSources(vm, app.instance.config.dataSources);
            lbs.apps[key].vm = vm;

        });

    },

    /**
    Initialize the app
    Make variables observable
    Apply bindings
    */
    "initializeApps": function () {
        var path;
        var appName;
        var htmlNode;

        $.each(lbs.apps, function (key, app) {

            appName = app.name;
            path = app.path;
            htmlNode = app.node;
            config = app.config;
            vm = lbs.apps[key].vm;

            //load view
            lbs.loader.loadView(path + 'app', htmlNode);

            //run initialize
            try {
                vm = app.instance.initialize(htmlNode ,vm);
                lbs.apps[key].vm = vm;
            } catch (e) {
                lbs.apps[key].vm = vm;
                lbs.log.error("Could not intialize app: " + appName,e);
            }

            //apply bindings
            try {
                lbs.log.debug('App ' + appName + ' ViewModel: ' + JSON.stringify(ko.toJS(vm)));
                ko.applyBindings(vm, htmlNode.get(0));
            } catch (e) {
                lbs.log.warn(lbs.common.nl2br("Binding of data to view failed for app: " + appName + "\n Displaying mapping attributes"));
                lbs.log.exception(e);
            }

        });

    }

}
