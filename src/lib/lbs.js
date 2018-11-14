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
import User from './models/lbs.Users'
/**
Objekt container
*/
const lbs = {
    /**
    Properties
    */
    debug: false,
    debugVm: { warnings: ko.observable(0), errors: ko.observable(0) },
    verboseLevel: null,
    limeDataConnection: window.external,
    limeVersion: {},
    hasLimeConnection: false,
    activeView: '',
    activeClass: '',
    activeDatabase: '',
    activeServer: '',
    activeLimeObjectId: null,
    activeInspector: null,
    activeInspectorId: null,
    activeLocale: 'en_us',
    activeUser: null,
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
    config: null,
    VmFactory: () => {},

    /**
    Setup
    */
    async setup() {
        // register custom bindnings
        registerCustomBindings()
        lbs.configureKnockout()


        // system param
        this.setSystemOperationParameters()

        // Enable or disable debug-mode
        this.debug = lbs.externalConfig.debug
        lbs.debugVm.enabled = this.debug
        ko.applyBindings(lbs.debugVm, $('#debug').get(0))
        if (this.debug) {
            $.getScript('system/js/firebug-lite-compressed.js', () => {
                window.firebug.init()
            })
        }

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
        moment.locale(lbs.activeLocale)

        // load datasources
        this.vm = await lbs.loader.loadDataSources(this.config.dataSources)

        // load view
        if (lbs.activeClass) {
            this.loader.loadView(lbs.activeView, $('#content'))
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

    configureKnockout() {
        ko.options.deferUpdates = true
        ko.onError = () => {
            lbs.debugVm.errors(lbs.debugVm.errors() + 1)
        }
        ko.punches.interpolationMarkup.enable()
        ko.punches.attributeInterpolationMarkup.enable()
        ko.punches.textFilter.enableForBinding('text')
    },
    /**
    Set properties when not standard
    */
    processConfiguration() {
        let defaultConfig = null
        const dataSources = lbs.externalConfig.dataSources || lbs.externalConfig.config
        if (lbs.externalConfig.defaultRestDataSources) {
            defaultConfig = {
                dataSources: [
                    { type: 'activeLimeObject' },
                    { type: 'translations', owner: `actionpad_${lbs.activeClass}` },
                ],
            }
        } else {
            defaultConfig = {
                dataSources: [
                    { type: 'activeInspector', source: '' },
                    { type: 'localization', source: '' },
                ],
            }
        }

        this.config = lbs.loader.loadExternalConfig(
            defaultConfig,
            dataSources,
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
        this.limeVersion = lbs.hasLimeConnection
            ? lbs.common.parseVersion(lbs.limeDataConnection.Version) : lbs.common.parseVersion('0.0.0')
    },

    /**
    * Finds and sets
    *    - the view to use
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

        lbs.activeView = lbs.common.getURLParameter('ap')
        if (!lbs.activeView) { // all else fails, go for Index
            lbs.activeView = 'index'
        }

        // Get name of the LimeType
        lbs.activeClass = lbs.common.getURLParameter('apait')
        if (!lbs.activeClass && lbs.activeInspector) {
            lbs.activeClass = lbs.activeInspector.class.Name
        }

        lbs.activeLocale = lbs.common.getURLParameter('locale')
        if (!lbs.activeLocale && lbs.hasLimeConnection) {
            lbs.activeLocale = lbs.common.executeVba('LBSHelper.getLocale')
        } else if (!lbs.activeLocale) {
            lbs.log.warn('Could not set locale! Default "en_us" will be used')
        }
        lbs.activeLocale = lbs.activeLocale.replace('-', '_') // Lime is inconsistent in useage of locale strings

        // Get session
        lbs.session = lbs.common.getURLParameter('apsid')
        if (!lbs.session && lbs.hasLimeConnection) {
            lbs.session = lbs.common.executeVba('LBSHelper.GetSessionID')
        } else if (!lbs.session) {
            throw new SetupError('Could not get users active session')
        }

        lbs.activeLimeObjectId = parseInt(lbs.common.getURLParameter('limeobjectid'), 10)
        if (!lbs.activeLimeObjectId && lbs.activeInspector) {
            lbs.activeLimeObjectId = lbs.activeInspector.record.ID
        } else if (!lbs.activeLimeObjectId && !lbs.activeClass && !lbs.activeView === 'index') {
            throw new SetupError('Could not get the active LimeObjects id')
        }


        lbs.setWrapper()
        lbs.setActiveDBandServer()
        lbs.setSkin()
        lbs.setActiveUser()

        document.title += `: ${this.activeView}`
        lbs.log.info(`Using wrapper type: ${lbs.wrapperType}`)
        lbs.log.info(`Using view: ${lbs.activeView || 'No view supplied'}`)
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

    setActiveUser() {
        let activeUser = null
        if (lbs.common.getURLParameter('apusr')) {
            activeUser = JSON.parse(lbs.common.getURLParameter('apusr'))
            const groups = activeUser.groups.map(group => group.name)
            lbs.activeUser = new User(
                activeUser.name,
                activeUser.id, activeUser.isAdmin,
                activeUser.isSuperUser,
                groups,
            )
        } else if (lbs.hasLimeConnection) {
            activeUser = JSON.parse(lbs.common.executeVba('lbsHelper.getActiveUser')).ActiveUser
            const groups = activeUser.Groups.map(group => group.Name)
            lbs.activeUser = new User(
                activeUser.Name,
                activeUser.ID,
                activeUser.isAdmin,
                activeUser.isSuperUser,
                groups,
            )
        } else if (!activeUser) {
            throw new SetupError('Could not get active user')
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
        // set active server

        if (lbs.common.getURLParameter('apsrv')) {
            lbs.activeServer = lbs.common.getURLParameter('apsrv').split('://')[1]
        } else if (lbs.hasLimeConnection) {
            lbs.activeServer = lbs.limeDataConnection.Database.FullActiveServerName.split('://')[1]
        } else {
            throw new SetupError('Could not set active server')
        }

        // Set active database
        lbs.activeDatabase = lbs.common.getURLParameter('apdb')
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
        ko.applyBindings(lbs.vm, $('#content').get(0))
    },
}

/**
ViewModel factory, extend this to add knockout functionality to actionpads
*/
export default lbs
