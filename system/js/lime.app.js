limejs = limejs || {};
limejs.app = {

    "loadApps": function () {
        var path;
        var appName;
        var htmlNode;
        var config;
        $("[data-app]").each(function () {
            appName = $(this).attr("data-app")
            path = "../apps/" + appName + "/";
            htmlNode = $(this);

            limejs.loader.loadConfig(path + 'config.json', true, function (config) {
                limejs.loader.pushResources(config, path);
            });

            limejs.apps.push({
                "name": appName,
                "dataObject": $(this).attr("data-object"),
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

            var data = limejs.executeVba(limejs.apps[i].dataObject);
            if (data != null) {
                data = $.parseJSON(xml2json($.parseXML(data), ""));
                limejs.log.info("App loaded: " + appName)
                //console.log(appName + ".initalize(" + data + ","+ htmlNode +")");
                //eval(appName + ".initalize(" + "test" + ","+ "test2" +")");
            }
        });

        return this;
    },
}
