limejs = limejs || {};
limejs.app = {

    "loadApps": function () {
        var path;
        var appName;
        var htmlNode;
        var config;

        $("[data-app]").each(function () {
            appName = $(this).attr("data-app")
            path = "apps/" + appName + "/";
            htmlNode = $(this);

            config = limejs.loader.loadConfig(path + 'config.json', true, function (config) { });
            limejs.loader.pushResources(config.resources, path);

            limejs.appsMetaData[appName] = limejs.appsMetaData[appName] || {};
            limejs.appsMetaData[appName].config = config;
            limejs.appsMetaData[appName].name = appName;
            limejs.appsMetaData[appName].path = path;
            limejs.appsMetaData[appName].node = htmlNode;
        });

        return this;
    },

    "InitializeApps": function () {
        var path;
        var appName;
        var htmlNode;

        $.each(limejs.appsMetaData, function (key, value) {

            appName = value.name
            path = value.path
            htmlNode = value.node
            dataType = value.config.data.type
            dataSource = value.config.data.source

            //to-be viewmodel
            var vm = {};

            //load view
            limejs.loader.loadView(path + appName, htmlNode);

            //load data
            vm = limejs.app.getAppModelData(appName, dataType, dataSource);

            //run initialize
            try{
                limejs.appsMetaData[key].vm = limejs.apps[appName].initialize(vm);
            } catch (e) {
                limejs.appsMetaData[key].vm = vm;
                limejs.log.error("Could not intialize app: " + appName);
                limejs.log.exception(e);
            }

            //apply bindings
            try {
                ko.applyBindings(vm, htmlNode.get(0));
            } catch (e) {
                limejs.log.warn(limejs.common.nl2br("Binding of data to view failed for app: "+appName+"\n Displaying mapping attributes"));
                limejs.log.exception(e);
                limejs.loader.setFallBackDummyData(htmlNode);
            }

        });

        console.log(limejs.appsMetaData);

        return this;
    },

    getAppModelData: function (appName, dataType, dataSource) {
        var data = {};

        switch (dataType) {
            case 'xml':
                data = limejs.executeVba(dataSource);
                if (data != null) {
                    data = $.parseJSON(xml2json($.parseXML(data), ""));
                    data = limejs.common.mergeOptions(limejs.vm, data);
                    limejs.log.info("App data loaded: " + appName)
                } else {
                    limejs.log.warn("App failed to load data: " + appName)
                }
                break;
            case 'record':
                data = limejs.executeVba(dataSource);
                if (data != null) {
                    data = limejs.loader.recordToJSON(data);
                    data = limejs.common.mergeOptions(limejs.vm, data);
                    limejs.log.info("App data loaded: " + appName)
                } else {
                    limejs.log.warn("App failed to load data: " + appName)
                }
                break;
            case 'records':
                data = limejs.executeVba(dataSource);
                if (data != null) {
                    data = limejs.loader.recordsToJSON(data);
                    data = limejs.common.mergeOptions(limejs.vm, data);
                    limejs.log.info("App data loaded: " + appName)
                } else {
                    limejs.log.warn("App failed to load data: " + appName)
                }
                break;
            case 'none':

                break;
        }

        return data;
    }
}
