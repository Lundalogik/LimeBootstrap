limejs = limejs || {};
limejs.loader = {
    "systemLibPath" : "system/",

    "scripts": [],
    "styles": [],
    "libs": [],

    "pushResources": function (data, appPath) {
        var path;

        if (typeof data == 'undefined') {
            return;
        }
        $.each(data.scripts, function (i) {
            path = appPath == '/' ? limejs.loader.systemLibPath+'js/' : appPath;
            limejs.loader.scripts.push(path + data.scripts[i]);
        })

        $.each(data.libs, function (i) {
            path = limejs.loader.systemLibPath+'js/';
            limejs.loader.libs.push(path + data.libs[i]);
        })

        $.each(data.styles, function (i) {
            path = appPath == '/' ? limejs.loader.systemLibPath + 'css/' : appPath;
            limejs.loader.styles.push(path + data.styles[i]);
        })
    },

    "loadScript" : function(val){
        var success = false;
        $.getScript(val)
          .done(function( script, textStatus ) {
              success = true;
          })
          .fail(function( jqxhr, settings, exception ) {
              //limejs.log.exception(exception);
              limejs.log.error('failed to load script: ' + val);
          });
        return success;
    },
    "loadStyle": function (val) {
        $('<link/>', { rel: 'stylesheet', type: 'text/css', href: val }).appendTo('head');
    },

    "loadResources": function () {
        
        limejs.loader.scripts = limejs.loader.scripts.filter(this.uniqueFilter)
        limejs.loader.styles = limejs.loader.styles.filter(this.uniqueFilter)
        limejs.loader.libs = limejs.loader.libs.filter(this.uniqueFilter)

        limejs.log.debug("Scripts to load:" + limejs.loader.scripts);
        limejs.log.debug("Styles to load: " + limejs.loader.styles);
        limejs.log.debug("Libs to load: " + limejs.loader.libs);

        $.each(limejs.loader.scripts, function (i) {
            limejs.loader.loadScript(limejs.loader.scripts[i]);
        })

        $.each(limejs.loader.styles, function (i) {
            limejs.loader.loadStyle(limejs.loader.styles[i]);
        })

        $.each(limejs.loader.libs, function (i) {
            limejs.loader.loadScript(limejs.loader.libs[i]);
        })

    },

    "loadView": function (file, element) {
        try {
             file = file+".html";
             element.load(file, function (response, status, xhr) {
                if (status == "error") {
                    limejs.log.error('View "' + file + '" could not be loaded')
                } else {
                    limejs.log.info('View "' + file + '" loaded successfully');
                }
            })
        } catch (e) {
            limejs.log.error("Resource could not be found. If using Chrome, make sure --file-access-from-file is enabled", e);
        }

    },

    loadDataSources: function (vm, dataSources) {
        $.each(dataSources, function (key,source) {
            limejs.loader.loadDataSource(vm,source);
        })
        return vm;
    },

    loadDataSource: function (vm, dataSource) {
        var data = {};

        try{
            switch (dataSource.type) {
                case 'activeInspector':
                    try{
                        var record = limejs.limeDataConnection.ActiveInspector.Record
                        data = limejs.loader.controlsToJSON(limejs.limeDataConnection.ActiveControls);
                    } catch (e) {
                        limejs.log.warn("Failed to load datasource: " + dataSource.type + ':' + dataSource.source)
                    }
                    break;
                case 'xml':
                    data = limejs.common.executeVba(dataSource.source);
                    if (data != null) {
                        data = $.parseJSON(xml2json($.parseXML(data), ""));
                    } else {
                        limejs.log.warn("Failed to load datasource: " + dataSource.type + ':' + dataSource.source)
                    }
                    break;
                case 'record':
                    data = limejs.executeVba(dataSource.source);
                    if (data != null) {
                        data = limejs.loader.recordToJSON(data);
                    } else {
                        limejs.log.warn("Failed to load datasource: " + dataSource.type + ':' + dataSource.source)
                    }
                    break;
                case 'records':
                    data = limejs.executeVba(dataSource.source);
                    if (data != null) {
                        data = limejs.loader.recordsToJSON(data);
                    } else {
                        limejs.log.warn("Failed to load datasource: " + dataSource.type + ':' + dataSource.source)
                    }
                    break;
                case 'none':

                    break;
            }

            vm = limejs.common.mergeOptions(limejs.vm, data || {});
        }catch(e){
            limejs.log.exception(e);
            limejs.log.error("Failed to load datasource: " + dataSource.type+':'+dataSource.source)
        }

        return vm;
    },

    "loadLocalization": function () {
        var keys = limejs.common.executeVba("Localize.getDictionaryKeys");
        var data = limejs.common.executeVba("Localize.getDictionary");
        var parsedData;
        var vm = {};
        //return empty object if missing or no language support
        if (!data || !keys) {
            limejs.log.warn("Localization dictionary could not be loaded");
            parsedData = {};
        } else {
            parsedData = limejs.loader.dictionaryToJSON(keys, data);

            $.each(parsedData, function (key, value) {
                keysplit = key.split("$$");
                vm[keysplit[0]] =  vm[keysplit[0]] || {};
                vm[keysplit[0]][keysplit[1]] = value
            })
        }
        limejs.vm.localize = vm;
        limejs.log.debug('Localizaton model: ' + (JSON.stringify(vm)));
    },

    "uniqueFilter": function (e, i, arr) {
        return arr.lastIndexOf(e) === i;
    },

    setFallBackDummyData: function (node) {
        var value = '';

        //set text
        $('[data-bind]').each(function () {
            var match = new RegExp("text\:[^\,\}]*").exec($(this).attr('data-bind'))
            if (match) {
                $(this).html('Text: ' + match[0].split(":")[1].trim());
            }
        });

        //set value
        $('[data-bind]').each(function () {
            var match = new RegExp("value\:[^\,\}]*").exec($(this).attr('data-bind'))
            if (match) {
                $(this).attr('value', ('Value: ' + match[0].split(":")[1].trim()));
            }
        });

    },

    "dictionaryToJSON": function (keys,dic) {
        var key,value;
        var json = {};
      
        for (var i = 1; i <= dic.count; i++) {
            key = keys(i);
            value = dic.item(key);
            json[key] = value;
        }
  
        return json;

    },

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
                if (record.Fields(i).Type == (19 || 18 ) ) { //Option or Set
                    json[className][attr]['key'] = record.GetOptionKey(i);
                }

        }
        return json;

    },

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
            json[className][attr]['value'] =controls(i).Value;
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
