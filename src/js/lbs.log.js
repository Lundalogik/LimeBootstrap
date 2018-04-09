import ko from 'knockout'
import $ from 'jquery'

const log = {

    /**
    active viewModel instance
    */
    vm: null,

    verboseLevelEnum: {
        debug: 3,
        info: 2,
        warn: 1,
        error: 0,
    },

    /**
    Setup the lof and create view model
    */
    setup: (enabled) => {
        // create viewModel
        log.vm = new lbs.log.VmFactory(enabled)
        // loadViewScript
        ko.applyBindings(log.vm, $('#debug').get(0))
    },

    /**
    Log to the custom view in the actionpad

    TODO: implement limitation depending on theshold
    */
    logToDom(type, msg) {
        // if (!lbs.debug) { return; };
        if (lbs.log.vm) {
            lbs.log.vm.addEntry(type.toUpperCase(), msg)
        }
    },


    /**
    Log to the console if in chrome

    TODO: implement limitation depending on theshold
    */
    logToConsole: {
        debug(msg) {
            try { console.debug(msg) } catch (e) { lbs.log.error(e) }
        },
        info(msg) {
            try { console.info(msg) } catch (e) { lbs.log.error(e) }
        },
        warn(msg) {
            try { console.warn(msg) } catch (e) { lbs.log.error(e) }
        },
        error: (msg) => {
            lbs.error = true
            lbs.log.vm.errorFound(true)
            lbs.SetTouchEnabled(true)
            try {
                console.error(msg)
            } catch (e) {
                lbs.log.error(e)
            }
        },
    },
    /**
    Log entry function for app printing
    */
    log(args) {
        lbs.log.logToConsole.debug(args)
        args.map((arg) => {
            if (Array.isArray(arg)) {
                return ko.toJSON(arg, null, 0)
            } else if (typeof arg === 'object') {
                return ko.toJSON(arg, undefined, 4)
            }
            return arg.toString()
        }).forEach((arg) => {
            lbs.log.logToDom('LOG', lbs.common.nl2brIndent(arg))
        })
    },

    debug(msg) {
        if (lbs.verboseLevel >= lbs.log.verboseLevelEnum.debug) {
            lbs.log.logToDom('DEBUG', lbs.common.nl2brIndent(msg))
            lbs.log.logToConsole.debug((msg))
        }
    },

    /**
    Log entry function for info
    */
    info(msg) {
        if (lbs.verboseLevel >= lbs.log.verboseLevelEnum.info) {
            lbs.log.logToDom('INFO', lbs.common.nl2brIndent(msg))
            lbs.log.logToConsole.info((msg))
        }
    },

    /**
    Log entry function for warn
    */
    warn(msg, e) {
        if (lbs.verboseLevel >= lbs.log.verboseLevelEnum.warn) {
            if (e) { lbs.log.exception(e, 'WARN') }
            lbs.log.logToDom('WARN', lbs.common.nl2brIndent(msg))
            lbs.log.logToConsole.warn((msg))
        }
    },

    /**
    Log entry function for error
    */
    error(msg, e) {
        if (e) { lbs.log.exception(e) }
        lbs.log.logToDom('ERROR', lbs.common.nl2brIndent(msg))
        lbs.log.logToConsole.error((msg))
    },
    /**
    Log entry function for exception
    */
    exception(e) {
        if (lbs.verboseLevel >= lbs.log.verboseLevelEnum.error) {
            lbs.log.logToDom('ERROR', lbs.common.nl2brIndent(e.toString()))
            lbs.log.logToConsole.error(e.toString())
        }
    },

    /**
    Log to LIME Pro infolog tab.
    type should be either 'info', 'warning' or 'error'.
    */
    logToInfolog(unprocessedType, rawMsg) {
        let msg = rawMsg
        let type = unprocessedType
        try {
            if (type !== 'info' && type !== 'warning' && type !== 'error') {
                type = 'info'
            }
            if (typeof msg === 'object') {
                msg = JSON.stringify(rawMsg)
            } else if (typeof msg !== 'string') {
                msg = rawMsg.toString()
            }
            lbs.common.executeVba(`LBSHelper.logToInfolog,${type},${msg.replace(/,/g, '!@!').replace(/'/g, '%&%')}`)
        } catch (err) {
            lbs.common.executeVba(`LBSHelper.logToInfolog,error,}${err.toString().replace(/,/g, '!@!').replace(/'/g, '%&%')}`)
        }
    },
}

