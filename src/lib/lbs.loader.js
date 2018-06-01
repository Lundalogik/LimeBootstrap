import $ from 'jquery'
import { xml2json } from 'xml2json-light'

import LimeObject from './dataSources/lbs.dataSource.limeobject'
import LimeObjects from './dataSources/lbs.dataSource.limeobjects'
import Translations from './dataSources/lbs.dataSource.translations'
import CustomEndpoint from './dataSources/lbs.dataSource.customEndpoint'


const loader = {

    /**
    Attrbutes
    */
    systemLibPath: 'system/',
    scripts: [],
    styles: [],
    libs: [],
    legacyDataSources: [
        'localization',
        'activeInspector',
        'records',
        'record',
        'xml',
        'storedProcedure',
        'HTTPGetXml',
        'SOAPGetXml',
        'relatedRecord',
        'AsyncPost',
        'activeUser',
    ],
    asyncDataSources: [
        'limeObject',
        'limeObjects',
        'activeLimeObject',
        'customEndpoint',
        'translations',
        'relatedLimeObjects',
    ],

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
                .done(() => {
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
                    // Trigger load event for other components to react to
                    $('#content').trigger('load.view')
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
                $(element).trigger('load.view')
            } else {
                lbs.log.error(`View "${file}" could not be loaded`)
            }
        }
    },

    createDataSource(dataSourceLiteral) {
        switch (dataSourceLiteral.type) {
        case 'activeLimeObject': {
            const modifiedDataSourceLiteral = dataSourceLiteral
            modifiedDataSourceLiteral.id = lbs.activeLimeObjectId
            modifiedDataSourceLiteral.limetype = lbs.activeClass
            modifiedDataSourceLiteral.alias = dataSourceLiteral.alias || lbs.activeClass
            return new LimeObject(dataSourceLiteral,
                lbs.session,
                lbs.activeServer,
                lbs.activeDatabase)
        }
        case 'limeObject':
            return new LimeObject(
                dataSourceLiteral,
                lbs.session,
                lbs.activeServer,
                lbs.activeDatabase,
            )
        case 'limeObjects':
            return new LimeObjects(
                dataSourceLiteral,
                lbs.session,
                lbs.activeServer,
                lbs.activeDatabase,
            )
        case 'translations': {
            const modifiedTranslationsDataSourceLiteral = dataSourceLiteral
            modifiedTranslationsDataSourceLiteral.locale = dataSourceLiteral.locale || lbs.activeLocale
            return new Translations(
                dataSourceLiteral,
                lbs.session,
                lbs.activeServer,
                lbs.activeDatabase,
            )
        }
        case 'relatedLimeObjects': {
            const { relatedFrom = lbs.activeClass } = dataSourceLiteral
            const dataSource = new LimeObjects(
                dataSourceLiteral,
                lbs.session,
                lbs.activeServer,
                lbs.activeDatabase,
            )
            dataSource.addFilterParam(relatedFrom, '=', lbs.activeLimeObjectId)
            dataSource.fetchAll = true
            return dataSource
        }
        case 'customEndpoint':
            return new CustomEndpoint(
                dataSourceLiteral,
                lbs.session,
                lbs.activeServer,
                lbs.activeDatabase,
            )
        default:
            lbs.log.warn(`Could not identify type "${dataSourceLiteral.type}" of data source.`)
            return null
        }
    },
    /**
    Load all datasources in set to the selected viewmodel
    */
    async loadDataSources(_vm, _dataSources, overrideExisting) {
        let dataSources = _dataSources
        let vm = _vm
        const filterRemoveRelated = item => item.type !== 'relatedRecord'
        const filterRemoveInspector = item => item.type !== 'activeInspector'
        const filterGetInspector = item => item.type === 'activeInspector'
        const filterGetRelated = item => item.type === 'relatedRecord'
        const relatedRecordExists = dataSources.filter(
            filterRemoveRelated,
        ).length !== dataSources.length
        const activeInspectorExists = dataSources.filter(
            filterRemoveInspector,
        ).length !== dataSources.length

        // check for activeInspector if using relatedRecord
        if (relatedRecordExists && !activeInspectorExists) {
            // remove related record
            dataSources = dataSources.filter(filterRemoveRelated)
            lbs.log.warn("Failed to load datasource 'RelatedRecord', activeInspector is not loaded")
        } else if (relatedRecordExists) { // add properties to inspector source
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
        await Promise.all(dataSources.map(async (source) => {
            let data = {}
            if (lbs.loader.asyncDataSources.includes(source.type)) {
                data = await lbs.loader.loadAsyncDataSource(source)
            } else if (lbs.loader.legacyDataSources.includes(source.type)) {
                data = lbs.loader.loadDataSource(source)
            } else {
                lbs.log.warn(`Data source type ${source.type} is invalid`)
            }
            vm = lbs.common.mergeOptions(vm, data, overrideExisting)
        }))

        return vm
    },

    async loadAsyncDataSource(dataSourceLiteral) {
        const dataSource = lbs.loader.createDataSource(dataSourceLiteral)
        const key = dataSourceLiteral.alias ? dataSourceLiteral.alias : dataSourceLiteral.type
        lbs.log.info(`Fetching data source: ${key}`)
        const data = { [key]: await dataSource.fetch() }
        return data
    },

    /**
    Load a datasource to the selected viewmodel
    */
    loadDataSource(dataSource) {
        let data = {}

        lbs.log.debug(`Loading data source: ${dataSource.type}:${dataSource.source}`)
        lbs.log.startTimer(`${JSON.stringify(dataSource)}`)

        try {
            switch (dataSource.type) {
            case 'activeInspector': {
                try {
                    // check lime
                    if (!lbs.activeInspector) {
                        lbs.log.warn('No activeinspecor, datasource will not be loaded')
                        return data
                    }
                    data = lbs.loader.controlsToJSON(lbs.activeInspector.Controls, dataSource.alias)

                    // find data without alias
                    const dataNode = data[Object.keys(data)[0]]

                    dataSource.relatedRecords.forEach((item) => {
                        const relatedRecord = item
                        relatedRecord.class = dataNode[item.source].class
                        relatedRecord.idrecord = dataNode[item.source].value
                        const relatedData = lbs.loader.loadDataSource(relatedRecord)
                        data = lbs.common.mergeOptions(data, relatedData, true)
                    })
                } catch (e) {
                    lbs.log.warn(`Failed to load datasource: ${dataSource.type}:${dataSource.source}`, e)
                }
                break
            }
            case 'xml': {
                // check for ownerIdParam
                const autoParams = []
                if (Object.prototype.hasOwnProperty.call(dataSource, 'PassInspectorParam') && dataSource.PassInspectorParam && lbs.activeInspector) {
                    autoParams.push(lbs.activeInspector.ID)
                }

                data = lbs.common.executeVba(dataSource.source, autoParams)

                if (data !== null) {
                    data = lbs.loader.xmlToJSON(data, dataSource.alias)
                } else {
                    lbs.log.warn(`Failed to load datasource: ${dataSource.type}:${dataSource.source}`)
                }
                break
            }
            case 'record': {
                // check for ownerIdParam
                const autoParams = []
                if (Object.prototype.hasOwnProperty.call(dataSource, 'PassInspectorParam') && dataSource.PassInspectorParam && lbs.activeInspector) {
                    autoParams.push(lbs.activeInspector.ID)
                }

                data = lbs.common.executeVba(dataSource.source, autoParams)

                if (data !== null) {
                    data = lbs.loader.recordToJSON(data, dataSource.alias)
                } else {
                    lbs.log.warn(`Failed to load datasource: ${dataSource.type}:${dataSource.source}`)
                }
                break
            }
            case 'records': {
                // check for ownerIdParam
                const autoParams = []
                if (Object.prototype.hasOwnProperty.call(dataSource, 'PassInspectorParam') && dataSource.PassInspectorParam && lbs.activeInspector) {
                    autoParams.push(lbs.activeInspector.ID)
                }

                data = lbs.common.executeVba(dataSource.source, autoParams)

                if (data !== null) {
                    data = lbs.loader.recordsToJSON(data, dataSource.alias)
                } else {
                    lbs.log.warn(`Failed to load datasource: ${dataSource.type}:${dataSource.source}`)
                }
                break
            }
            case 'localization': {
                const k = lbs.common.executeVba('Localize.getDictionaryKeys')
                const d = lbs.common.executeVba('Localize.getDictionary')
                const collecton = {}

                // return empty object if missing or no language support
                if (!d || !k) {
                    lbs.log.warn('Localization dictionary could not be loaded')
                } else {
                    const parsedData = lbs.loader.dictionaryToJSON(k, d, 'loc')

                    $.each(parsedData.loc, (key, value) => {
                        const keysplit = key.split('$$')
                        collecton[keysplit[0]] = collecton[keysplit[0]] || {}
                        collecton[keysplit[0]][keysplit[1]] = value
                    })

                    data.localize = collecton
                }
                break
            }
            case 'storedProcedure': {
                data = lbs.common.executeVba('lbsHelper.loadXmlFromStoredProcedure, {0}'.format(dataSource.source))
                if (data !== null) {
                    data = lbs.loader.xmlToJSON(data, dataSource.alias)
                } else {
                    lbs.log.warn(`Failed to load datasource: ${dataSource.type}:${dataSource.source}`)
                }
                break
            }
            case 'HTTPGetXml': {
                data = lbs.loader.loadFromExternalWebService(dataSource.source)
                if (data !== null) {
                    data = lbs.loader.xmlToJSON(data, dataSource.alias)
                } else {
                    lbs.log.warn(`Failed to load datasource: ${dataSource.type}:${dataSource.source}`)
                }
                break
            }
            case 'SOAPGetXml': {
                data = lbs.common.executeVba(`LBSHelper.loadFromSOAP,${dataSource.source.url},${dataSource.source.action},${dataSource.source.xml}`)
                if (data !== null) {
                    data = lbs.loader.xmlToJSON(data, dataSource.alias)
                } else {
                    lbs.log.warn(`Failed to load datasource: ${dataSource.type}:${dataSource.source}`)
                }
                break
            }
            case 'relatedRecord': {
                try {
                    const autoParams = []
                    autoParams.push(dataSource.class)
                    autoParams.push(dataSource.idrecord)

                    if (Object.prototype.hasOwnProperty.call(dataSource, 'view')) {
                        autoParams.push(dataSource.view)
                    }

                    // verify that record related record exists
                    if (dataSource.idrecord) {
                        const record = lbs.common.executeVba('lbsHelper.loadRelatedRecord', autoParams)
                        data = lbs.loader.recordToJSON(record, dataSource.alias)
                    } else {
                        data = lbs.loader.emptyAliasJSON(dataSource.alias)
                        lbs.log.debug(`RelatedRecord load is canceled, idrecord is NULL: ${dataSource.type}:${dataSource.source}`)
                    }
                } catch (e) {
                    lbs.log.warn(`Failed to load datasource: ${dataSource.type}:${dataSource.source}`, e)
                }
                break
            }
            case 'AsyncPost': {
                const params = dataSource.parameters || {}
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
            }
            case 'activeUser': {
                const c = lbs.common.executeVba('lbsHelper.getActiveUser')
                const json = JSON.parse(c)

                data.ActiveUser = json.ActiveUser
                break
            }
            default:
                lbs.log.warn(`Supplied datasource ${dataSource.type} not recognized. Please see docs for supported sources`)
            }
        } catch (e) {
            lbs.log.warn(`Failed to load datasource: ${dataSource.type}:${dataSource.source}`, e)
        } finally {
            lbs.log.stopTimer(`${JSON.stringify(dataSource)}`)
        }

        return data
    },


    /**
    Process params from external config
    */
    loadExternalConfig(defaultConfig, externalConfig, classname) {
        let entry = {}
        const config = defaultConfig

        // check for config for active class
        if (Object.prototype.hasOwnProperty.call(externalConfig, classname)) {
            entry = externalConfig[classname]

            // get datasorces if exists
            if (Object.prototype.hasOwnProperty.call(entry, 'dataSources')) {
                config.dataSources = entry.dataSources
            }

            // get autorefresh if exists
            if (Object.prototype.hasOwnProperty.call(entry, 'autorefresh')) {
                config.autorefresh = entry.autorefresh
            }
        }

        return config
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
    dictionaryToJSON(keys, dic, _alias) {
        let key
        let value
        const json = {}
        const r = {}
        const alias = _alias || 'dictionarySource'

        for (let i = 1; i <= dic.count; i += 1) {
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
    recordsToJSON(rc, _alias) {
        const json = {}

        if (rc) {
            const className = rc.Class.Name
            const nbrOfRecords = rc.Count
            const alias = _alias || className


            json[alias] = {}
            json[alias].records = []
            for (let i = 1; i <= nbrOfRecords; i += 1) {
                const record = lbs.loader.recordToJSON(rc.Item(i), 'r')
                json[alias || className].records.push(record.r)
            }
        }
        return json
    },

    /**
    Transform a VBA record to JSON
    */
    recordToJSON(record, _alias) {
        const json = {}

        if (record) {
            const nbrOfFields = record.Fields.Count
            const className = record.Class.Name
            let attr
            const alias = _alias || className
            json[alias] = {}

            for (let i = 1; i <= nbrOfFields; i += 1) {
                attr = record.Fields(i).Name
                json[alias][attr] = {}
                json[alias][attr].text = record.Text(i)

                if (typeof record.Value(i) !== 'unknown') {
                    json[alias][attr].value = record.Value(i)
                }
                if (record.Fields(i).Type === 16) { // Relation
                    json[alias][attr].class = record.Fields(i).LinkedField.Class.Name
                }

                // check if optionkey support
                if (lbs.limeVersion.comparable > lbs.common.parseVersion('10.8').comparable) {
                    if (record.Fields(i).Type === (19 || 18)) { // Option or Set
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
    controlsToJSON(controls, _alias) {
        const nbrOfControls = controls.Count
        const className = controls.Class.Name
        let attr
        const json = {}
        const alias = _alias || className
        json[alias] = {}

        for (let i = 1; i <= nbrOfControls; i += 1) {
            attr = controls(i).Field.Name
            json[alias][attr] = {}
            json[alias][attr].text = controls(i).Text
            json[alias][attr].value = controls(i).Value
            if (controls(i).Field.Type === 16) { // Relation
                json[alias][attr].class = controls(i).Field.LinkedField.Class.Name
            }

            // check if optionkey support
            if (lbs.limeVersion.comparable > lbs.common.parseVersion('10.8').comparable) {
                if (controls(i).Field.Type === (19 || 18)) { // Option or Set
                    json[alias][attr].key = controls(i).OptionKey
                }
            }
        }

        return json
    },

    /**
    Transform XML to JSON
    */
    xmlToJSON(xml, _alias) {
        const json = {}
        const alias = _alias || 'xmlSource'
        json[alias] = xml2json(xml)

        return json
    },

    createUpdateTranslation(owner, code, text, culture) {
        return lbs.common.executeVba('lbsHelper.CreateUpdateTranslation,', [owner, code, text, culture])
    },

}

export default loader
