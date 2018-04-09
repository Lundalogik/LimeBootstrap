/**
* This is the default Lime CRM javascript lib for actionpad functions.
* It contains many functions to make the world a little better place.
*/
import 'babel-polyfill'

import moment from 'moment'
import $ from 'jquery'
import _ from 'underscore'

import ko from 'knockout'
import 'knockout-mapping'
import 'knockout-punches'

import log from './lbs.log'
import loader from './lbs.loader'
import common from './lbs.common'
import apploader from './lbs.apploader'
import bakery from './lbs.bakery'
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
    wrapperType: 'actionpad',
    apps: {},
    error: false,
    vm: {},
    loading: {},
    loader,
    common,
    apploader,
    bakery,

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
            libs: ['json2xml.js', 'moment.min.js'],
        },
        autorefresh: false,
    },

    /**
    Setup
    */
    setup() {
        const tTot1 = moment()
        lbs.log = {}
        lbs.log.log = function() {
            console.log.apply(console, arguments);
        }
        lbs.log.info = function() {
            console.info.apply(console, arguments);
            if (lbs.hasLimeConnection) {
                //lbs.common.executeVba('debug.print', 'hepp')
                //alert("hepp")
               
            }
        }
        lbs.log.warn = function() {
            console.warn.apply(console, arguments);
        }
        lbs.log.error = function() {
            console.error.apply(console, arguments);
            if (lbs.hasLimeConnection) {
                //lbs.common.executeVba('Debug.Print', 'hepp')
                let args = Array.prototype.slice.call(arguments);
                //lbs.common.executeVba('LBSHelper.Log', args.toString())
            }
        }
        lbs.log.debug = function() {
            console.debug.apply(console, arguments);
        }


        // register custom bindnings
        registerCustomBindings()

        // system param
        this.setSystemOperationParameters()

        // Enable or disable debug-mode
        this.debug = lbs.externalConfig.debug

        // set contextmenu enables/disabled
        lbs.SetTouchEnabled(false)

        // init the log
        //window.console.log = lbs.log.log
        //this.setVerboseLevel()
        //this.log.setup(lbs.debug)

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

        // init watch
        //this.log.watch.setup()

        // load view
        // this.loader.loadView('system/view/{0}'.format(lbs.wrapperType), $('#wrapper'))
        if (lbs.activeClass) {
            this.loader.loadView(lbs.activeClass, $('#content'))
        }
        // load caurousel
        this.apploader.buildCarousel()

        // load apps
        this.apploader.identifyApps()

        // load resources
        this.loader.loadResources()

        const tApp1 = moment()
        // apps vm
        this.apploader.buildApps()

        // setup bindings
        this.applyContentBindings()

        // init apps
        this.apploader.initializeApps()
        const tApp2 = moment()

        // push delayed logitems
        //this.log.vm.enableConsole()

        // execute onLoad
        this.ExecuteOnloadEvents()

        // setOnclickEvents
        this.SetJqEvents()

        // Check for updates
        this.checkForUpdates()

        // Loading complete
        lbs.loading.showLoader(false)

        // Loading cookies
        lbs.bakery.loader()

        // syntax highjlight
        //lbs.log.watch.sh()
        const tTot2 = moment()

        lbs.log.info(`Total load time: ${tTot2.diff(tTot1, 'milliseconds')}ms`)
        lbs.log.info(`App load time: ${tApp2.diff(tApp1, 'milliseconds')}ms`)
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
    Find debug flags
    */
    setDebug(val) {
        lbs.debug = val
    },

    setVerboseLevel() {
        if (lbs.externalConfig.verboseLevel) {
            switch (lbs.externalConfig.verboseLevel) {
            case 'debug':
                lbs.verboseLevel = lbs.log.verboseLevelEnum.debug
                break
            case 'info':
                lbs.verboseLevel = lbs.log.verboseLevelEnum.info
                break
            case 'warn':
                lbs.verboseLevel = lbs.log.verboseLevelEnum.warn
                break
            case 'error':
                lbs.verboseLevel = lbs.log.verboseLevelEnum.error
                break
            default:
                lbs.verboseLevel = lbs.log.verboseLevelEnum.warn
                break
            }
        } else {
            lbs.verboseLevel = lbs.log.verboseLevelEnum.warn
        }
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

        // override sys-view
        if (lbs.common.getURLParameter('sv') !== null) {
            this.activeClass = 'system/view/{0}'.format(lbs.common.getURLParameter('sv'))
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
    SetJqEvents() {


    },

    GlobalEventHandler: {
        OnKeydown(data, e) {
            // relaod AP (ctrl+shift+r)
            if (e.ctrlKey && e.shiftKey && e.which === 82) {
                window.location.reload()
                return false
            } else if (e.ctrlKey && e.shiftKey && e.which === 87) { // open watch (ctrl+shift+w)
                lbs.log.watch.show('WATCH')
                return false
            } else if (e.ctrlKey && e.shiftKey && e.which === 76) { // open log (ctrl+shift+l)
                lbs.log.watch.show('LOG')
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
    * On load handler. Executes events when the actionpad is loaded,
    * such as running setting up the DOM, hideing things and setting up
    * */
    ExecuteOnloadEvents() {
        // header icons
        $('.header-icon').each((index, element) => {
            $(element).addClass('header-icon-container')
            $(element).css('background-image', `url('resources/${lbs.activeClass}.png')`)
            $(element).append(`<img src="resources/${lbs.activeClass}.png" class="header-icon-invis" />`)
        })

        // Clickable popovers close on click outside
        $('body').on('click', (e) => {
            if ($(e.target).data('toggle') !== 'popover' && $(e.target).parents('.popover.in').length === 0) {
                $('[data-toggle="popover"]').popover('hide')
            }
        })
        // FIX FOR CAROUSEL ANIMATION BUG
        $('.carousel').carousel().on('slide.bs.carousel', (e) => {
            const nextH = $(e.relatedTarget).height()
            $(this).find('.active.item').parent().animate({ height: Math.max(nextH, $(e.currentTarget).height()) }, 500)
        })
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

    checkForUpdates() {
        // Check app version if debug is enabled
        if (lbs.debug && lbs.hasLimeConnection) {
            // Check for app updates
            const lbsURL = 'http://api.lime-bootstrap.com/' // limebootstrap.lundalogik.com/api/";
            $.each(lbs.apps, (index, app) => {
                const appName = app.name

                try {
                    // Load remote version info
                    const remoteData = $.parseJSON(lbs.loader.loadFromExternalWebService(`${lbsURL}apps/${appName}/`))
                    if (remoteData) {
                        if (remoteData.error) {
                            lbs.log.warn(`Failed to check remote version of app: ${appName}. Reason: ${remoteData.error}`)
                            return
                        }
                    } else {
                        lbs.log.warn(`Failed to check remote version of app: '${appName}'`)
                        return
                    }

                    const remoteVersionData = remoteData.info.versions

                    // Load local version info
                    const localData = lbs.loader.loadLocalFileToString(`apps/${appName}/app.json`)
                    if (localData === '') {
                        lbs.log.warn(`Failed to check local version of app: ${appName}`)
                        return
                    }
                    const localVersionData = $.parseJSON(localData).versions

                    // Extract the latest version number from the versions array of version objects
                    const currentRemoteVersion = _.max(remoteVersionData, versionInfo =>
                        versionInfo.version).version
                    const currentLocalVersion = _.max(localVersionData, versionInfo =>
                        versionInfo.version).version


                    if (parseFloat(currentLocalVersion) < parseFloat(currentRemoteVersion)) {
                        lbs.log.warn(`App '${appName}' has an available update. Installed version: ${currentLocalVersion}, Available version: ${currentRemoteVersion}`)
                        lbs.log.vm.addAppUpdate({
                            appName,
                            remoteVersion: currentRemoteVersion,
                            localVersion: currentLocalVersion,
                        })
                    } else {
                        lbs.log.info(`App '${appName}' is up to date (version: ${currentLocalVersion})`)
                    }
                } catch (e) {
                    lbs.log.warn(`Failed to check version of app: ${appName}`, e)
                }
            })

            try {
            // Check for LBS Update
                const remoteData = lbs.loader.loadFromExternalWebService(`${lbsURL}version`)
                if (!remoteData) {
                    lbs.log.warn('Failed to check remote version of LBS! ')
                    return
                }


                const remoteVersionData = $.parseJSON(remoteData)

                let sortedVersions = remoteVersionData.versions.sort((ls, rs) =>
                    lbs.common.compareVersions(ls.version.toString(), rs.version.toString()))
                const localVersionData = $.parseJSON(lbs.loader.loadLocalFileToString('system/version.json'))

                const currentRemoteVersion = sortedVersions[0].version

                sortedVersions = localVersionData.versions.sort((ls, rs) =>
                    lbs.common.compareVersions(ls.version.toString(), rs.version.toString()))

                const currentLocalVersion = sortedVersions[0].version

                if (currentRemoteVersion.toString().split('.')[1] > currentLocalVersion.toString().split('.')[1]) {
                    lbs.log.vm.showUpgrade(true)
                    lbs.log.vm.showLBSVersion(true)
                    lbs.log.vm.remoteVersion(' v{0}-> v{1}'.format(currentLocalVersion, currentRemoteVersion))
                    lbs.log.warn('Your LIME Bootstrap is out of date! v{0}->v{1}'.format(currentLocalVersion, currentRemoteVersion))
                } else {
                    lbs.log.info('LBS version: v{0}'.format(currentLocalVersion))
                }
            } catch (e) {
                lbs.log.warn('Failed to check version of LBS! ', e)
            }
        }
    },
}

/**
ViewModel factory, extend this to add knockout functionality to actionpads
*/
lbs.VmFactory = () => {}
window.lbs = lbs
/**
Every this is loaded, run the awesomeness!
*/
$(document).ready(() => { lbs.setup() })
// lbs.setup();