/**
ViewModel factory
*/
log.VmFactory = class {
    constructor(enabled) {
        this.maxNbrOfItems = 30
        this.logItems = ko.observableArray([])
        this.enabled = ko.observable(enabled)
        this.delayedLogItems = []
        this.delayedLoggingEnabled = true
        this.showUpgrade = ko.observable(false)
        this.appUpdates = ko.observableArray()
        this.showLBSVersion = ko.observable(false)
        this.remoteVersion = ko.observable()
        this.errorFound = ko.observable(false)
    }
    // Number of items to show in log

    addAppUpdate(appName) {
        this.showUpgrade(true)
        this.appUpdates.push(appName)
    }

    enableConsole() {
        this.delayedLoggingEnabled = false
        this.pushDelayedLogItems()
    }

    // different types of logs
    addEntry(lev, item) {
        let ico = 'icon-exclamation'
        let rowclass = 'alert alert-info'
        switch (lev) {
        case 'DEBUG':
            ico = 'fa fa-cog'
            rowclass = 'alert alert-info'
            break
        case 'INFO':
            ico = 'fa fa-info-circle'
            rowclass = 'alert alert-info'
            break
        case 'WARN':
            ico = 'fa fa-warning'
            rowclass = 'alert alert-warning'
            break
        case 'LOG':
            ico = 'fa fa-paw'
            rowclass = 'alert alert-success'
            break
        default:
            ico = 'fa fa-times-circle'
            rowclass = 'alert alert-danger'
            this.enabled(true)
            break
        }

        // log to delayed list
        if (this.delayedLoggingEnabled) {
            this.delayedLogItems.push({
                level: lev, text: item, icon: ico, liclass: rowclass,
            })
        } else { // log to real log
            // remove first item if to meny in log
            if (this.logItems().length >= this.maxNbrOfItems) {
                this.logItems.shift()
            }
            this.logItems.push({
                level: lev, text: item, icon: ico, liclass: rowclass,
            })
        }
    }

    /*
    push delayed items into log
    */
    pushDelayedLogItems() {
        $(this.delayedLogItems).each((index, element) => {
            this.logItems.push(element)
        })
    }
}


