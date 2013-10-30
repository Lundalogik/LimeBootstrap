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
    "loadScript": function (filename) {

        
         try {
            $.getScript( filename )

              .done(function( script, textStatus ) {
                    lbs.log.info('Script "' + filename + '" loaded successfully');
              })
              .fail(function( jqxhr, settings, exception ) {
                    throw exception;
                    //throw new Error('Script "' + filename + '" could not be loaded');
            });

            retval = true;

        } catch (e) {
           try{
                lbs.log.info('Script "' + filename + '" could not be loaded, using fallback loading through LWS');
                var s = ""
                s = lbs.common.executeVba("LBSHelper.loadHTTPResource," + filename);
                if (s && s !== "") {
                    with(window) {
                        window.eval(s);
                    }
                    lbs.log.info('Script "' + filename + '" loaded successfully');
                    retval = true;
                } else {
                    throw new Error('Script "' + filename + '" returned empty');
                }
            }catch(e2){
                lbs.log.error('Script "' + filename + '" could not be loaded though browser',e);
                lbs.log.error('Script "' + filename + '" could not be loaded through LWS',e2);
                retval = false;
            }
        }

        return retval;

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
            s = lbs.common.executeVba("LBSHelper.loadHTTPResource," + file);
            if (s && s !== "") {
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
    loadDataSources: function (vm, dataSources, overrideExisting) {

        var filterRemoveRelated = function (item) {return (item.type != 'relatedRecord')};
        var filterRemoveInspector = function (item) {return (item.type != 'activeInspector')};
        var filterGetInspector = function (item) {return (item.type === 'activeInspector')};
        var filterGetRelated = function (item) {return (item.type === 'relatedRecord')};
        var relatedRecordExists = dataSources.filter(filterRemoveRelated).length != dataSources.length;
        var activeInspectorExists = dataSources.filter(filterRemoveInspector).length != dataSources.length;

        //check for activeInspector if using relatedRecord
        if(relatedRecordExists && !activeInspectorExists){
            //remove related record
            dataSources = dataSources.filter(filterRemoveRelated)
            lbs.log.warn("Failed to load datasource 'RelatedRecord', activeInspector is not loaded")
        }
        // add properties to inspector source
        else if(relatedRecordExists){
            
            //get inspector source
            var activeInspector = dataSources.filter(filterGetInspector)[0];
            //set related sources to inspector source
            activeInspector.relatedRecords = dataSources.filter(filterGetRelated);
            //remove previous sources collection
            dataSources = dataSources.filter(filterRemoveRelated).filter(filterRemoveInspector)
            //add new source to collection
            dataSources.push(activeInspector);
        }

        //load soruces
        $.each(dataSources, function (key, source) {
            vm = lbs.loader.loadDataSource(vm, source, overrideExisting);
            
        })
        return vm;
    },

    /**
    Load a datasource to the selected viewmodel
    */
    loadDataSource: function (vm, dataSource, overrideExisting) {
        var data = {};

        lbs.log.debug('Loading data source: ' + dataSource.type + ':' + dataSource.source)

        try {
            switch (dataSource.type) {
                case 'activeInspector':
                    try {
                        data = lbs.loader.controlsToJSON(lbs.limeDataConnection.ActiveControls,dataSource.alias,dataSource.alias);
                        
                        //find data without alias
                        dataNode = data[Object.keys(data)[0]];
                        //check for related records, source is fieldname is this instance
                        if(dataSource.hasOwnProperty('relatedRecords')){
                            $.each(dataSource.relatedRecords,function(i, rs){
                                if(dataNode.hasOwnProperty(rs.source)){
                                   
                                    //fetch class and id from inspector
                                    rs.class = dataNode[rs.source].class;
                                    rs.idrecord = dataNode[rs.source].value;

                                    //add as subkey to inspector if no alias is specified
                                    vmToAdd = rs.alias ? vm : dataNode;

                                    //set alias to fieldname if does not exist
                                    rs.alias = rs.alias ? rs.alias : rs.source;
                                    
                                    //call loadData for the related record
                                    lbs.loader.loadDataSource(vmToAdd,rs,true);

                                }else{
                                    lbs.log.warn("Failed to load datasource 'RelatedRecord', field '{0}' does not exist".format(rs.source))
                                }
                            }); 
                        }
                    } catch (e) {
                        lbs.log.warn("Failed to load datasource: " + dataSource.type + ':' + dataSource.source)
                    }
                    break;
                case 'xml':
                    data = lbs.common.executeVba(dataSource.source);
                    if (data != null) {
                        data = lbs.loader.xmlToJSON(data, dataSource.alias);
                    } else {
                        lbs.log.warn("Failed to load datasource: " + dataSource.type + ':' + dataSource.source,e)
                    }
                    break;
                case 'record':
                    data = lbs.common.executeVba(dataSource.source);
                    if (data != null) {
                        data = lbs.loader.recordToJSON(data,dataSource.alias);
                    } else {
                        lbs.log.warn("Failed to load datasource: " + dataSource.type + ':' + dataSource.source,e)
                    }
                    break;
                case 'records':
                    data = lbs.common.executeVba(dataSource.source);
                    if (data != null) {
                        data = lbs.loader.recordsToJSON(data,dataSource.alias);
                    } else {
                        lbs.log.warn("Failed to load datasource: " + dataSource.type + ':' + dataSource.source,e)
                    }
                    break;
                case 'localization':
                    var k = lbs.common.executeVba("Localize.getDictionaryKeys");
                    var d = lbs.common.executeVba("Localize.getDictionary");
                    var parsedData = {};
                    var collecton = {};

                    //return empty object if missing or no language support
                    if (!d || !k) {
                        lbs.log.warn("Localization dictionary could not be loaded");
                    } else {
                        parsedData = lbs.loader.dictionaryToJSON(k, d,'loc');

                        $.each(parsedData['loc'], function (key, value) {
                            keysplit = key.split("$$");
                            collecton[keysplit[0]] = collecton[keysplit[0]] || {};
                            collecton[keysplit[0]][keysplit[1]] = value
                        })

                        data.localize = collecton;
                    }
                    break;
                case 'storedProcedure':
                    data = lbs.common.executeVba("lbsHelper.loadXmlFromStoredProcedure, {0}".format(dataSource.source));
                    if (data != null) {
                        data = lbs.loader.xmlToJSON(data,dataSource.alias);
                    } else {
                        lbs.log.warn("Failed to load datasource: " + dataSource.type + ':' + dataSource.source,e)
                    }
                    break;
                case 'relatedRecord':
                     try {
                        record = lbs.common.executeVba("lbsHelper.loadRelatedRecord, {0}, {1}".format(dataSource.class, dataSource.idrecord));
                        data = lbs.loader.recordToJSON(record, dataSource.alias);
                    } catch (e) {
                        lbs.log.warn("Failed to load datasource: " + dataSource.type + ':' + dataSource.source,e)
                    }
                    break;
            }

            //merge options into the viewModel
            vm = lbs.common.mergeOptions(vm, data || {}, overrideExisting);
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
    "dictionaryToJSON": function (keys, dic, alias) {
        var key, value;
        var json = {};
        var r = {};

        var alias = alias ? alias : 'dictionarySource';

        for (var i = 1; i <= dic.count; i++) {
            key = keys(i);
            value = dic.item(key);
            json[key] = value;
        }

        r[alias] = json;
        return r;
    },

     /**
    Transform a VBA records to JSON
    */
    "recordsToJSON": function (rc, alias) {

        var className = rc.Class.Name
        var nbrOfRecords = rc.Count;
        var alias = alias ? alias : className;
        var json = {};

        json[alias] = {};
        json[alias]['records'] = [];
        for (var i = 1; i <= nbrOfRecords; i++) {
            var record = lbs.loader.recordToJSON(rc.Item(i),'r');
            json[alias]['records'].push(record.r);

        }
        return json;
    },

    /**
    Transform a VBA record to JSON
    */
    "recordToJSON": function (record, alias) {
        var nbrOfFields = record.Fields.Count;
        var className = record.Class.Name
        var attr;
        var json = {};
        var alias = alias ? alias : className;
        json[alias] = {};

        for (var i = 1; i <= nbrOfFields; i++) {
            attr = record.Fields(i).Name;
            json[alias][attr] = {};
            json[alias][attr]["text"] = record.Text(i);
        
            if(typeof record.Value(i) != 'unknown'){
                json[alias][attr]['value'] = record.Value(i);
            }
            if (record.Fields(i).Type == 16) { //Relation
                json[alias][attr]['class'] = record.Fields(i).LinkedField.Class.Name;
            }

            //check if optionkey support
            if(lbs.limeVersion.comparable > lbs.common.parseVersion('10.8').comparable){
                if (record.Fields(i).Type == (19 || 18)) { //Option or Set
                    json[alias][attr]['key'] = record.GetOptionKey(i);
                }
            }

        }
        return json;
    },

    /**
    Transform controls on activeInspector to JSON
    */
    "controlsToJSON": function (controls, alias) {
        var nbrOfControls = controls.Count;
        var className = controls.Class.Name
        var attr;
        var json = {};
        var alias = alias ? alias : className;
        json[alias] = {};

        for (var i = 1; i <= nbrOfControls; i++) {
            attr = controls(i).Field.Name;
            json[alias][attr] = {};
            json[alias][attr]["text"] = controls(i).Text;
            json[alias][attr]['value'] = controls(i).Value;
            if (controls(i).Field.Type == 16) { //Relation
                json[alias][attr]['class'] = controls(i).Field.LinkedField.Class.Name;
            }

            //check if optionkey support
            if(lbs.limeVersion.comparable > lbs.common.parseVersion('10.8')){
                if (controls(i).Field.Type == (19 || 18)) { //Option or Set
                    json[alias][attr]['key'] = controls(i).OptionKey;
                }
            }
        }
        return json;

    },

     /**
    Transform XML to JSON
    */
    "xmlToJSON": function (xml, alias) {
        var json = {};
        var alias = alias ? alias : 'xmlSource';

        json[alias] = $.parseJSON(xml2json($.parseXML(xml), ""));

        return json;

    },



}
