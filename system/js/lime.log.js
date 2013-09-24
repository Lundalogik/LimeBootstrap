limejs.log = {

    /**
    active viewModel instance
    */
    vm: null,

    
    /**
    Setup the lof and create view model
    */
    setup: function (enabled) {
        //loadViewScript
        limejs.loader.loadView('system/view/debugLog',$("#debug"))
        //create viewModel
        this.vm = new limejs.log.vmFactory();
        this.vm.enabled(enabled);

        //ApplyBindings
        ko.applyBindings(this.vm, $("#debug").get(0));
    },

    /**
    Log to the custom view in the actionpad

    TODO: implement limitation depending on theshold
    */
    logToDom: function (type, msg) {
        if (!limejs.debug) { return; };
        if (limejs.log.vm) {
            limejs.log.vm.addEntry(type.toUpperCase(), msg);
        }
    },

    /**
    Log to the console if in chrome
    
    TODO: implement limitation depending on theshold
    */
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

    /**
    Log entry function for debug
    */
    "debug": function (msg) {
        limejs.log.logToDom('DEBUG', limejs.common.nl2br(msg));
        limejs.log.logToConsole.debug(limejs.common.nl2br(msg));
    },

    /**
    Log entry function for info
    */
    "info": function (msg) {
        limejs.log.logToDom('INFO', limejs.common.nl2br(msg));
        limejs.log.logToConsole.info(limejs.common.nl2br(msg));
    },

    /**
    Log entry function for warn
    */
    "warn": function (msg) {
        limejs.log.logToDom('WARN', limejs.common.nl2br(msg));
        limejs.log.logToConsole.warn(limejs.common.nl2br(msg));
    },

    /**
    Log entry function for error
    */
    "error": function (msg) {
        limejs.log.logToDom('ERROR', limejs.common.nl2br(msg));
        limejs.log.logToConsole.error(limejs.common.nl2br(msg));
    },

    /**
    Log entry function for exception
    */
    "exception": function (e) {
        //limejs.log.logToDom('ERROR', e.message + limejs.common.nl2br("\n" + e.stack));
        limejs.log.logToDom('ERROR',limejs.common.nl2br(e.message));
        limejs.log.logToConsole.error(limejs.common.nl2br(e.message), e);
    },
}

/**
ViewModel factory 
*/
limejs.log.vmFactory = function () {
    //Number of items to show in log
    this.maxNbrOfItems = 30;
    this.logItems = ko.observableArray([]);
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