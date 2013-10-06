lbs.loader = {

    /**
    Attrbutes
    */
    systemLibPath: "system/",
    scripts: [],
    styles: [],
    libs: [],

    /**
    Add resources from config to load-lists
    */
    "pushResources": function (data, appPath) {
        var path;

        if (typeof data == 'undefined') {
            return;
        }
        $.each(data.scripts, function (i) {
            path = appPath == '/' ? lbs.loader.systemLibPath + 'js/' : appPath;
            lbs.loader.scripts.push(path + data.scripts[i]);
        })

        $.each(data.libs, function (i) {
            path = lbs.loader.systemLibPath + 'js/';
            lbs.loader.libs.push(path + data.libs[i]);
        })

        $.each(data.styles, function (i) {
            path = appPath == '/' ? lbs.loader.systemLibPath + 'css/' : appPath;
            lbs.loader.styles.push(path + data.styles[i]);
        })
    },

    /**
    Process load-list and fetch all resources
    */
    "loadResources": function () {

        lbs.loader.scripts = lbs.loader.scripts.filter(this.uniqueFilter)
        lbs.loader.styles = lbs.loader.styles.filter(this.uniqueFilter)
        lbs.loader.libs = lbs.loader.libs.filter(this.uniqueFilter)

        lbs.log.debug("Scripts to load:" + lbs.loader.scripts);
        lbs.log.debug("Styles to load: " + lbs.loader.styles);
        lbs.log.debug("Libs to load: " + lbs.loader.libs);

        $.each(lbs.loader.scripts, function (i) {
            lbs.loader.loadScript(lbs.loader.scripts[i]);
        })

        $.each(lbs.loader.styles, function (i) {
            lbs.loader.loadStyle(lbs.loader.styles[i]);
        })

        $.each(lbs.loader.libs, function (i) {
            lbs.loader.loadScript(lbs.loader.libs[i]);
        })

    },

    /**
    Fetch and run a script from disk
    */
    "loadScript": function (val) {
        var js = document.createElement("script");
        js.type = "text/javascript";
        js.src = val;
        document.body.appendChild(js);
        return true;
    },

    /**
    Fetch and load a style from disk
    */
    "loadStyle": function (val) {
        $('<link/>', { rel: 'stylesheet', type: 'text/css', href: val }).appendTo('head');
    },

    /**
    Fetch template from disk and insert into selected element
    */
    "loadView": function (file, element) {
        try {
            file = file + ".html";
            element.load(file, function (response, status, xhr) {
                if (response.indexOf('<script') != -1) {
                    lbs.log.error('View "' + file + '" containes scripts, it is not allowed to be loaded')
                    //replace element with funnt image
                    element.html('<img src="' + lbs.loader.systemLibPath + 'img/YouDidntSayTheMagicWord.gif" />');
                }
                else if (status == "error") {
                    lbs.log.error('View "' + file + '" could not be loaded');
                } else {
                    lbs.log.info('View "' + file + '" loaded successfully');
                }
            })
        } catch (e) {
            lbs.log.warn("Resource could not be found. If using Chrome or IE11, make sure --file-access-from-file is enabled");
            lbs.log.warn('View "' + file + '" could not be loaded, using fallback loading through LWS');
            var s = ""
            s = lbs.common.executeVba("LWS.loadHTTPResource," + file);
            if (s !== "") {
                element.html(s);
                lbs.log.info('View "' + file + '" loaded successfully');
            } else {
                lbs.log.error('View "' + file + '" could not be loaded');
            }
        }
    },

    /**
    Load all datasources in set to the selected viewmodel
    */
    loadDataSources: function (vm, dataSources) {
        $.each(dataSources, function (key, source) {
            vm = lbs.loader.loadDataSource(vm, source);
        })
        return vm;
    },

    /**
    Load a datasource to the selected viewmodel
    */
    loadDataSource: function (vm, dataSource) {
        var data = {};

        lbs.log.debug('Loading data source: ' + dataSource.type + ':' + dataSource.source)

        try {
            switch (dataSource.type) {
                case 'activeInspector':
                    try {
                        var record = lbs.limeDataConnection.ActiveInspector.Record
                        data = lbs.loader.controlsToJSON(lbs.limeDataConnection.ActiveControls);
                    } catch (e) {
                        lbs.log.warn("Failed to load datasource: " + dataSource.type + ':' + dataSource.source)
                    }
                    break;
                case 'xml':
                    data = lbs.common.executeVba(dataSource.source);
                    if (data != null) {
                        data = $.parseJSON(xml2json($.parseXML(data), ""));
                    } else {
                        lbs.log.warn("Failed to load datasource: " + dataSource.type + ':' + dataSource.source)
                    }
                    break;
                case 'record':
                    data = lbs.common.executeVba(dataSource.source);
                    if (data != null) {
                        data = lbs.loader.recordToJSON(data);
                    } else {
                        lbs.log.warn("Failed to load datasource: " + dataSource.type + ':' + dataSource.source)
                    }
                    break;
                case 'records':
                    data = lbs.common.executeVba(dataSource.source);
                    if (data != null) {
                        data = lbs.loader.recordsToJSON(data);
                    } else {
                        lbs.log.warn("Failed to load datasource: " + dataSource.type + ':' + dataSource.source)
                    }
                    break;
                case 'localization':
                    var k = lbs.common.executeVba("Localize.getDictionaryKeys");
                    var d = lbs.common.executeVba("Localize.getDictionary");
                    var parsedData
                    var collecton = {};

                    //return empty object if missing or no language support
                    if (!d || !k) {
                        lbs.log.warn("Localization dictionary could not be loaded");
                        parsedData = {};
                    } else {
                        parsedData = lbs.loader.dictionaryToJSON(k, d);

                        $.each(parsedData, function (key, value) {
                            keysplit = key.split("$$");
                            collecton[keysplit[0]] = collecton[keysplit[0]] || {};
                            collecton[keysplit[0]][keysplit[1]] = value
                        })
                    }
                    data.localize = collecton;
                    break;
            }

            //merge options into the viewModel
            vm = lbs.common.mergeOptions(vm, data || {});
        } catch (e) {
            lbs.log.warn("Failed to load datasource: " + dataSource.type + ':' + dataSource.source,e)
        }

        return vm;
    },

    /**
    Only return unique values
    */
    "uniqueFilter": function (e, i, arr) {
        return arr.lastIndexOf(e) === i;
    },

    /**
    Transform a VBA dictionary to JSON.
    A collection with keys is needed as the keys method is not transported to JS
    */
    "dictionaryToJSON": function (keys, dic) {
        var key, value;
        var json = {};

        for (var i = 1; i <= dic.count; i++) {
            key = keys(i);
            value = dic.item(key);
            json[key] = value;
        }

        return json;

    },

    /**
    Transform a VBA record to JSON
    */
    "recordToJSON": function (record) {
        var nbrOfFields = record.Fields.Count;
        var className = record.Class.Name
        var attr;
        var json = {};
        json[className] = {};

        for (var i = 1; i <= nbrOfFields; i++) {
            attr = record.Fields(i).Name;
            json[className][attr] = {};
            json[className][attr]["text"] = record.Text(i);
            json[className][attr]['value'] = record.Value(i);
            if (record.Fields(i).Type == 16) { //Relation
                json[className][attr]['class'] = record.Fields(i).LinkedField.Class.Name;
            }
            if (record.Fields(i).Type == (19 || 18)) { //Option or Set
                json[className][attr]['key'] = record.GetOptionKey(i);
            }

        }
        return json;

    },

    /**
    Transform controls on activeInspector to JSON
    */
    "controlsToJSON": function (controls) {
        var nbrOfControls = controls.Count;
        var className = controls.Class.Name
        var attr;
        var json = {};
        json[className] = {};

        for (var i = 1; i <= nbrOfControls; i++) {
            attr = controls(i).Field.Name;
            json[className][attr] = {};
            json[className][attr]["text"] = controls(i).Text;
            json[className][attr]['value'] = controls(i).Value;
            if (controls(i).Field.Type == 16) { //Relation
                json[className][attr]['class'] = controls(i).Field.LinkedField.Class.Name;
            }
            if (controls(i).Field.Type == (19 || 18)) { //Option or Set
                json[className][attr]['key'] = controls(i).OptionKey;
            }

        }
        return json;

    },



}
