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
            
            limejs.loader.loadConfig(path + 'config.json', true, function (config) {
                console.log(config);
                limejs.loader.pushResources(config.resources, path);
            });

            limejs.apps.push({
                "name": appName,
                "config": config,
                "path": path,
                "node": htmlNode
            })
        });

        return this;
    },

    "InitializeApps": function () {
        var path;
        var appName;
        var htmlNode;
        $().each(limejs.apps, function (i) {
            appName = limejs.apps[i].name
            path = limejs.apps[i].path
            htmlNode = limejs.apps[i].node
            dataType = limejs.apps[i].config.data.type
            dataSource = limejs.apps[i].config.data.source
            var data;

            switch (dataSource){
                case 'xml':
                    data = limejs.executeVba(dataSource);
                    if (data != null) {
                        data = $.parseJSON(xml2json($.parseXML(data), ""));
                        window[appName].initalize(data);
                        limejs.log.info("App loaded: " + appName)
                    } else {
                        limejs.log.warn("App failed to load data: " + appName)
                    }
                    break;
                case 'record':
                    data = limejs.executeVba(dataSource);
                    if (data != null) {
                        data = limejs.loader.recordToJSON(data);
                        window[appName].initalize(data);
                        limejs.log.info("App loaded: " + appName)
                    } else {
                        limejs.log.warn("App failed to load data: " + appName)
                    }
                    break;
                case 'records':
                    data = limejs.executeVba(dataSource);
                    if (data != null) {
                        data = limejs.loader.recordsToJSON(data);
                        window[appName].initalize(data);
                        limejs.log.info("App loaded: " + appName)
                    } else {
                        limejs.log.warn("App failed to load data: " + appName)
                    }
                    break;
                case 'none':
                    window[appName].initalize();
                    break;
            }


        });

        return this;
    },
}
