lbs.log = {

    /**
    active viewModel instance
    */
    vm: null,

    
    /**
    Setup the lof and create view model
    */
    setup: function (enabled) {
        //loadViewScript
        lbs.loader.loadView('system/view/debugLog',$("#debug"))
        //create viewModel
        this.vm = new lbs.log.vmFactory();
        this.vm.enabled(enabled);

        //ApplyBindings
        ko.applyBindings(this.vm, $("#debug").get(0));
    },

    /**
    Log to the custom view in the actionpad

    TODO: implement limitation depending on theshold
    */
    logToDom: function (type, msg) {
        if (!lbs.debug) { return; };
        if (lbs.log.vm) {
            lbs.log.vm.addEntry(type.toUpperCase(), msg);
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
            lbs.error = true;
            try { console.error(msg) } catch (e) { };
        },
    },

    /**
    Log entry function for debug
    */
    "debug": function (msg) {
        lbs.log.logToDom('DEBUG', lbs.common.nl2br(msg));
        lbs.log.logToConsole.debug(lbs.common.nl2br(msg));
    },

    /**
    Log entry function for info
    */
    "info": function (msg) {
        lbs.log.logToDom('INFO', lbs.common.nl2br(msg));
        lbs.log.logToConsole.info(lbs.common.nl2br(msg));
    },

    /**
    Log entry function for warn
    */
    "warn": function (msg) {
        lbs.log.logToDom('WARN', lbs.common.nl2br(msg));
        lbs.log.logToConsole.warn(lbs.common.nl2br(msg));
    },

    /**
    Log entry function for error
    */
    "error": function (msg) {
        lbs.log.logToDom('ERROR', lbs.common.nl2br(msg));
        lbs.log.logToConsole.error(lbs.common.nl2br(msg));
    },

    /**
    Log entry function for exception
    */
    "exception": function (e) {
        lbs.log.logToDom('ERROR', e.message + lbs.common.nl2br(e.message+"\n" + e.stack));
        //lbs.log.logToDom('ERROR',lbs.common.nl2br(e.message));
        lbs.log.logToConsole.error(lbs.common.nl2br(e.message), e);
    },
}

/**
ViewModel factory 
*/
lbs.log.vmFactory = function () {
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