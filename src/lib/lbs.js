/**
* This is the default Lime CRM javascript lib for actionpad functions.
* It contains many functions to make the world a little better place.
*/

import moment from 'moment'
import $ from 'jquery'

import ko from 'knockout'
import 'knockout-mapping'
import 'knockout-punches'

import Log from './lbs.log'
import loader from './lbs.loader'
import Common from './lbs.common'
import apploader from './lbs.apploader'
import Bakery from './lbs.bakery'
import registerCustomBindings from './lbs.bindings'
import ComponentLoader from './lbs.componentLoader'
import { SetupError } from './lbs.errors'
/**
Objekt container
*/
const lbs = {
    /**
    Properties
    */
    debug: false,
    verboseLevel: null,
    limeDataConnection: window.external,
    limeVersion: {},
    hasLimeConnection: false,
    activeClass: '',
    activeDatabase: '',
    activeServer: '',
    activeInspector: null,
    activeInspectorId: null,
    activeLocale: 'en_us',
    session: null,
    wrapperType: 'actionpad',
    apps: {},
    error: false,
    vm: {},
    loading: {},
    loader,
    common: Common,
    apploader,
    bakery: null,
    log: new Log(),
    VmFactory: () => {},

    /**
    config
    */
    config: {
        dataSources: [
            { type: 'activeInspector', source: '' },
            { type: 'localization', source: '' },
        ],
        resources: {
            scripts: [],
            styles: [],
            libs: [],
        },
        autorefresh: false,
    },

    /**
    Setup
    */
    async setup() {
        // register custom bindnings
        registerCustomBindings()
        ko.options.deferUpdates = true

        // system param
        this.setSystemOperationParameters()

        // Enable or disable debug-mode
        this.debug = lbs.externalConfig.debug
        ko.applyBindings({ enabled: this.debug }, $('#debug').get(0))

        // set contextmenu enables/disabled
        this.SetTouchEnabled(false)

        // init the log
        this.log.setVerboseLevel()

        lbs.log.startTimer('LBS total load time')
        // get AP class etc
        this.setActionPadEnvironment()

        lbs.bakery = new Bakery(lbs.activeClass)
        // load loader (sic!)
        this.setupLoader()

        // configure
        this.processConfiguration()

        // set moment language
        moment.locale(lbs.locale)

        // load datasources
        this.vm = await lbs.loader.loadDataSources(this.vm, this.config.dataSources, false)

        // load view
        if (lbs.activeClass) {
            this.loader.loadView(lbs.activeClass, $('#content'))
        }

        let localComponents = []
        if (lbs.externalConfig[lbs.activeClass] && lbs.externalConfig[lbs.activeClass].components) {
            localComponents = lbs.externalConfig[lbs.activeClass].components
        }
        await ComponentLoader.loadComponents(lbs.externalConfig.components, localComponents)
        // load apps
        this.apploader.identifyApps()

        // load resources
        this.loader.loadResources()

        lbs.log.startTimer('Apps total load time')
        // apps vm
        this.apploader.buildApps()

        // setup bindings
        this.applyContentBindings()

        // init apps
        this.apploader.initializeApps()
        lbs.log.stopTimer('Apps total load time')

        // execute onLoad
        $('#content').trigger('load.complete')

        // Loading complete
        lbs.loading.showLoader(false)

        lbs.log.stopTimer('LBS total load time')
    },

    /**
    Set properties when not standard
    */
    processConfiguration() {
        this.config = lbs.loader.loadExternalConfig(
            this.config,
            this.externalConfig.config,
            this.activeClass,
        )
    },

    /**
    * Initialize a neat little loading spinner
    */
    setupLoader() {
        lbs.loading.showLoader = ko.observable(true)
        lbs.loading = ko.mapping.fromJS(lbs.loading)
        ko.applyBindings(lbs.loading, $('#loadingIndicator').get(0))
    },

    /**
    * Fetch variables required to run system
    */
    setSystemOperationParameters() {
        // ajax should be async
        $.ajaxSetup({
            async: false,
        })

        // create viewmodel container
        this.vm = new lbs.VmFactory()

        // check connection to Lime
        this.hasLimeConnection = Boolean(lbs.limeDataConnection && typeof lbs.limeDataConnection.Application !== 'undefined')

        // getVersion
        this.limeVersion = lbs.hasLimeConnection ?
            lbs.common.parseVersion(lbs.limeDataConnection.Version) : lbs.common.parseVersion('0.0.0')
    },

    /**
    * Finds and sets
    *    - reference to ActiveInspetor
    *    - Id of ActiveInspector
    *    - Name of LimeType (class), might also be 'index' indicating no class
    *    - locale
    *    - session
    *    - limeobject id
    *    - wrapper type
    */
    setActionPadEnvironment() {
        lbs.setActiveInspectorReference()
        /* Find out the name of the LimeType (class) we are viewing.
         If we are not viewing an inspector we are viewing the index actionpad.
         Used to load appropriate view
        */
        this.activeClass = lbs.common.getURLParameter('ap')
        if (!this.activeClass && window.location.hash !== '') {
            lbs.activeClass = window.location.hash.substring(1)
        } else if (!this.activeClass && lbs.activeInspector) {
            lbs.activeClass = lbs.activeInspector.class.Name
        } else if (!this.activeClass) { // all else fails, go for Index
            lbs.activeClass = 'index'
        }

        lbs.activeInspectorId = parseInt(lbs.common.getURLParameter('id'), 10)
        if (!lbs.activeInspectorId && lbs.activeInspector) {
            lbs.activeInspectorId = lbs.activeInspector.Id
        } else if (!lbs.activeInspectorId) {
            lbs.log.warn('Could not set active inspector id!')
        }

<<<<<<< HEAD
        // override sys-view
        if (lbs.common.getURLParameter('sv') !== null) {
            this.activeClass = 'system/view/{0}'.format(lbs.common.getURLParameter('sv'))
        }

        if (lbs.common.getURLParameter('id') !== null) {
            lbs.activeInspectorId = parseInt(lbs.common.getURLParameter('id'), 10)
        }

        if (lbs.common.getURLParameter('locale') !== null) {
            lbs.activeLocale = lbs.common.getURLParameter('locale').replace('-', '_')
        } else {
            lbs.activeLocale = lbs.common.executeVba('LBSHelper.getLocale').replace('-', '_')
=======
        lbs.activeLocale = lbs.common.getURLParameter('locale')
        if (!lbs.activeLocale && lbs.hasLimeConnection) {
            lbs.activeLocale = lbs.common.executeVba('LBSHelper.getLocale')
        } else if (!lbs.activeLocale) {
            lbs.log.warn('Could not set locale! Default "en_us" will be used')
>>>>>>> Rewritten setup of AP env
        }

        lbs.session = lbs.common.getURLParameter('session')
        if (!lbs.session && lbs.hasLimeConnection) {
            lbs.session = lbs.common.executeVba('LBSHelper.GetSessionID')
        } else if (!lbs.session) {
            throw new SetupError('Could not get users active session')
        }

        lbs.activeLimeObjectId = lbs.common.getURLParameter('limeobjectid')
        if (!lbs.activeLimeObjectId && lbs.activeInspector) {
            lbs.activeLimeObjectId = lbs.activeInspector.record.ID
        } else if (!lbs.activeLimeObjectId && lbs.activeClass !== 'index') {
            throw new SetupError('Could not get the active LimeObjects id')
        }


        lbs.setWrapper()
        lbs.setActiveDBandServer()
        lbs.setSkin()

        document.title += `: ${this.activeClass}`
        lbs.log.info(`Using wrapper type: ${lbs.wrapperType}`)
        lbs.log.info(`Using view: ${lbs.activeClass || 'No view supplied'}`)
    },

    setActiveInspectorReference() {
        if (lbs.hasLimeConnection) {
            /* Just trying to grab the activeInspector by reference might cause problems
             a to query strings a therefor added by lime and used to make a lookup.
            In old clients this isn't done and we need a fallback
            */
            switch (lbs.common.getURLParameter('apowner')) {
            // "owner" of actionpad, a inspector or the application
            case 'inspector': {
                const inspectorId = lbs.common.getURLParameter('apownerid')
                if (inspectorId) {
                    lbs.activeInspector = lbs.limeDataConnection.Inspectors.Lookup(inspectorId)
                }
                break
            }
            case 'application':
                lbs.activeInspector = null
                break
            default: // no inspectorid support, using fallback
                lbs.activeInspector = lbs.limeDataConnection.ActiveInspector
            }
            // set references
        }
    },

    setWrapper() {
        switch (lbs.common.getURLParameter('type')) {
        case 'tab':
            lbs.wrapperType = 'wrapperTab'
            $('#wrapper').removeClass('content-container').addClass('content-container-tab')
            break
        case 'inline':
            lbs.wrapperType = 'wrapperInline'
            $('#wrapper').removeClass('content-container').addClass('content-container-inline')
            break
        default:
            lbs.wrapperType = 'wrapperActionpad'
        }
    },
    /**
    Find database and server
    */
    setActiveDBandServer() {
        lbs.activeServer = lbs.common.getURLParameter('server')
        if (!lbs.activeServer && lbs.hasLimeConnection) {
            lbs.activeServer = lbs.limeDataConnection.Database.ActiveServerName
        } else if (!lbs.activeServer) {
            throw new SetupError('Could not set active server')
        }

        lbs.activeDatabase = lbs.common.getURLParameter('database')
        if (!lbs.activeDatabase && lbs.hasLimeConnection) {
            lbs.activeDatabase = lbs.limeDataConnection.Database.Name
        } else if (!lbs.activeDatabase) {
            throw new SetupError('Could not set active database')
        }

        lbs.log.info(`Active Server, Database: ${lbs.activeServer}, ${lbs.activeDatabase}`)
    },

    setSkin() {
        let skin = parseInt(lbs.common.getURLParameter('skin'), 10)
        if (!skin && lbs.hasLimeConnection) {
            skin = lbs.limeDataConnection.application.Theme
        }
        switch (skin) {
        case 1:
            lbs.log.info('Silver skin is used')
            $('body').addClass('silver')
            break
        case 2:
            lbs.log.info("Skin: I'm Britney bitch!")
            $('body').addClass('britney')
            break
        default:
            lbs.log.info('Skin: Default')
        }
    },

    /**
    * On click handlers. Executes events when clicked, such as running VBA or manipulating the DOM
    *
    * */

    GlobalEventHandler: {
        OnKeydown(data, e) {
            // relaod AP (ctrl+shift+r)
            if (e.ctrlKey && e.shiftKey && e.which === 82) {
                window.location.reload()
                return false
            }
            return true
        },
    },

    SetTouchEnabled(enable) {
        $('html').attr('oncontextmenu', 'return {0}'.format(enable ? 'true' : 'false'))
        $('html').toggleClass('notouch', !enable)
    },

    /**
    Apply knockout bindings to actionpad, note: no apps will be effected
    */
    applyContentBindings() {
        ko.punches.interpolationMarkup.enable()
        ko.punches.attributeInterpolationMarkup.enable()
        ko.punches.textFilter.enableForBinding('text')

        try {
            ko.applyBindings(lbs.vm, $('#content').get(0))
        } catch (e) {
            lbs.log.warn('Binding of data ActionPad failed! \n Displaying mapping attributes', e)
        }

        try {
            if (lbs.activeClass) {
                ko.applyBindings(lbs.vm, $('body').get(0))
            }
        } catch (e) {
            lbs.log.warn('Binding of body bindings failed!', e)
        }
    },
}

/**
ViewModel factory, extend this to add knockout functionality to actionpads
*/
export default lbs
