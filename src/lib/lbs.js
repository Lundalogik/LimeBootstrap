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
    activeInspector: '',
    activeInspectorId: null,
    session: null,
    wrapperType: 'actionpad',
    apps: {},
    error: false,
    vm: {},
    loading: {},
    loader,
    common: Common,
    apploader,
    bakery: Bakery,
    log: new Log(),

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
    setup() {
        // register custom bindnings
        registerCustomBindings()

        // system param
        this.setSystemOperationParameters()

        // Enable or disable debug-mode
        this.debug = lbs.externalConfig.debug

        // set contextmenu enables/disabled
        this.SetTouchEnabled(false)

        // init the log
        this.log.setVerboseLevel()

        lbs.log.startTimer('LBS total load time')
        // get AP class etc
        this.setActionPadEnvironment()

        // load loader (sic!)
        this.setupLoader()

        // configure
        this.processConfiguration()

        // get Server and Database
        this.setActiveDBandServer()

        // set Skin
        this.setSkin()

        // set moment language
        moment.locale(lbs.common.executeVba('Localize.GetLanguage'))

        // load datasources
        this.vm = lbs.loader.loadDataSources(this.vm, this.config.dataSources, false)

        // load view
        if (lbs.activeClass) {
            this.loader.loadView(lbs.activeClass, $('#content'))
        }
        // load caurousel
        this.apploader.buildCarousel()

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
    Initialize a neat little loading spinner
    */
    setupLoader() {
        lbs.loading.showLoader = ko.observable(true)
        lbs.loading = ko.mapping.fromJS(lbs.loading)
        ko.applyBindings(lbs.loading, $('#loadingIndicator').get(0))
    },

    /**
    Fetch variables required to run system
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
    Find active actionpad view
    */
    setActionPadEnvironment() {
        let apowner = null
        let inspectorObject = null
        let inspectorId = null

        // has limeconnection, try to get decent values
        if (lbs.hasLimeConnection) {
            // get inspector environment
            try {
                // got support for inspectorid
                apowner = lbs.common.getURLParameter('apowner')
                if (apowner !== null) {
                    if (apowner === 'inspector') {
                        // its an AP, find out which
                        inspectorId = lbs.common.getURLParameter('apownerid')
                        if (inspectorId) {
                            inspectorObject = lbs.limeDataConnection.Inspectors.Lookup(inspectorId)
                        }
                    } else if (apowner === 'application') {
                        // its main AP
                        inspectorObject = null
                    }
                } else { // no inspectorid support
                    inspectorObject = lbs.limeDataConnection.ActiveInspector
                }

                // set values
                if (inspectorObject) {
                    lbs.activeInspector = inspectorObject
                    lbs.activeClass = inspectorObject.class.Name
                    lbs.activeInspectorId = inspectorObject.ID
                } else {
                    lbs.activeInspector = null
                    lbs.activeClass = 'index'
                }
            } catch (e) {
                lbs.log.warn('Could not determine inspector class, assuming index', e)
                lbs.activeClass = 'index'
            }
        }

        // override
        if (lbs.common.getURLParameter('ap') !== null) {
            this.activeClass = lbs.common.getURLParameter('ap')
        }

        if (window.location.hash !== '') {
            this.activeClass = window.location.hash.substring(1)
        }

        // override sys-view
        if (lbs.common.getURLParameter('sv') !== null) {
            this.activeClass = 'system/view/{0}'.format(lbs.common.getURLParameter('sv'))
        }

        if (lbs.common.getURLParameter('id') !== null) {
            lbs.activeInspectorId = parseInt(lbs.common.getURLParameter('id'), 10)
        }

        if (lbs.common.getURLParameter('session') !== null) {
            lbs.session = lbs.common.getURLParameter('session')
        }

        // get wrapper environment
        try {
            const wrapperType = lbs.common.getURLParameter('type')
            if (wrapperType !== null) {
                switch (wrapperType) {
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
            } else {
                lbs.wrapperType = 'wrapperActionpad'
            }
        } catch (e) {
            lbs.log.error('Could not determine wrapper type', e)
        }

        document.title += `: ${this.activeClass}`

        lbs.log.info(`Using wrapper type: ${lbs.wrapperType}`)
        lbs.log.info(`Using view: ${lbs.activeClass || 'No view supplied'}`)
    },

    /**
    Find database and server
    */
    setActiveDBandServer() {
        try {
            lbs.activeServer = lbs.limeDataConnection.Database.ActiveServerName
            lbs.activeDatabase = lbs.limeDataConnection.Database.Name
            lbs.log.info(`Active Server, Database: ${lbs.activeServer}, ${lbs.activeDatabase}`)
        } catch (e) {
            lbs.log.warn('Could not set active server and database')
        }
    },

    /**
    Find database and server
    */
    setSkin() {
        try {
            // var skin = lbs.common.executeVba("ActionPadTools.GetSkin");
            const skin = lbs.hasLimeConnection ? lbs.limeDataConnection.application.Theme : 1
            if (skin === 1) {
                lbs.log.info('Silver skin is used')
                $('body').addClass('silver')
            } else if (skin === 2) {
                lbs.log.info("Skin: I'm Britney bitch!")
                $('body').addClass('britney')
            }
        } catch (e) {
            lbs.log.warn('Could not set the skin')
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
lbs.VmFactory = () => {}
export default lbs