log.watch = {

    show(state) {
        const wvm = new lbs.log.watch.VmFactory()
        if (state !== '') { wvm.initState = state }
        window.showModalDialog('lbs.html?sv=watch&&type=tab', wvm, 'status:false;dialogWidth:900px;dialogHeight:820px;resizable:Yes')
    },

    setup() {
        // only applicable for watch view
        if (lbs.activeClass !== 'system/view/watch') {
            return
        }

        if (window.dialogArguments) {
            lbs.log.vm.enabled(false)
            lbs.SetTouchEnabled(true)

            // fetch vm from args
            const args = window.dialogArguments

            // recrate vm in new scope. Some properties and knockout stuff
            // may not survive the modal reference
            const wvm = new lbs.log.watch.VmFactory()
            wvm.vms = args.vms
            wvm.logItems = args.logItems
            wvm.initState = args.initState
            wvm.dom = args.dom

            // load to global vm
            lbs.vm = lbs.common.mergeOptions(lbs.vm, wvm || {}, true)

            // set active vm
            wvm.selectState(wvm.initState)
            wvm.selectVm(wvm.vms[0])

            // add trigger tot close watch 27 = enter. Ctrl+f will focus the search input
            const map = { 70: false, 27: false, 17: false }
            $('body').keydown((e) => {
                if (e.keyCode in map) {
                    map[e.keyCode] = true
                    if (map[70] && map[17]) {
                        $('#searchValue').focus()
                        map[70] = false
                        map[17] = false
                    }
                    if (map[27]) {
                        window.close()
                        map[27] = false
                    }
                }
            }).keyup((e) => {
                if (e.keyCode in map) {
                    map[e.keyCode] = false
                }
            })
        }
    },

    // syntax highligt
    sh() {
        $('pre code').each((i, e) => { hljs.highlightBlock(e) })
    },

    VmFactory() {
        const self = this

        // data holders
        self.selectedVm = ko.observable({ name: '', vm: {} })
        self.vms = []
        self.logItems = []
        self.selectedState = ko.observable('LOG')
        self.states = ['LOG', 'WATCH', 'DOM']
        self.initState = 'LOG'
        self.searchValue = ko.observable().extend({ throttle: 50 })
        self.logView = ko.observable('SHOW ALL')
        self.logStatus = ['LOG']
        self.watchSelected = ko.observable(false)


        // var html is used to save main html
        let html = ''
        self.counter = ko.observable(0)
        self.order = ko.observable(0)

        // format vm as string. clears var html
        self.prettyVm = ko.computed(() => {
            html = ''
            self.searchValue('')
            return JSON.stringify(self.selectedVm().vm, null, 2)
        })

        $('body').keypress((e) => {
            if (e.which === 13) {
                self.goToNext()
            }
        })

        self.select = () => {
            self.watchSelected(true)
            $('#vmDataText').height($('#vmDataText').prop('scrollHeight'))
        }
        self.deSelect = () => {
            self.watchSelected(false)
        }
        self.copyWatch = () => {
            window.clipboardData.setData('Text', $('#vmDataText').text())
        }
        // search a VM
        self.searchValue.subscribe((searchString) => {
            const lowerString = searchString.toLowerCase()
            self.order(0)
            // checks if the lowerString is bigger than 1 to make the search less demanding
            if (lowerString.length > 1) {
                const re = new RegExp(lowerString, 'g')
                const tempHtml = $('#vmData').html()
                if (html === '') {
                    html = tempHtml
                } else {
                    $('#vmData').html(html)
                }
                self.counter(self.replaceText($('#vmData'), re, lowerString, searchString))
                self.goToNext()
            } else {
                self.counter(0)
                if (html === '') {
                    $('#vmData').html($('#vmData').html())
                } else {
                    $('#vmData').html(html)
                }
            }
        })

        // used for the scroll
        self.goToNext = () => {
            // checks in which order scroll will work
            if ((self.order() < self.counter() && self.counter() > 0)) {
                const target = `#${self.order()}`
                if ($(target).length > 0) {
                    $('#watchContainer').animate({
                        scrollTop: $(target).offset().top + $('#watchContainer').scrollTop() - 200, // eslint-disable-line
                    }, 200)

                    const old = `#${(self.order() - 1).toString(16)}`
                    if ($(old).hasClass('highlight-grey')) {
                        $(old).removeClass('highlight-grey').addClass('highlight-yellow')
                    }

                    $(target).addClass('highlight-grey')
                    self.order(self.order() + 1)
                }
            } else {
                self.order(0)
                self.goToNext()
            }
        }
        // insert highlight on search string
        self.replaceText = (node, reg, lowString, orgString) => {
            let i = 0
            $(node).find('span').each((index, element) => {
                if (($(element).hasClass('hljs-string') || $(element).hasClass('hljs-number')) || $(element).hasClass('hljs-attribute')) {
                    if ($(element).text().toLowerCase().indexOf(lowString) > -1) {
                        const text = $(element).text().toLowerCase().replace(reg, `<span id=${i} class="highlight-yellow">${orgString}</span>`)
                        i += 1
                        $(element).html(text)
                    }
                }
            })
            return i
        }


        // select vm to show
        self.selectVm = (vm) => {
            self.selectedVm(vm)
            lbs.log.watch.sh()
        }

        self.selectState = (state) => {
            self.selectedState(state)
        }

        self.copyWatch = () => {
            window.clipboardData.setData('Text', $('#vmDataText').text())
        }

        // selected log status
        self.selectedLogStatus = (view) => {
            self.logView(view)
        }

        // get vm from apps
        const map = $.map(lbs.apps, (v) => { return { name: v.name, vm: v.vm } }) || {} // eslint-disable-line

        // add AP VM
        self.vms.push({ name: 'Actionpad', vm: lbs.vm })
        self.vms = self.vms.concat(map)

        // get logposts
        self.logItems = ko.toJS(lbs.log.vm.logItems)
        self.dom = $('#wrapper').get()[0].outerHTML
    },
}

export default log
