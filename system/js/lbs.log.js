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
        lbs.loader.loadView('system/view/debug',$("#debug"))
        //create viewModel
        this.vm = new lbs.log.vmFactory(enabled);
        ko.applyBindings(this.vm, $("#debug").get(0));
    },

    /**
    Log to the custom view in the actionpad

    TODO: implement limitation depending on theshold
    */
    logToDom: function (type, msg) {
        //if (!lbs.debug) { return; };
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
            lbs.log.vm.errorFound(true);
            try { console.error(msg) } catch (e) { };
        },
    },

    /**
    Log entry function for debug
    */
    "debug": function (msg) {
        lbs.log.logToDom('DEBUG', lbs.common.nl2brIndent(msg));
        lbs.log.logToConsole.debug((msg));
    },

    /**
    Log entry function for info
    */
    "info": function (msg) {
        lbs.log.logToDom('INFO', lbs.common.nl2brIndent(msg));
        lbs.log.logToConsole.info((msg));
    },

    /**
    Log entry function for warn
    */
    "warn": function (msg, e) {
        if(e){lbs.log.exception(e,'WARN')}
        lbs.log.logToDom('WARN', lbs.common.nl2brIndent(msg));
        lbs.log.logToConsole.warn((msg));
    },

    /**
    Log entry function for error
    */
    "error": function (msg, e) {
        if(e){lbs.log.exception(e)}
        lbs.log.logToDom('ERROR', lbs.common.nl2brIndent(msg));
        lbs.log.logToConsole.error((msg));
    },

    /**
    Log entry function for exception
    */
    "exception": function (e, level) {
        if (!level) {level = 'ERROR'}
        lbs.log.logToDom(level, e.message + lbs.common.nl2brIndent(e.message + "\n" + e.stack));
        lbs.log.logToConsole.error((e.message), e);
    },
}

/**
ViewModel factory 
*/
lbs.log.vmFactory = function (enabled) {
    //Number of items to show in log
    var self = this;
    this.maxNbrOfItems = 30;
    this.logItems = ko.observableArray([]);
    this.enabled = ko.observable(enabled);
    this.delayedLogItems = [];
    this.delayedLoggingEnabled = true;
    this.showUpgrade = ko.observable(false);
    this.appUpdates = ko.observableArray();
    this.showLBSVersion = ko.observable(false);
    this.remoteVersion = ko.observable();
    this.errorFound = ko.observable(false);

    this.addAppUpdate = function(appName){
        self.showUpgrade(true);
        self.appUpdates.push(appName);
    }

    this.enableConsole = function () {
        this.delayedLoggingEnabled = false;
        this.pushDelayedLogItems();
    }

    this.addEntry = function (lev, item) {
        ico = 'icon-exclamation';
        rowclass = 'alert alert-info';
        switch (lev) {
            case 'DEBUG':
                ico = 'fa fa-cog';
                rowclass = 'alert alert-info';
                break;
            case 'INFO':
                ico = 'fa fa-info-circle';
                rowclass = 'alert alert-info';
                break;
            case 'WARN':
                ico = 'fa fa-warning';
                rowclass = 'alert alert-warning';
                break;
            case 'ERROR':
                ico = 'fa fa-times-circle';
                rowclass = 'alert alert-danger';
                this.enabled(true);
                break;
        }


        //log to delayed list
        if (this.delayedLoggingEnabled) {
            this.delayedLogItems.push({ level: lev, text: item, icon: ico, liclass: rowclass });
        }
        //log to real log
        else
        {
            //remove first item if to meny in log
            if (this.logItems().length >= this.maxNbrOfItems) {
                this.logItems.shift();
            }
            this.logItems.push({ level: lev, text: item, icon: ico, liclass: rowclass });
        }
    },

    /*
    push delayed items into log
    */
    this.pushDelayedLogItems = function(){
        var key;
        for (key in this.delayedLogItems) {
            this.logItems.push(this.delayedLogItems[key]);
        };
    }
}

lbs.log.watch = {

    show : function(){
        var wvm = new lbs.log.watch.vmFactory();
        var dialog = showModalDialog("lbs.html?sv=watch&&type=inline",wvm,"status:false;dialogWidth:700px;dialogHeight:700px");
    },

    setup : function(){
        //only applicable for watch view
        if(lbs.activeClass != 'system/view/watch'){
            return;
        }

        if(window.dialogArguments){

            lbs.log.vm.enabled(false);
            //fetch vm from args
            var args = window.dialogArguments;

            //recrate vm in new scope. Some properties and knockout stuff
            //may not survive the modal reference
            var wvm = new lbs.log.watch.vmFactory();
            wvm.vms = args.vms;
            wvm.logItems = args.logItems;

            //load to global vm
            vm = lbs.common.mergeOptions(lbs.vm, wvm || {}, true);

            //set active vm
            wvm.selectVm(wvm.vms[0]);
        }
    },

    //syntax highligt
    sh : function(){
        $('pre code').each(function(i, e) {hljs.highlightBlock(e)});
    },

    vmFactory : function(){
        var self = this;

        //data holders
        self.selectedVm = ko.observable({'name':'',vm:{}});
        self.vms = [];

        //format vm as string
        self.prettyVm = ko.computed(function(){
            var p = JSON.stringify(self.selectedVm().vm,null,2);
            return p;
        });

        //select vm to show
        self.selectVm = function(vm){
            self.selectedVm(vm);
            lbs.log.watch.sh();
        }

        //get vm from apps
        var map = $.map(lbs.apps,function(v,i){
            return {name : v.name, vm : ko.toJS(v.vm) || {}};
        });

        //add AP VM
        self.vms.push({name : 'AP', vm : lbs.vm});
        self.vms = self.vms.concat(map);
    }
};


lbs.log.console = {

    show : function(){
        var wvm = new lbs.log.console.vmFactory();
        var dialog = showModalDialog("lbs.html?sv=log&&type=inline",wvm,"status:false;dialogWidth:700px;dialogHeight:700px");
    },

    setup : function(){
        //only applicable for log view
        if(lbs.activeClass != 'system/view/log'){
            return;
        }

        if(window.dialogArguments){
            lbs.log.vm.enabled(false);
            //fetch vm from args
            var args = window.dialogArguments;

            //recrate vm in new scope. Some properties and knockout stuff
            //may not survive the modal reference
            var wvm = new lbs.log.console.vmFactory();
            wvm.logItems = args.logItems;

            console.log(wvm)

            //load to global vm
            vm = lbs.common.mergeOptions(lbs.vm, wvm || {}, true);
        }
    },


    vmFactory : function(){
        var self = this;

        //get logposts
        self.logItems = ko.toJS(lbs.log.vm.logItems);
    }
};