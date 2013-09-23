limejs = limejs || {};

//Log
limejs.log = {

    //view model
    "vm": null,

    //init
    "setup": function (enabled) {
        //loadViewScript
        limejs.loader.loadView('system/view/debugLog',$("#debug"))
        //create viewModel
        this.vm = new limejs.log.vmFactory();
        this.vm.enabled(enabled);

        //ApplyBindings
        ko.applyBindings(this.vm, $("#debug").get(0));
    },

    //log to the dom
    "logToDom": function (type, msg) {
        if (!limejs.debug) { return; };
        if (limejs.log.vm) {
            limejs.log.vm.addEntry(type.toUpperCase(), msg);
        }
    },

    //log to console
    logToConsole: {
        debug : function(msg){
            try { console.debug(msg) } catch (e) { };
        },
        info: function (msg) {
            try { console.info(msg) } catch (e) { };
        },
        warn: function (msg) {
            try { console.warn(msg) } catch (e) { };
        },
        error: function (msg) {
            limejs.error = true;
            try { console.error(msg) } catch (e) { };
        },
    },

    //TODO: implement limitation depending on theshold
    "debug": function (msg) {
        limejs.log.logToDom('DEBUG', limejs.common.nl2br(msg));
        limejs.log.logToConsole.debug(limejs.common.nl2br(msg));
    },
    "info": function (msg) {
        limejs.log.logToDom('INFO', limejs.common.nl2br(msg));
        limejs.log.logToConsole.info(limejs.common.nl2br(msg));
    },
    "warn": function (msg) {
        limejs.log.logToDom('WARN', limejs.common.nl2br(msg));
        limejs.log.logToConsole.warn(limejs.common.nl2br(msg));
    },
    "error": function (msg) {
        limejs.log.logToDom('ERROR', limejs.common.nl2br(msg));
        limejs.log.logToConsole.error(limejs.common.nl2br(msg));
    },
    "exception": function (e) {
        //limejs.log.logToDom('ERROR', e.message + limejs.common.nl2br("\n" + e.stack));
        limejs.log.logToDom('ERROR',limejs.common.nl2br(e.message));
        limejs.log.logToConsole.error(limejs.common.nl2br(e.message), e);
    },
}


//ViewModel
limejs.log.vmFactory = function() {
    this.logItems = ko.observableArray([]);
    this.maxNbrOfItems = 25;
    this.enabled = ko.observable(false);

    this.addEntry = function (lev, item) {
        ico = 'icon-exclamation';
        rowclass = 'alert-info';
        switch (lev) {
            case 'DEBUG':
                ico = 'icon-comment-alt';
                rowclass = 'alert-warning';
                break;
            case 'INFO':
                ico = 'icon-info-sign';
                rowclass = 'alert-info';
                break;
            case 'WARN':
                ico = 'icon-warning-sign';
                rowclass = 'alert-danger';
                break;
            case 'ERROR':
                icon = 'icon-remove';
                rowclass = 'alert-error';
                break;
        }

        //remove first item if to meny in log
        if (this.logItems().length >= this.maxNbrOfItems) {
            this.logItems.shift();
        }
                    
        this.logItems.push({ level: lev, text: item, icon: ico, liclass: rowclass });
    }
}