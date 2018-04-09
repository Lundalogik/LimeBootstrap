import $ from 'jquery'

const loader = {

    /**
    Attrbutes
    */
    systemLibPath: 'system/',
    scripts: [],
    styles: [],
    libs: [],

    /**
    Add resources from config to load-lists
    */
    pushResources(data, appPath) {
        let path

        if (typeof data === 'undefined') {
            return
        }
        $.each(data.scripts, (i) => {
            path = appPath === '/' ? `${lbs.loader.systemLibPath}js/` : appPath
            lbs.loader.scripts.push(path + data.scripts[i])
        })

        $.each(data.libs, (i) => {
            path = `${lbs.loader.systemLibPath}js/`
            lbs.loader.libs.push(path + data.libs[i])
        })

        $.each(data.styles, (i) => {
            path = appPath === '/' ? `${lbs.loader.systemLibPath}css/` : appPath
            lbs.loader.styles.push(path + data.styles[i])
        })
    },

    /**
    Process load-list and fetch all resources
    */
    loadResources() {
        lbs.loader.scripts = lbs.loader.scripts.filter(this.uniqueFilter)
        lbs.loader.styles = lbs.loader.styles.filter(this.uniqueFilter)
        lbs.loader.libs = lbs.loader.libs.filter(this.uniqueFilter)

        lbs.log.debug(`Scripts to load:${lbs.loader.scripts}`)
        lbs.log.debug(`Styles to load: ${lbs.loader.styles}`)
        lbs.log.debug(`Libs to load: ${lbs.loader.libs}`)

        $.each(lbs.loader.libs, (i) => {
            lbs.loader.loadScript(lbs.loader.libs[i])
        })

        $.each(lbs.loader.scripts, (i) => {
            lbs.loader.loadScript(lbs.loader.scripts[i])
        })

        $.each(lbs.loader.styles, (i) => {
            lbs.loader.loadStyle(lbs.loader.styles[i])
        })
    },

    /**
    Fetch and run a script from disk
    */
    loadScript(filename) {
        let retval = false
        try {
            $.getScript(filename)
                .done((script, textStatus) => {
                    lbs.log.info(`Script "${filename}" loaded successfully`)
                })
                .fail((jqxhr, settings, exception) => {
                    throw exception
                    // throw new Error('Script "' + filename + '" could not be loaded');
                })

            retval = true
        } catch (e) {
            try {
                lbs.log.info(`Script "${filename}" could not be loaded, using fallback loading through LWS`)
                let s = ''
                s = lbs.common.executeVba(`LBSHelper.loadHTTPResource,${filename}`)
                if (s && s !== '') {
                    window.eval(s)
                    lbs.log.info(`Script "${filename}" loaded successfully`)
                    retval = true
                } else {
                    throw new Error(`Script "${filename}" returned empty`)
                }
            } catch (e2) {
                lbs.log.error(`Script "${filename}" could not be loaded though browser`, e)
                lbs.log.error(`Script "${filename}" could not be loaded through LWS`, e2)
                retval = false
            }
        }

        return retval
    },

    /**
    Fetch and load a style from disk
    */
    loadStyle(val) {
        $('<link/>', { rel: 'stylesheet', type: 'text/css', href: val }).appendTo('head')
    },

    /**
    Fetch template from disk and insert into selected element
    */
    loadView(filePath, element) {
        const file = `${filePath}.html`
        try {
            element.load(file, (response, status) => {
                if (response.indexOf('<script') !== -1) {
                    lbs.log.error(`View "${file}" containes scripts, it is not allowed to be loaded`)
                    // replace element with funnt image
                    element.html(`<img src="${lbs.loader.systemLibPath}img/YouDidntSayTheMagicWord.gif" />`)
                } else if (status === 'error') {
                    lbs.log.error(`View "${file}" could not be loaded`)
                } else {
                    lbs.log.info(`View "${file}" loaded successfully`)
                }
            })
        } catch (e) {
            lbs.log.warn('Resource could not be found. If using Chrome or IE11, make sure --file-access-from-file is enabled')
            lbs.log.warn(`View "${file}" could not be loaded, using fallback loading through LWS`)
            let s = ''
            s = lbs.common.executeVba(`LBSHelper.loadHTTPResource,${file}`)
            if (s && s !== '') {
                element.html(s)
                lbs.log.info(`View "${file}" loaded successfully`)
            } else {
                lbs.log.error(`View "${file}" could not be loaded`, e)
            }
        }
    },

    /**
    Load all datasources in set to the selected viewmodel
    */
    loadDataSources(vm, dataSources, overrideExisting) {
        // check connection
        if (!lbs.hasLimeConnection) {
            lbs.log.warn('No connecton, datasources will not be loaded')
            return vm
        }

        const filterRemoveRelated = function (item) { return (item.type != 'relatedRecord') }
        const filterRemoveInspector = function (item) { return (item.type != 'activeInspector') }
        const filterGetInspector = function (item) { return (item.type === 'activeInspector') }
        const filterGetRelated = function (item) { return (item.type === 'relatedRecord') }
        const relatedRecordExists = dataSources.filter(filterRemoveRelated).length !== dataSources.length
        const activeInspectorExists = dataSources.filter(filterRemoveInspector).length !== dataSources.length

        // check for activeInspector if using relatedRecord
        if (relatedRecordExists && !activeInspectorExists) {
            // remove related record
            dataSources = dataSources.filter(filterRemoveRelated)
            lbs.log.warn("Failed to load datasource 'RelatedRecord', activeInspector is not loaded")
        }
        else if (relatedRecordExists) { // add properties to inspector source
            // get inspector source
            const activeInspector = dataSources.filter(filterGetInspector)[0]
            // set related sources to inspector source
            activeInspector.relatedRecords = dataSources.filter(filterGetRelated)
            // remove previous sources collection
            dataSources = dataSources.filter(filterRemoveRelated).filter(filterRemoveInspector)
            // add new source to collection
            dataSources.push(activeInspector)
        }

        // load soruces
        $.each(dataSources, (key, source) => {
            vm = lbs.loader.loadDataSource(vm, source, overrideExisting)
        })
        return vm
    },


    /**
    Load a datasource to the selected viewmodel
    */
    loadDataSource(vm, dataSource, overrideExisting) {
        let data = {}

        lbs.log.debug(`Loading data source: ${dataSource.type}:${dataSource.source}`)
        const timerStart = moment()
        try {
            switch (dataSource.type) {
            case 'activeInspector':
                try {
                    // check lime
                    if (!lbs.activeInspector) {
                        lbs.log.warn('No activeinspecor, datasource will not be loaded')
                        return vm
                    }

                    data = lbs.loader.controlsToJSON(lbs.activeInspector.Controls, dataSource.alias)

                    // find data without alias
                    dataNode = data[Object.keys(data)[0]]
                    // check for related records, source is fieldname is this instance
                    if (dataSource.hasOwnProperty('relatedRecords')) {
                        $.each(dataSource.relatedRecords, (i, rs) => {
                            if (dataNode.hasOwnProperty(rs.source)) {
                                // fetch class and id from inspector JSON object
                                rs.class = dataNode[rs.source].class
                                rs.idrecord = dataNode[rs.source].value

                                // add data as subkey to inspector relation if no alias is specified, otherwise as its own node
                                vmToAdd = rs.alias ? vm : dataNode

                                // set alias to fieldname if does not exist
                                rs.alias = rs.alias ? rs.alias : rs.source

                                // call loadData for the related record
                                lbs.loader.loadDataSource(vmToAdd, rs, true)
                            } else {
                                lbs.log.warn("Failed to load datasource 'RelatedRecord', field '{0}' does not exist".format(rs.source))
                            }
                        })
                    }
                } catch (e) {
                    lbs.log.warn(`Failed to load datasource: ${dataSource.type}:${dataSource.source}`, e)
                }
                break
            case 'xml':

                // check for ownerIdParam
                var autoParams = []
                if (dataSource.hasOwnProperty('PassInspectorParam') && dataSource.PassInspectorParam && lbs.activeInspector) {
                    autoParams.push(lbs.activeInspector.ID)
                }

                data = lbs.common.executeVba(dataSource.source, autoParams)

                if (data !== null) {
                    data = lbs.loader.xmlToJSON(data, dataSource.alias)
                } else {
                    lbs.log.warn(`Failed to load datasource: ${dataSource.type}:${dataSource.source}`)
                }
                break
            case 'record':

                // check for ownerIdParam
                var autoParams = []
                if (dataSource.hasOwnProperty('PassInspectorParam') && dataSource.PassInspectorParam && lbs.activeInspector) {
                    autoParams.push(lbs.activeInspector.ID)
                }

                data = lbs.common.executeVba(dataSource.source, autoParams)

                if (data !== null) {
                    data = lbs.loader.recordToJSON(data, dataSource.alias)
                } else {
                    lbs.log.warn(`Failed to load datasource: ${dataSource.type}:${dataSource.source}`)
                }
                break
            case 'records':
                // check for ownerIdParam
                var autoParams = []
                if (dataSource.hasOwnProperty('PassInspectorParam') && dataSource.PassInspectorParam && lbs.activeInspector) {
                    autoParams.push(lbs.activeInspector.ID)
                }

                data = lbs.common.executeVba(dataSource.source, autoParams)

                if (data !== null) {
                    data = lbs.loader.recordsToJSON(data, dataSource.alias)
                } else {
                    lbs.log.warn(`Failed to load datasource: ${dataSource.type}:${dataSource.source}`)
                }
                break
            case 'localization':
                var k = lbs.common.executeVba('Localize.getDictionaryKeys')
                var d = lbs.common.executeVba('Localize.getDictionary')
                var parsedData = {}
                var collecton = {}

                // return empty object if missing or no language support
                if (!d || !k) {
                    lbs.log.warn('Localization dictionary could not be loaded')
                } else {
                    parsedData = lbs.loader.dictionaryToJSON(k, d, 'loc')

                    $.each(parsedData.loc, (key, value) => {
                        keysplit = key.split('$$')
                        collecton[keysplit[0]] = collecton[keysplit[0]] || {}
                        collecton[keysplit[0]][keysplit[1]] = value
                    })

                    data.localize = collecton
                }
                break
            case 'storedProcedure':
                data = lbs.common.executeVba('lbsHelper.loadXmlFromStoredProcedure, {0}'.format(dataSource.source))
                if (data !== null) {
                    data = lbs.loader.xmlToJSON(data, dataSource.alias)
                } else {
                    lbs.log.warn(`Failed to load datasource: ${dataSource.type}:${dataSource.source}`)
                }
                break
            case 'HTTPGetXml':
                data = lbs.loader.loadFromExternalWebService(dataSource.source)
                if (data !== null) {
                    data = lbs.loader.xmlToJSON(data, dataSource.alias)
                } else {
                    lbs.log.warn(`Failed to load datasource: ${dataSource.type}:${dataSource.source}`)
                }
                break
            case 'SOAPGetXml':
                data = lbs.common.executeVba(`LBSHelper.loadFromSOAP,${dataSource.source.url},${dataSource.source.action},${dataSource.source.xml}`)
                if (data !== null) {
                    data = lbs.loader.xmlToJSON(data, dataSource.alias)
                } else {
                    lbs.log.warn(`Failed to load datasource: ${dataSource.type}:${dataSource.source}`)
                }
                break
            case 'relatedRecord':
                try {
                    var autoParams = []
                    autoParams.push(dataSource.class)
                    autoParams.push(dataSource.idrecord)
                    if (dataSource.hasOwnProperty('view')) {
                        autoParams.push(dataSource.view)
                    }

                    // verify that record related record exists
                    if (dataSource.idrecord) {
                        record = lbs.common.executeVba('lbsHelper.loadRelatedRecord', autoParams)
                        data = lbs.loader.recordToJSON(record, dataSource.alias)
                    } else {
                        data = lbs.loader.emptyAliasJSON(dataSource.alias)
                        lbs.log.debug(`RelatedRecord load is canceled, idrecord is NULL: ${dataSource.type}:${dataSource.source}`)
                    }
                } catch (e) {
                    lbs.log.warn(`Failed to load datasource: ${dataSource.type}:${dataSource.source}`, e)
                }
                break
            case 'AsyncPost':
                var params = dataSource.parameters || {}
                $.support.cors = true
                data = {}
                data[dataSource.alias] = $.ajax({
                    contentType: 'application/json',
                    data: JSON.stringify(params),
                    dataType: 'json',
                    type: 'POST',
                    url: dataSource.url,
                    crossDomain: true,
                })
                break
            case 'activeUser':
                var c = lbs.common.executeVba('lbsHelper.getActiveUser')
                var json = JSON.parse(c)

                data.ActiveUser = json.ActiveUser
                break
            }

            // merge options into the viewModel
            vm = lbs.common.mergeOptions(vm, data || {}, overrideExisting)
        } catch (e) {
            lbs.log.warn(`Failed to load datasource: ${dataSource.type}:${dataSource.source}`, e)
        }
        const timerFinished = moment()

        lbs.log.warn(`Time to load data source ${JSON.stringify(dataSource)} : ${timerFinished.diff(timerStart, 'milliseconds')}ms`)
        return vm
    },


    /**
    Process params from external config
    */
    loadExternalConfig(defaulConfig, externalConfig, classname) {
        let entry = {}

        // check for config for active class
        if (externalConfig.hasOwnProperty(classname)) {
            entry = externalConfig[classname]

            // get datasorces if exists
            if (entry.hasOwnProperty('dataSources')) {
                defaulConfig.dataSources = entry.dataSources
            }

            // get autorefresh if exists
            if (entry.hasOwnProperty('autorefresh')) {
                defaulConfig.autorefresh = entry.autorefresh
            }
        }

        return defaulConfig
    },

    loadFromExternalWebService(url) {
        return lbs.common.executeVba(`lbsHelper.loadFromREST,${url}`)
    },

    loadLocalFileToString(path) {
        return lbs.common.executeVba(`lbsHelper.loadHTTPResource,${path}`)
    },

    saveLocalFile(path, text) {
        lbs.common.executeVba(`lbsHelper.saveFile,${path}`, [text])
    },

    /**
    Only return unique values
    */
    uniqueFilter(e, i, arr) {
        return arr.lastIndexOf(e) === i
    },


    /**
    Transform a VBA dictionary to JSON.
    A collection with keys is needed as the keys method is not transported to JS
    */
    dictionaryToJSON(keys, dic, alias) {
        let key,
            value
        const json = {}
        const r = {}

        var alias = alias || 'dictionarySource'

        for (let i = 1; i <= dic.count; i++) {
            key = keys(i)
            value = dic.item(key)
            json[key] = value
        }

        r[alias] = json
        return r
    },

    /**
    Transform a VBA records to JSON
    */
    recordsToJSON(rc, alias) {
        const json = {}

        if (rc) {
            const className = rc.Class.Name
            const nbrOfRecords = rc.Count
            var alias = alias || className


            json[alias] = {}
            json[alias].records = []
            for (let i = 1; i <= nbrOfRecords; i++) {
                const record = lbs.loader.recordToJSON(rc.Item(i), 'r')
                json[alias].records.push(record.r)
            }
        }

        return json
    },

    /**
    Transform a VBA record to JSON
    */
    recordToJSON(record, alias) {
        const json = {}

        if (record) {
            const nbrOfFields = record.Fields.Count
            const className = record.Class.Name
            let attr
            var alias = alias || className
            json[alias] = {}

            for (let i = 1; i <= nbrOfFields; i++) {
                attr = record.Fields(i).Name
                json[alias][attr] = {}
                json[alias][attr].text = record.Text(i)

                if (typeof record.Value(i) !== 'unknown') {
                    json[alias][attr].value = record.Value(i)
                }
                if (record.Fields(i).Type == 16) { // Relation
                    json[alias][attr].class = record.Fields(i).LinkedField.Class.Name
                }

                // check if optionkey support
                if (lbs.limeVersion.comparable > lbs.common.parseVersion('10.8').comparable) {
                    if (record.Fields(i).Type == (19 || 18)) { // Option or Set
                        json[alias][attr].key = record.GetOptionKey(i)
                    }
                }
            }
        }
        return json
    },

    /**
    Transform an empty alias to JSON
    */
    emptyAliasJSON(alias) {
        const json = {}
        json[alias] = {}
        return json
    },

    /**
    Transform controls on activeInspector to JSON
    */
    controlsToJSON(controls, alias) {
        const nbrOfControls = controls.Count
        const className = controls.Class.Name
        let attr
        const json = {}
        var alias = alias || className
        json[alias] = {}

        for (let i = 1; i <= nbrOfControls; i++) {
            attr = controls(i).Field.Name
            json[alias][attr] = {}
            json[alias][attr].text = controls(i).Text
            json[alias][attr].value = controls(i).Value
            if (controls(i).Field.Type == 16) { // Relation
                json[alias][attr].class = controls(i).Field.LinkedField.Class.Name
            }

            // check if optionkey support
            if (lbs.limeVersion.comparable > lbs.common.parseVersion('10.8').comparable) {
                if (controls(i).Field.Type == (19 || 18)) { // Option or Set
                    json[alias][attr].key = controls(i).OptionKey
                }
            }
        }

        return json
    },

    /**
    Transform XML to JSON
    */
    xmlToJSON(xml, alias) {
        const json = {}
        var alias = alias || 'xmlSource'

        json[alias] = $.parseJSON(xml2json($.parseXML(xml), ''))

        return json
    },

    createUpdateTranslation(owner, code, text, culture) {
        return lbs.common.executeVba('lbsHelper.CreateUpdateTranslation,', [owner, code, text, culture])
    },

}

export default loader