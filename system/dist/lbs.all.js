/**
* This is the default LIME Pro javascript lib for actionpad functions.
* It contains many functions to make the world a little better place.
*/

/**
Objekt container
*/
var lbs = lbs || {
    /**
    Properties
    */
    "debug": false,
    "verboseLevel": null,
    "limeDataConnection": window.external,
    "limeVersion" : {},
    "hasLimeConnection": true,
    "activeClass": "",
    "activeDatabase": "",
    "activeServer": "",
    "activeInspector": "",
    "wrapperType" : "actionpad",
    "apps" : {},
    "error": false,
    "vm": {},
    "loading":{},

    /**
    config
    */
    config : {
        dataSources: [
             { type: 'activeInspector', source: ''},
             { type: 'localization', source: '' },
        ],
        resources: {
            scripts: [],
            styles: [],
            libs: ['json2xml.js', 'moment.min.js']
        },
        autorefresh : false
    },

    /**
    Setup
    */
    setup: function () {
        var tTot1 = moment();

        //system param
        this.setSystemOperationParameters();

        //Enable or disable debug-mode
        this.debug = lbs.externalConfig.debug;

        //set contextmenu enables/disabled
        lbs.SetTouchEnabled(false);
        
        //init the log
        window.console.log = lbs.log.log;
        this.setVerboseLevel();
        this.log.setup(lbs.debug);

        //get AP class etc
        this.setActionPadEnvironment();

        //load loader (sic!)
        this.setupLoader();

        //configure
        this.processConfiguration();

        //get Server and Database
        this.setActiveDBandServer();

        //set Skin
        this.setSkin();

        //set moment language
        moment.lang(lbs.common.executeVba('Localize.GetLanguage'));

        //load datasources
        this.vm = lbs.loader.loadDataSources(this.vm, this.config.dataSources, false);

        //init watch
        this.log.watch.setup();

        //load views
        this.loader.loadView('system/view/{0}'.format(lbs.wrapperType), $("#wrapper"));
        this.loader.loadView(lbs.activeClass, $("#content"));

        //load caurousel 
        this.apploader.buildCarousel();
        
        //load apps
        this.apploader.identifyApps();

        //load resources
        this.loader.loadResources();

        var tApp1 = moment();
        //apps vm
        this.apploader.buildApps();
        
        //setup bindings
        this.applyContentBindings();

        //init apps
        this.apploader.initializeApps();
        var tApp2 = moment();
        
        //push delayed logitems
        this.log.vm.enableConsole();

        //execute onLoad
        this.ExecuteOnloadEvents();

        //setOnclickEvents
        this.SetJqEvents();

        //Check for updates
        this.checkForUpdates();

        //Loading complete
        lbs.loading.showLoader(false);
        
        //Loading cookies
        lbs.bakery.loader();

        //syntax highjlight
        lbs.log.watch.sh();
        var tTot2 = moment();

        lbs.log.info("Total load time: " + tTot2.diff(tTot1,"milliseconds")+ "ms");
        lbs.log.info("App load time: " + tApp2.diff(tApp1,"milliseconds") + "ms");

    },


     /**
    Set properties when not standard
    */
    processConfiguration : function(){
        this.config = lbs.loader.loadExternalConfig(this.config,this.externalConfig.config,this.activeClass);
    },

    /**
    Initialize a neat little loading spinner
    */
    setupLoader : function(){
        this.loader.loadView("system/view/loader", $("#loadingIndicator"));

        lbs.loading.showLoader = ko.observable(true);
        lbs.loading = ko.mapping.fromJS(lbs.loading);
        ko.applyBindings(lbs.loading, $("#loadingIndicator").get(0));

    },

    /**
    Fetch variables required to run system
    */
    setSystemOperationParameters: function () {

        //ajax should be async
        $.ajaxSetup({
            async: false
        });

        //create viewmodel container
        this.vm = new lbs.vmFactory();
       
        //check connection to Lime
        this.hasLimeConnection = (typeof lbs.limeDataConnection.Application != 'undefined');

        //getVersion
        this.limeVersion =  lbs.hasLimeConnection ? 
            lbs.common.parseVersion(lbs.limeDataConnection.Version) : lbs.common.parseVersion("0.0.0");

    },



    /**
    Find debug flags
    */
    setDebug: function (val) {
        lbs.debug = val;
    },

    setVerboseLevel: function () {        
        if (lbs.externalConfig.verboseLevel) {            
            switch (lbs.externalConfig.verboseLevel) {                
                case "debug":
                    lbs.verboseLevel = lbs.log.verboseLevelEnum.debug;
                    break;
                case "info":
                    lbs.verboseLevel = lbs.log.verboseLevelEnum.info;
                    break;
                case "warn":
                    lbs.verboseLevel = lbs.log.verboseLevelEnum.warn;
                    break;
                case "error":
                    lbs.verboseLevel = lbs.log.verboseLevelEnum.error;
                    break;
                default:
                    lbs.verboseLevel = lbs.log.verboseLevelEnum.warn;
                    break;

            }
        } else {
            lbs.verboseLevel = lbs.log.verboseLevelEnum.warn
        }

    },




    /**
    Find active actionpad view
    */
    setActionPadEnvironment: function () {
        var apowner = null;
        var inspectorObject = null;
        var inspectorId = null;

        //has limeconnection, try to get decent values
        if(lbs.hasLimeConnection){
         
            //get inspector environment
            try {
                //got support for inspectorid
                apowner = lbs.common.getURLParameter("apowner");
                if(apowner !== null){
                    if(apowner == 'inspector'){
                        //its an AP, find out which
                        inspectorId = lbs.common.getURLParameter("apownerid");
                        if (inspectorId) {
                            inspectorObject = lbs.limeDataConnection.Inspectors.Lookup(inspectorId);
                        }
                    }else if (apowner = 'application'){
                        //its main AP
                        inspectorObject = null;
                    }
                }
                //no inspectorid support
                else{
                    inspectorObject = lbs.limeDataConnection.ActiveInspector;
                }

                //set values
                if(inspectorObject){
                    lbs.activeInspector = inspectorObject;
                    lbs.activeClass = inspectorObject.class.Name;
                }else{
                    lbs.activeInspector = null;
                    lbs.activeClass = 'index';
                }
            }
            catch (e) {
                lbs.log.warn("Could not determine inspector class, assuming index",e);
                lbs.activeClass = 'index';
            }
             
        }

        //override
        if (lbs.common.getURLParameter("ap") !== null) {
            this.activeClass = lbs.common.getURLParameter("ap");
        }

        //override sys-view
        if (lbs.common.getURLParameter('sv') !== null) {
            this.activeClass = 'system/view/{0}'.format(lbs.common.getURLParameter('sv'));
        }

        //get wrapper environment
        try {
            wrapperType = lbs.common.getURLParameter("type");
            if(wrapperType !== null){
                switch(wrapperType){
                case 'tab':
                  lbs.wrapperType = 'wrapperTab';
                  break;
                case 'inline':
                  lbs.wrapperType = 'wrapperInline';
                  break;
                default:
                    lbs.wrapperType = 'wrapperActionpad';
                }
            }
            else{
                lbs.wrapperType = 'wrapperActionpad';
            }
        }
        catch (e) {
            lbs.log.error("Could not determine wrapper type",e);
        }   

        lbs.log.info("Using wrapper type: " + lbs.wrapperType);
        lbs.log.info("Using view: " + lbs.activeClass);
    },

    /**
    Find database and server
    */
    setActiveDBandServer: function () {
       
        try {
            lbs.activeServer = lbs.limeDataConnection.Database.ActiveServerName;
            lbs.activeDatabase = lbs.limeDataConnection.Database.Name;
            lbs.log.info("Active Server, Database: " + lbs.activeServer + ", " + lbs.activeDatabase);
        }
        catch (e) {
            lbs.log.warn("Could not set active server and database");

        }        
    },

        /**
    Find database and server
    */
    setSkin: function () {
       
        try {
            // var skin = lbs.common.executeVba("ActionPadTools.GetSkin");
            var skin = lbs.hasLimeConnection ? lbs.limeDataConnection.application.Theme : 1;
            if(skin == 1){
                lbs.log.info("Silver skin is used");
                $("body").addClass("silver");
            }else if(skin == 2){
                lbs.log.info("Skin: I'm Britney bitch!");
                $("body").addClass("britney");
            }
        }
        catch (e) {
            lbs.log.warn("Could not set the skin");

        }        
    },
    
    /**
    * On click handlers. Executes events when clicked, such as running VBA or manipulating the DOM
    * 
    **/ 
    SetJqEvents: function () {

        

    
    },

    GlobalEventHandler: {
        OnKeydown: function(data, e) {
            // relaod AP (ctrl+shift+r)
            if(e.ctrlKey && e.shiftKey && e.which == 82){
                location.reload();
            }
            
            //open watch (ctrl+shift+w)
            else if(e.ctrlKey && e.shiftKey && e.which == 87){
                lbs.log.watch.show('WATCH');
            }

            //open log (ctrl+shift+l)
            else if(e.ctrlKey && e.shiftKey && e.which == 76){
                lbs.log.watch.show('LOG');
            }

            else{

                return true;
            }

        }
    },

    SetTouchEnabled : function(enable){
         $("html").attr("oncontextmenu","return {0}".format(enable ? 'true':'false'));
         $("html").toggleClass("notouch",!enable);
    },

    /**
    * On load handler. Executes events when the actionpad is loaded, such as running setting up the DOM, hideing things and setting up 
    * 
    **/
    ExecuteOnloadEvents: function () {
        
        //header icons
        $(".header-icon").each(function(){
            $(this).addClass("header-icon-container");
            $(this).css("background-image", "url('resources/"+lbs.activeClass+".png')");
            $(this).append('<img src="resources/'+lbs.activeClass+'.png" class="header-icon-invis" />');
        });

        // Clickable popovers close on click outside 
        $('body').on('click', function (e) {
            if ($(e.target).data('toggle') !== 'popover' && $(e.target).parents('.popover.in').length === 0) { 
                $('[data-toggle="popover"]').popover('hide');
            }
        });




        // FIX FOR CAROUSEL ANIMATION BUG
        $('.carousel').carousel().on('slide.bs.carousel', function (e) {
            var nextH = $(e.relatedTarget).height();
            $(this).find('.active.item').parent().animate({ height: Math.max(nextH,$(e.currentTarget).height()) }, 500);
        });
    },

    /**
    Apply knockout bindings to actionpad, note: no apps will be effected
    */
    applyContentBindings: function () {
        ko.punches.interpolationMarkup.enable();
        ko.punches.attributeInterpolationMarkup.enable();
        ko.punches.textFilter.enableForBinding('text');

        try {
            ko.applyBindings(lbs.vm, $("#content").get(0));
        } catch (e) {
            lbs.log.warn("Binding of data ActionPad failed! \n Displaying mapping attributes",e);
        }

        try {
            ko.applyBindings(lbs.vm, $("body").get(0));
        } catch (e) {
            lbs.log.warn("Binding of body bindings failed!",e);
        }
    },
    
    checkForUpdates: function(){
        //Check app version if debug is enabled
        if(lbs.debug && lbs.hasLimeConnection){
            // Check for app updates
            var lbsURL = "http://api.lime-bootstrap.com/";//limebootstrap.lundalogik.com/api/";
            $.each(lbs.apps, function(index, app){
                try{
                    var appName = app.name;

                    //Load remote version info
                    var remoteData = $.parseJSON(lbs.loader.loadFromExternalWebService(lbsURL+ "apps/" + appName + "/"));
                    if(remoteData){
                        if(remoteData.error){
                            lbs.log.warn("Failed to check remote version of app: '" + appName + "'. Reason: " + remoteData.error);
                            return;
                        }
                    }else{
                        lbs.log.warn("Failed to check remote version of app: '" + appName + "'");
                        return;
                    }
                    
                    var remoteVersionData = remoteData.info.versions;

                    //Load local version info
                    var localData = lbs.loader.loadLocalFileToString("apps/" + appName + "/app.json");
                    if(localData === ""){
                        lbs.log.warn("Failed to check local version of app: " + appName, e);
                        return;
                    }
                    var localVersionData = $.parseJSON(localData).versions;

                    
                    
                    

                    
                    //Extract the latest version number from the versions array of version objects
                    var currentRemoteVersion = _.max(remoteVersionData, function(versionInfo){ return versionInfo.version; }).version;
                    var currentLocalVersion = _.max(localVersionData, function(versionInfo){ return versionInfo.version; }).version;

                    //alert("local: " + currentLocalVersion + ", remote: " + currentRemoteVersion);

                    if( parseFloat(currentLocalVersion) < parseFloat(currentRemoteVersion) ) {
                        lbs.log.warn("App " + appName + " has an available update. Installed version: " + currentLocalVersion + ", Available version: " + currentRemoteVersion);
                        lbs.log.vm.addAppUpdate({appName:appName, remoteVersion:currentRemoteVersion, localVersion:currentLocalVersion});
                    }else{
                        lbs.log.info("App " + appName + " is up to date (version: " + currentLocalVersion + ")");
                    }

                }catch (e){
                    lbs.log.warn("Failed to check version of app: " + appName, e);
                }
            });
            
            try{
            //Check for LBS Update
                var remoteData = lbs.loader.loadFromExternalWebService(lbsURL+ "version");
                if(!remoteData){
                    lbs.log.warn("Failed to check remote version of LBS! ");
                    return;
                }


                
                var remoteVersionData = $.parseJSON(remoteData);
               
                var sortedVersions = remoteVersionData.versions.sort(function(ls, rs) {
                    return lbs.common.compareVersions(ls.version.toString(), rs.version.toString());
                });
                var localVersionData = $.parseJSON(lbs.loader.loadLocalFileToString("system/version.json"));

                var currentRemoteVersion = sortedVersions[0].version//_.max(remoteVersionData.versions, function(versionInfo){ return versionInfo.version; }).version;

                sortedVersions = localVersionData.versions.sort(function(ls, rs) {
                    return lbs.common.compareVersions(ls.version.toString(), rs.version.toString());
                });

                var currentLocalVersion = sortedVersions[0].version//_.max(localVersionData.versions, function(versionInfo){ return versionInfo.version; }).version;

                if(currentRemoteVersion.toString().split('.')[1] > currentLocalVersion.toString().split('.')[1]) {
                    lbs.log.vm.showUpgrade(true);
                    lbs.log.vm.showLBSVersion(true);
                    lbs.log.vm.remoteVersion(" v{0}-> v{1}".format(currentLocalVersion,currentRemoteVersion));
                    lbs.log.warn("Your LIME Bootstrap is out of date! v{0}->v{1}".format(currentLocalVersion,currentRemoteVersion));
                }else{
                    lbs.log.info("LBS version: v{0}".format(currentLocalVersion));
                }
            }catch(e){
                lbs.log.warn("Failed to check version of LBS! ",e);
            }
        
        }

    }
};

/**
ViewModel factory, extend this to add knockout functionality to actionpads
*/
lbs.vmFactory = function () {};

/**
Every this is loaded, run the awesomeness!
*/
$(document).ready(function () { window.lbs = lbs; lbs.setup();});

lbs.log = {

    /**
    active viewModel instance
    */
    vm: null,

    verboseLevelEnum: {
        debug: 3,
        info: 2,
        warn: 1,
        error: 0
    },

    /**
    Setup the lof and create view model
    */
    setup: function (enabled) {        
        //loadViewScript
        lbs.loader.loadView('system/view/debug',$("#debug"));
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
        debug: function (msg) {            
            try { console.debug(msg); } catch (e) { }
        },
        info: function (msg) {
            try { console.info(msg); } catch (e) { }
        },
        warn: function (msg) {
            try { console.warn(msg); } catch (e) { }
        },
        error: function (msg) {            
            lbs.error = true;
            lbs.log.vm.errorFound(true);
            lbs.SetTouchEnabled(true);
            try { console.error(msg) ;} catch (e) { }
        },
    },    
    /**
    Log entry function for app printing
    */
    "log": function () {
        lbs.log.logToConsole.debug(arguments);
        for (var i = 0; i < arguments.length; i++) {
            if (Array.isArray(arguments[i])) {
                arguments[i] = ko.toJSON(arguments[i], null, 0);
            }
            else if (typeof arguments[i] === 'object') {
                arguments[i] = ko.toJSON(arguments[i], undefined, 4);
            }
            else {
                arguments[i] = arguments[i].toString();
            }
            lbs.log.logToDom('LOG', lbs.common.nl2brIndent(arguments[i]));
        }

    },

    "debug": function (msg) {                
        if (lbs.verboseLevel >= lbs.log.verboseLevelEnum.debug) {
            lbs.log.logToDom('DEBUG', lbs.common.nl2brIndent(msg));
            lbs.log.logToConsole.debug((msg));
        }
    },

    /**
    Log entry function for info
    */
    "info": function (msg) {        
        if (lbs.verboseLevel >= lbs.log.verboseLevelEnum.info) {
            lbs.log.logToDom('INFO', lbs.common.nl2brIndent(msg));
            lbs.log.logToConsole.info((msg));
        }
    },

    /**
    Log entry function for warn
    */
    "warn": function (msg, e) {        
        if (lbs.verboseLevel >= lbs.log.verboseLevelEnum.warn) {
            if (e) { lbs.log.exception(e, 'WARN'); }
            lbs.log.logToDom('WARN', lbs.common.nl2brIndent(msg));
            lbs.log.logToConsole.warn((msg));
        }
    },

    /**
    Log entry function for error
    */
    "error": function (msg, e) {
        if(e){lbs.log.exception(e);}
        lbs.log.logToDom('ERROR', lbs.common.nl2brIndent(msg));
        lbs.log.logToConsole.error((msg));
    },
    /**
    Log entry function for exception
    */
    "exception": function (e, level) {        
        if (lbs.verboseLevel >= lbs.log.verboseLevelEnum.error) {
            lbs.log.logToDom('ERROR', lbs.common.nl2brIndent(e.toString()));
            lbs.log.logToConsole.error(e.toString());
        }
    },

    /**
    Log to LIME Pro infolog tab.
    type should be either 'info', 'warning' or 'error'.
    */
    logToInfolog: function (type, msg) {
        try{
            if (type !== 'info' && type !== 'warning' && type !== 'error') {
                type = 'info';
            }
            if(typeof msg === 'object'){
                msg = JSON.stringify(msg);
            }
            else if(typeof msg !== 'string'){
                msg = msg.toString();
            }
            lbs.common.executeVba('LBSHelper.logToInfolog,' + type + ',' + msg.replace(/,/g, '!@!').replace(/'/g, '%&%'));
        }
        catch(err) {
            lbs.common.executeVba('LBSHelper.logToInfolog,' + "error" + ',' + err.toString().replace(/,/g, '!@!').replace(/'/g, '%&%'));
        }

    }
};

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
    };

    this.enableConsole = function () {
        this.delayedLoggingEnabled = false;
        this.pushDelayedLogItems();
    };
    // different types of logs
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
            case 'LOG':
                ico = 'fa fa-paw';
                rowclass = 'alert alert-success';
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
        }
    };
};



lbs.log.watch = {

    show : function(state){
        var wvm = new lbs.log.watch.vmFactory();
        if(state !== ''){wvm.initState = state;}
        var dialog = showModalDialog("lbs.html?sv=watch&&type=tab",wvm,"status:false;dialogWidth:900px;dialogHeight:820px;resizable:Yes");
    },

    setup : function(){
        //only applicable for watch view
        if(lbs.activeClass != 'system/view/watch'){
            return;
        }

        if(window.dialogArguments){

            lbs.log.vm.enabled(false);
            lbs.SetTouchEnabled(true);

            //fetch vm from args
            var args = window.dialogArguments;

            //recrate vm in new scope. Some properties and knockout stuff
            //may not survive the modal reference
            var wvm = new lbs.log.watch.vmFactory();
            wvm.vms = args.vms;
            wvm.logItems = args.logItems;
            wvm.initState = args.initState;
            wvm.dom = args.dom;

            //load to global vm
            vm = lbs.common.mergeOptions(lbs.vm, wvm || {}, true);

            //set active vm
            wvm.selectState(wvm.initState);
            wvm.selectVm(wvm.vms[0]);

            //add trigger tot close watch 27 = enter. Ctrl+f will focus the search input
            var map = { 70: false, 27: false, 17: false };
            $('body').keydown(function (e) {
                if (e.keyCode in map) {
                    map[e.keyCode] = true;
                    if (map[70] && map[17]) {
                        $('#searchValue').focus();                        
                        map[70] = false;
                        map[17] = false;
                    }
                    if (map[27]) {
                        window.close();
                        map[27] = false;
                    }
                }
            }).keyup(function (e) {                
                if (e.keyCode in map) {
                    map[e.keyCode] = false;
                }
            });
        }
    },

    //syntax highligt
    sh : function(){
        $('pre code').each(function(i, e) {hljs.highlightBlock(e);});
    },

    vmFactory : function(){
        var self = this;

        //data holders
        self.selectedVm = ko.observable({'name':'',vm:{}});
        self.vms = [];
        self.logItems = [];
        self.selectedState = ko.observable("LOG");
        self.states = ['LOG','WATCH','DOM'];
        self.initState = 'LOG';
        self.searchValue = ko.observable().extend({ throttle: 50 });
        self.logView = ko.observable("SHOW ALL");
        self.logStatus = ['LOG'];
        self.watchSelected = ko.observable(false);
        
    
        //var html is used to save main html
        var html = "";
        self.counter = ko.observable(0);
        self.order = ko.observable(0);

        //format vm as string. clears var html
        self.prettyVm = ko.computed(function () {
            html = "";
            self.searchValue("");
            return JSON.stringify(self.selectedVm().vm, null, 2);            
        });

        $('body').keypress(function (e) {            
            if (e.which == 13) {
                self.goToNext();                
            }
        });

        self.select = function(){
            self.watchSelected(true);
            $('#vmDataText').height($('#vmDataText').prop('scrollHeight'));
            
        }
        self.deSelect = function(){
            self.watchSelected(false);
        }
        self.copyWatch = function(){
            window.clipboardData.setData('Text', $('#vmDataText').text());
        }
        //search a VM        
        self.searchValue.subscribe(function (searchString) {            
            var lowerString = searchString.toLowerCase();
            var newPrettyVm = null;
            self.order(0);
            //checks if the lowerString is bigger than 1 to make the search less demanding
            if (lowerString.length > 1) {
                var re = new RegExp(lowerString, "g");
                var tempHtml = $('#vmData').html();                
                if (html === "") {
                    html = tempHtml;
                }
                else {
                    $('#vmData').html(html);
                }                               
                self.counter(self.replaceText($('#vmData'), re, lowerString, searchString));
                self.goToNext();
            }
            else {
                self.counter(0);
                if (html == "") {
                    $('#vmData').html($('#vmData').html());
                }
                else {
                    $('#vmData').html(html);
                }
            }
        });

        //used for the scroll
        self.goToNext = function () {
            //checks in which order scroll will work
            if ((self.order() < self.counter() && self.counter() > 0)) {  
                
                var target = '#' + self.order();
                if ($(target).length > 0) {
                    $('#watchContainer').animate({
                        scrollTop: $(target).offset().top + $('#watchContainer').scrollTop() - 200
                    }, 200);

                    var old = '#' + (self.order() - 1).toString(16);
                    if ($(old).hasClass("highlight-grey")) {
                        $(old).removeClass('highlight-grey').addClass('highlight-yellow');
                    }

                    $(target).addClass('highlight-grey');
                    self.order(self.order() + 1);
                }
            }
            else {
                self.order(0);
                self.goToNext();
            }
        }        
        //insert highlight on search string
        self.replaceText = function (html, reg, lowString, orgString) {            
            var i = 0;            
            $(html).find('span').each(function () {
                if (($(this).hasClass("hljs-string") || $(this).hasClass("hljs-number")) ||$(this).hasClass("hljs-attribute") ) {                                                            
                    if ($(this).text().toLowerCase().indexOf(lowString) > -1) {
                        var text = $(this).text().toLowerCase().replace(reg, '<span id=' + i + ' class="highlight-yellow">' + orgString + '</span>');
                        i = i +1;
                        $(this).html(text);
                    }
                }                
            });
            return i;
        }

     
        //select vm to show
        self.selectVm = function(vm){
            self.selectedVm(vm);
            lbs.log.watch.sh();
        };

        self.selectState = function(state){
            self.selectedState(state);
        };

        self.copyWatch = function(){
            window.clipboardData.setData('Text', $('#vmDataText').text());
        }

        // selected log status
        self.selectedLogStatus = function (view) {            
            self.logView(view);
        };

        //get vm from apps
        var map = $.map(lbs.apps,function(v,i){
            return {name : v.name, vm : v.vm || {}};
        });

        //add AP VM
        self.vms.push({name : 'Actionpad', vm : lbs.vm});
        self.vms = self.vms.concat(map);

        //get logposts        
        self.logItems = ko.toJS(lbs.log.vm.logItems);        
        self.dom = $('#wrapper').get()[0].outerHTML;
    }
};
lbs.loader = {

    /**
    Attrbutes
    */
    systemLibPath: "system/",
    scripts: [],
    styles: [],
    libs: [],

    /**
    Add resources from config to load-lists
    */
    "pushResources": function (data, appPath) {
        var path;

        if (typeof data == 'undefined') {
            return;
        }
        $.each(data.scripts, function (i) {
            path = appPath == '/' ? lbs.loader.systemLibPath + 'js/' : appPath;
            lbs.loader.scripts.push(path + data.scripts[i]);
        });

        $.each(data.libs, function (i) {
            path = lbs.loader.systemLibPath + 'js/';
            lbs.loader.libs.push(path + data.libs[i]);
        });

        $.each(data.styles, function (i) {
            path = appPath == '/' ? lbs.loader.systemLibPath + 'css/' : appPath;
            lbs.loader.styles.push(path + data.styles[i]);
        });
    },

    /**
    Process load-list and fetch all resources
    */
    "loadResources": function () {

        lbs.loader.scripts = lbs.loader.scripts.filter(this.uniqueFilter);
        lbs.loader.styles = lbs.loader.styles.filter(this.uniqueFilter);
        lbs.loader.libs = lbs.loader.libs.filter(this.uniqueFilter);

        lbs.log.debug("Scripts to load:" + lbs.loader.scripts);
        lbs.log.debug("Styles to load: " + lbs.loader.styles);
        lbs.log.debug("Libs to load: " + lbs.loader.libs);

        $.each(lbs.loader.libs, function (i) {
            lbs.loader.loadScript(lbs.loader.libs[i]);
        });

        $.each(lbs.loader.scripts, function (i) {
            lbs.loader.loadScript(lbs.loader.scripts[i]);
        });

        $.each(lbs.loader.styles, function (i) {
            lbs.loader.loadStyle(lbs.loader.styles[i]);
        });

        

    },

    /**
    Fetch and run a script from disk
    */
    "loadScript": function (filename) {

        
         try {
            $.getScript( filename )

              .done(function( script, textStatus ) {
                    lbs.log.info('Script "' + filename + '" loaded successfully');
              })
              .fail(function( jqxhr, settings, exception ) {
                    throw exception;
                    //throw new Error('Script "' + filename + '" could not be loaded');
            });

            retval = true;

        } catch (e) {
           try{
                lbs.log.info('Script "' + filename + '" could not be loaded, using fallback loading through LWS');
                var s = "";
                s = lbs.common.executeVba("LBSHelper.loadHTTPResource," + filename);
                if (s && s !== "") {
                    with(window) {
                        window.eval(s);
                    }
                    lbs.log.info('Script "' + filename + '" loaded successfully');
                    retval = true;
                } else {
                    throw new Error('Script "' + filename + '" returned empty');
                }
            }catch(e2){
                lbs.log.error('Script "' + filename + '" could not be loaded though browser',e);
                lbs.log.error('Script "' + filename + '" could not be loaded through LWS',e2);
                retval = false;
            }
        }

        return retval;

    },

    /**
    Fetch and load a style from disk
    */
    "loadStyle": function (val) {
        $('<link/>', { rel: 'stylesheet', type: 'text/css', href: val }).appendTo('head');
    },

    /**
    Fetch template from disk and insert into selected element
    */
    "loadView": function (file, element) {
        try {
            file = file + ".html";
            element.load(file, function (response, status, xhr) {
                if (response.indexOf('<script') != -1) {
                    lbs.log.error('View "' + file + '" containes scripts, it is not allowed to be loaded');
                    //replace element with funnt image
                    element.html('<img src="' + lbs.loader.systemLibPath + 'img/YouDidntSayTheMagicWord.gif" />');
                }
                else if (status == "error") {
                    lbs.log.error('View "' + file + '" could not be loaded',e);
                } else {
                    lbs.log.info('View "' + file + '" loaded successfully');
                }
            });
        } catch (e) {
            lbs.log.warn("Resource could not be found. If using Chrome or IE11, make sure --file-access-from-file is enabled");
            lbs.log.warn('View "' + file + '" could not be loaded, using fallback loading through LWS');
            var s = "";
            s = lbs.common.executeVba("LBSHelper.loadHTTPResource," + file);
            if (s && s !== "") {
                element.html(s);
                lbs.log.info('View "' + file + '" loaded successfully');
            } else {
                lbs.log.error('View "' + file + '" could not be loaded',e);
            }
        }
    },

    /**
    Load all datasources in set to the selected viewmodel
    */
    loadDataSources: function (vm, dataSources, overrideExisting) {

         //check connection
        if(!lbs.hasLimeConnection){
            lbs.log.warn('No connecton, datasources will not be loaded');
            return vm;
        }

        var filterRemoveRelated = function (item) {return (item.type != 'relatedRecord')};
        var filterRemoveInspector = function (item) {return (item.type != 'activeInspector')};
        var filterGetInspector = function (item) {return (item.type === 'activeInspector')};
        var filterGetRelated = function (item) {return (item.type === 'relatedRecord')};
        var relatedRecordExists = dataSources.filter(filterRemoveRelated).length != dataSources.length;
        var activeInspectorExists = dataSources.filter(filterRemoveInspector).length != dataSources.length;

        //check for activeInspector if using relatedRecord
        if(relatedRecordExists && !activeInspectorExists){
            //remove related record
            dataSources = dataSources.filter(filterRemoveRelated);
            lbs.log.warn("Failed to load datasource 'RelatedRecord', activeInspector is not loaded");
        }
        // add properties to inspector source
        else if(relatedRecordExists){
            
            //get inspector source
            var activeInspector = dataSources.filter(filterGetInspector)[0];
            //set related sources to inspector source
            activeInspector.relatedRecords = dataSources.filter(filterGetRelated);
            //remove previous sources collection
            dataSources = dataSources.filter(filterRemoveRelated).filter(filterRemoveInspector);
            //add new source to collection
            dataSources.push(activeInspector);
        }

        //load soruces
        $.each(dataSources, function (key, source) {
            vm = lbs.loader.loadDataSource(vm, source, overrideExisting);
        });
        return vm;
    },


    /**
    Load a datasource to the selected viewmodel
    */
    loadDataSource: function (vm, dataSource, overrideExisting) {
        var data = {};
        
        lbs.log.debug('Loading data source: ' + dataSource.type + ':' + dataSource.source);
        var timerStart = moment();
        try {
            switch (dataSource.type) {
                case 'activeInspector':
                    try {
                        //check lime
                        if(!lbs.activeInspector){
                            lbs.log.warn('No activeinspecor, datasource will not be loaded');
                            return vm;
                        }

                        data = lbs.loader.controlsToJSON(lbs.activeInspector.Controls,dataSource.alias);
                        
                        //find data without alias
                        dataNode = data[Object.keys(data)[0]];
                        //check for related records, source is fieldname is this instance
                        if(dataSource.hasOwnProperty('relatedRecords')){
                            $.each(dataSource.relatedRecords,function(i, rs){
                                if(dataNode.hasOwnProperty(rs.source)){
                                   
                                    //fetch class and id from inspector JSON object
                                    rs['class'] = dataNode[rs.source]['class'];
                                    rs['idrecord'] = dataNode[rs.source]['value'];

                                    //add data as subkey to inspector relation if no alias is specified, otherwise as its own node
                                    vmToAdd = rs.alias ? vm : dataNode;

                                    //set alias to fieldname if does not exist
                                    rs.alias = rs.alias ? rs.alias : rs.source;
                                    
                                    //call loadData for the related record
                                    lbs.loader.loadDataSource(vmToAdd,rs,true);

                                }else{
                                    lbs.log.warn("Failed to load datasource 'RelatedRecord', field '{0}' does not exist".format(rs.source));
                                }
                            }); 
                        }
                    } catch (e) {
                        lbs.log.warn("Failed to load datasource: " + dataSource.type + ':' + dataSource.source,e);
                    }
                    break;
                case 'xml':
                 
                    //check for ownerIdParam
                    var autoParams = [];
                    if(dataSource.hasOwnProperty('PassInspectorParam') && dataSource.PassInspectorParam && lbs.activeInspector){
                        autoParams.push(lbs.activeInspector.ID);
                    }

                    data = lbs.common.executeVba(dataSource.source, autoParams);
                    
                    if (data !== null) {
                        data = lbs.loader.xmlToJSON(data, dataSource.alias);
                    } else {
                        lbs.log.warn("Failed to load datasource: " + dataSource.type + ':' + dataSource.source);
                    }
                    break;
                case 'record':
                    
                    //check for ownerIdParam
                    var autoParams = [];
                    if(dataSource.hasOwnProperty('PassInspectorParam') && dataSource.PassInspectorParam && lbs.activeInspector){
                        autoParams.push(lbs.activeInspector.ID);
                    }

                    data = lbs.common.executeVba(dataSource.source, autoParams);

                    if (data !== null) {
                        data = lbs.loader.recordToJSON(data,dataSource.alias);
                    } else {
                        lbs.log.warn("Failed to load datasource: " + dataSource.type + ':' + dataSource.source);
                    }
                    break;
                case 'records':
                    //check for ownerIdParam
                    var autoParams = [];
                    if(dataSource.hasOwnProperty('PassInspectorParam') && dataSource.PassInspectorParam && lbs.activeInspector){
                        autoParams.push(lbs.activeInspector.ID);
                    }

                    data = lbs.common.executeVba(dataSource.source, autoParams);

                    if (data !== null) {
                        data = lbs.loader.recordsToJSON(data,dataSource.alias);
                    } else {
                        lbs.log.warn("Failed to load datasource: " + dataSource.type + ':' + dataSource.source);
                    }
                    break;
                case 'localization':
                    var k = lbs.common.executeVba("Localize.getDictionaryKeys");
                    var d = lbs.common.executeVba("Localize.getDictionary");
                    var parsedData = {};
                    var collecton = {};

                    //return empty object if missing or no language support
                    if (!d || !k) {
                        lbs.log.warn("Localization dictionary could not be loaded");
                    } else {
                        parsedData = lbs.loader.dictionaryToJSON(k, d,'loc');

                        $.each(parsedData['loc'], function (key, value) {
                            keysplit = key.split("$$");
                            collecton[keysplit[0]] = collecton[keysplit[0]] || {};
                            collecton[keysplit[0]][keysplit[1]] = value;
                        });

                        data.localize = collecton;
                    }
                    break;
                case 'storedProcedure':
                    data = lbs.common.executeVba("lbsHelper.loadXmlFromStoredProcedure, {0}".format(dataSource.source));
                    if (data !== null) {
                        data = lbs.loader.xmlToJSON(data,dataSource.alias);
                    } else {
                        lbs.log.warn("Failed to load datasource: " + dataSource.type + ':' + dataSource.source);
                    }
                    break;
                 case 'HTTPGetXml':
                    data = lbs.loader.loadFromExternalWebService(dataSource.source);
                    if (data !== null) {
                        data = lbs.loader.xmlToJSON(data,dataSource.alias);
                    } else {
                        lbs.log.warn("Failed to load datasource: " + dataSource.type + ':' + dataSource.source);
                    }
                    break;
				case 'SOAPGetXml':
                    data = lbs.common.executeVba('LBSHelper.loadFromSOAP,' + dataSource.source.url + ',' + dataSource.source.action + ',' + dataSource.source.xml);
                    if (data !== null) {
                        data = lbs.loader.xmlToJSON(data,dataSource.alias);
                    } else {
                        lbs.log.warn("Failed to load datasource: " + dataSource.type + ':' + dataSource.source);
                    }
                    break;
                case 'relatedRecord':
                     try {
                        var autoParams = [];
                        autoParams.push(dataSource['class']);;
                        autoParams.push(dataSource['idrecord'])
                        if(dataSource.hasOwnProperty('view')){
                            autoParams.push(dataSource['view']);
                        }

                        // verify that record related record exists
                        if(dataSource['idrecord']){
                            record = lbs.common.executeVba("lbsHelper.loadRelatedRecord", autoParams);
                            data = lbs.loader.recordToJSON(record, dataSource.alias);
                        }else{
                            data = lbs.loader.emptyAliasJSON(dataSource.alias);
                            lbs.log.debug("RelatedRecord load is canceled, idrecord is NULL: " + dataSource.type + ':' + dataSource.source);
                        }
                    } catch (e) {
                        lbs.log.warn("Failed to load datasource: " + dataSource.type + ':' + dataSource.source,e);
                    }
                    break;
                case 'AsyncPost':
                    var params = dataSource.parameters || {};
                    $.support.cors = true;
                    data = {};
                    data[dataSource.alias] = $.ajax({
                        contentType: 'application/json',
                        data: JSON.stringify(params),
                        dataType: 'json',
                        type: 'POST',
                        url: dataSource.url,
                        crossDomain: true
                    });
                    break;
                case 'activeUser':
                    var c = lbs.common.executeVba("lbsHelper.getActiveUser");
                    var json = JSON.parse(c);

                    data.ActiveUser = json.ActiveUser;
                    break;
            }

            //merge options into the viewModel
            vm = lbs.common.mergeOptions(vm, data || {}, overrideExisting);
        } catch (e) {
            lbs.log.warn("Failed to load datasource: " + dataSource.type + ':' + dataSource.source,e);
        }
        var timerFinished = moment();
        
        lbs.log.warn("Time to load data source " + JSON.stringify(dataSource) + " : " + timerFinished.diff(timerStart,"milliseconds") + "ms")
        return vm;
    },


     /**
    Process params from external config
    */
    "loadExternalConfig": function (defaulConfig,externalConfig,classname) {
        var entry = {};

        //check for config for active class
        if(externalConfig.hasOwnProperty(classname)){
            entry = externalConfig[classname];

            //get datasorces if exists
            if(entry.hasOwnProperty('dataSources')){
                defaulConfig.dataSources = entry['dataSources'];
            }

            //get autorefresh if exists
            if(entry.hasOwnProperty('autorefresh')){
                defaulConfig.autorefresh = entry['autorefresh'];
            }
        }
           
        return defaulConfig;

    },

    "loadFromExternalWebService" : function(url){
        return lbs.common.executeVba("lbsHelper.loadFromREST," + url  );
    },

    "loadLocalFileToString" : function(path){
        return lbs.common.executeVba("lbsHelper.loadHTTPResource," + path  );
    },

    "saveLocalFile" : function(path, text) {
        lbs.common.executeVba("lbsHelper.saveFile," + path, [text]);
    },

    /**
    Only return unique values
    */
    "uniqueFilter": function (e, i, arr) {
        return arr.lastIndexOf(e) === i;
    },


    /**
    Transform a VBA dictionary to JSON.
    A collection with keys is needed as the keys method is not transported to JS
    */
    "dictionaryToJSON": function (keys, dic, alias) {
        var key, value;
        var json = {};
        var r = {};

        var alias = alias ? alias : 'dictionarySource';

        for (var i = 1; i <= dic.count; i++) {
            key = keys(i);
            value = dic.item(key);
            json[key] = value;
        }

        r[alias] = json;
        return r;
    },

     /**
    Transform a VBA records to JSON
    */
    "recordsToJSON": function (rc, alias) {

        var json = {};

        if(rc){
            var className = rc['Class']['Name'];
            var nbrOfRecords = rc.Count;
            var alias = alias ? alias : className;
            

            json[alias] = {};
            json[alias]['records'] = [];
            for (var i = 1; i <= nbrOfRecords; i++) {
                var record = lbs.loader.recordToJSON(rc.Item(i),'r');
                json[alias]['records'].push(record.r);

            }
        }

        return json;
    },

    /**
    Transform a VBA record to JSON
    */
    "recordToJSON": function (record, alias) {
        
        var json = {};

        if(record){
            var nbrOfFields = record.Fields.Count;
            var className = record['Class']['Name'];
            var attr;
            var alias = alias ? alias : className;
            json[alias] = {};

            for (var i = 1; i <= nbrOfFields; i++) {
                attr = record.Fields(i).Name;
                json[alias][attr] = {};
                json[alias][attr]["text"] = record.Text(i);
            
                if(typeof record.Value(i) != 'unknown'){
                    json[alias][attr]['value'] = record.Value(i);
                }
                if (record.Fields(i).Type == 16) { //Relation
                    json[alias][attr]['class'] = record.Fields(i).LinkedField['Class']['Name'];
                }

                //check if optionkey support
                if(lbs.limeVersion.comparable > lbs.common.parseVersion('10.8').comparable){
                    if (record.Fields(i).Type == (19 || 18)) { //Option or Set
                        json[alias][attr]['key'] = record.GetOptionKey(i);
                    }
                }

            }
        }
        return json;
    },

    /**
    Transform an empty alias to JSON
    */
    "emptyAliasJSON": function (alias) {
        var json = {};
        json[alias] = {};
        return json;
    },

    /**
    Transform controls on activeInspector to JSON
    */
    "controlsToJSON": function (controls, alias) {
        var nbrOfControls = controls.Count;
        var className = controls['Class']['Name'];
        var attr;
        var json = {};
        var alias = alias ? alias : className;
        json[alias] = {};

        for (var i = 1; i <= nbrOfControls; i++) {
            attr = controls(i).Field.Name;
            json[alias][attr] = {};
            json[alias][attr]["text"] = controls(i).Text;
            json[alias][attr]['value'] = controls(i).Value;
            if (controls(i).Field.Type == 16) { //Relation
                json[alias][attr]['class'] = controls(i).Field.LinkedField['Class']['Name'];
            }

            //check if optionkey support
            if(lbs.limeVersion.comparable > lbs.common.parseVersion('10.8').comparable){

                if (controls(i).Field.Type == (19 || 18)) { //Option or Set
                    json[alias][attr]['key'] = controls(i).OptionKey;
                }
            }
        }
      
        return json;

    },

     /**
    Transform XML to JSON
    */
    "xmlToJSON": function (xml, alias) {
        var json = {};
        var alias = alias ? alias : 'xmlSource';

        json[alias] = $.parseJSON(xml2json($.parseXML(xml), ""));

        return json;

    },

    "createUpdateTranslation" : function(owner, code, text, culture) {
        return lbs.common.executeVba("lbsHelper.CreateUpdateTranslation,", [owner, code, text, culture]);
    }

};

lbs.apploader = {

    /**
    holds a reference to all factory methods
    */
    appFactory : {},

    /**
    Register app
    */
    register: function (name,func) {
        this.appFactory[name] = func;
        lbs.log.debug("App '{0}' has been succesfully registered".format(name));
    },

    /**
    load all app configurations
    */
    identifyApps: function () {
        var path;
        var raw;
        var htmlNode;
        var config;
        var instanceConfig;
        var binding;
        var appName;
        var instance;
        var guid;

        $("[data-app]").each(function () {
            try {

                //try to parse input to app from view
                try {
                    eval('binding = ' + $(this).attr("data-app"));
                    appName = binding.app;
                    instanceConfig = binding.config;
                } catch (e1) {
                    e1.message = "App definition invalid\n" + e1.message;
                    throw e1;
                }

                //set basic properties
                path = "apps/" + appName + "/";
                htmlNode = $(this);
                guid = lbs.common.generateGuid();

                //load app
                if (!lbs.apploader.appFactory[appName]){
                    if (!lbs.loader.loadScript(path + 'app.js')) {
                        throw new Error("Could not find app " + appName);
                    }
                }

                //create an instance
                instance = new lbs.apploader.appFactory[appName]();

                //merge instance with app config
                if (instanceConfig) {
                    // New config format
                    if(typeof(instance.config) == 'function'){
                        instance.config = new instance.config(instanceConfig)    ;
                    }else{ //old format
                        instance.config = lbs.common.mergeOptions( instance.config, instanceConfig, true);
                    }
                }
                
                //push resources
                lbs.loader.pushResources(instance.config.resources, path);

                //add app instance to lbs
                lbs.apps[guid] = lbs.apps[guid] || {};
                lbs.apps[guid].name = appName;
                lbs.apps[guid].path = path;
                lbs.apps[guid].node = htmlNode;
                lbs.apps[guid].instance = instance;


            } catch (e) {
                lbs.log.warn("Could not load app", e);
            }
        });

        return this;
    },
        buildCarousel : function(){        
        
        var ol;
        var li;
        var binding;
        var type;
        var height;     

        $("[data-carousel]").each(function (i1,d1) {
            try{
                try{
                   
                    eval('binding = ' + $(this).attr("data-carousel"));
                    height = binding.height;
                    type = binding.type;
                    $(this).height(height);

                    $(this).attr({
                        'id':'carousel-' + i1,
                        'data-ride': 'carousel',
                        'data-interval': '0'
                    });                    

                    $(this).addClass('carousel slide lime-carousel'); 

                    $(this).children().each(function(){
                        $(this).addClass("carousel-item");
                    });

                    $(this).append("<ol></ol>");
                    ol = $(this).find("ol");

                    $(this).append(lbs.common.carouselRight, lbs.common.carouselLeft);

                    $(this).find("a").attr("data-target", "#carousel-" + i1);

                    $(this).children('.carousel-item').wrapAll("<div class='carousel-inner'></div>");  
                    
                    ol.addClass("carousel-indicators");
                    $(this).children('.carousel-inner').children('.carousel-item').each(function(i2,d2){                        
                        $(this).addClass('item');
                        ol.append("<li></li>");
                        li = ol.find("li").last();
                        if(i2 === 0){                                                        
                            $(this).addClass('active');
                            li.addClass("active black");
                        }
                        li.attr({
                            "data-slide-to" : i2,
                            "data-target" : '#carousel-' + i1
                        });            
                        li.addClass("black");
                    });


                }
                catch (r){
                    lbs.log.warn("Carousel definition is not valid",r);
                }                
            }     
            catch (e){
                lbs.log.warn("Could not load carousel",e);
            }       
        });
    },

    /**
    Copy global viewmodel to app and add the datasources for the app
    */
    "buildApps": function () {
        var path;
        var appName;
        var htmlNode;

        $.each(lbs.apps, function (key, app) {

            //to-be viewmodel
            var vm = {};
            vm.localize = lbs.vm.localize;

            //load data
            vm = lbs.loader.loadDataSources(vm, app.instance.config.dataSources);
            lbs.apps[key].vm = vm;

        });

    },

    /**
    Initialize the app
    Make variables observable
    Apply bindings
    */
    "initializeApps": function () {
        var path;
        var appName;
        var htmlNode;

        $.each(lbs.apps, function (key, app) {

            appName = app.name;
            path = app.path;
            htmlNode = app.node;
            config = app.config;
            vm = lbs.apps[key].vm;

            //load view
            lbs.loader.loadView(path + 'app', htmlNode);

            //run initialize
            try {
                vm = app.instance.initialize(htmlNode ,vm);
                lbs.apps[key].vm = vm;
            } catch (e) {
                lbs.apps[key].vm = vm;
                lbs.log.error("Could not intialize app: " + appName,e);
            }

            //apply bindings
            try {
                ko.applyBindings(vm, htmlNode.get(0));
            } catch (e) {
                lbs.log.warn(lbs.common.nl2br("Binding of data to view failed for app: " + appName + "\n Displaying mapping attributes"));
                lbs.log.exception(e);
            }

        });

    }

};


/**
--------------------------------------------------------
Common functions used in lbs
--------------------------------------------------------
*/
var lbs = lbs || {};
lbs.common = {

    /**
    Fetch a random funny error text
    */
    "getErrorText": function () {
        var nbr = Math.floor((Math.random() * 5) + 1);
        switch (nbr) {
            case 1:
                return "Oh snap!";
            case 2:
                return "Oh no!";
            case 3:
                return "God damit!";
            case 4:
                return "Holy guacamole!";
            case 5:
                return "Arghhhh!";
        }
    },

    /**
    Get icon html
    */
    iconTemplate : "<i class='fa fa-fw {0}'></i>",

    /**
    URLencode sensitive strings
    */
    "escapeHtml": function (unsafe) {
        return unsafe
             .replace(/&/g, "&amp;")
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;")
             .replace(/"/g, "&quot;")
             .replace(/'/g, "&#039;");
    },
    carouselRight : "<a class='right carousel-control' data-slide='next' role='button'><i class='fa fa-arrow-right'></i></a>",
    carouselLeft : "<a class='left carousel-control' data-slide='prev' role='button'><i class='fa fa-arrow-left'></i> </a>",
    /**
    Create a limelink from class, id, server and database properties
    */
    "createLimeLink": function (limeClass, limeId) {
        return "limecrm:"+limeClass+"."+lbs.activeDatabase + "." + lbs.activeServer + "?" + limeId;
    },

    /**
    Fetch the url parameters from the GET-URL
    */
    "getURLParameter": function (name) {
        var param =  decodeURI(
            (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search) || [, null])[1]
        );
        return (param == 'null' ? null : param);
    },

    /**
    * Helperfunction to run VBA functions from JS
    */
    "executeVba": function (inString, params) {

        try {
            

            if(lbs.hasLimeConnection){
                // lbs.log.debug("Trying to execute VBA:" + inString);
            }else{
                lbs.log.warn("No lime connection, will not exec VBA call:" + inString);
                return null;
            }

            var vbaline;

            var inArgs = inString.split(',');
            if(params){
                inArgs = inArgs.concat(params);
            }

            if (inArgs.length > 1) {

                var args = "";
                vbaline = "lbs.limeDataConnection.Run('" + inArgs[0] + "', ";
                for (var i = 1; i < inArgs.length; i++) {
                    
                    //cast as string
                    inArgs[i] = String(inArgs[i]);

                    while (inArgs[i].charAt(0) === ' ') {
                        inArgs[i] = inArgs[i].substr(1);
                    }
                    args += "'" + inArgs[i] + "'";
                    if (i != inArgs.length - 1)
                        args += ",";
                }
                vbaline += args + ")";
                
                lbs.log.debug("Trying to execute VBA:" + vbaline);
                return eval(vbaline);
            }
            else {
                vbaline = "lbs.limeDataConnection.Run('"+arguments[0]+"')";
                lbs.log.debug("Trying to execute VBA:" + vbaline);
                return lbs.limeDataConnection.Run(arguments[0]);
            }

        } catch (e) {
            lbs.log.error("Failed to execute VBA:" + vbaline, e);
            return null;
        }
    },

    /**
    replace newline with br
    */
    nl2br: function (input) {
        return input.replace(/\n/g, '<br />');
    },

    /**
    replace newline with br + tab
    */
    nl2brIndent: function (input) {
        return input.replace(/\n/g, '<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
    },
    
 
    /**
    Add newline if braket
    */
    brak2br: function (input) {
        return input.replace(/{/g, '<br />').replace(/}/g, '<br />');
    },

    /**
    Add attributes from one JS objekt to another. Duplicates are discarded.
    */
    mergeOptions: function (obj1, obj2, overrideExisting) {
        $.each(obj2, function (key, value) {
            if(!value){
                //dont override with empty
            }
            else if (!obj1[key]) {
                obj1[key] = value;
            }
            else if (obj1[key] instanceof Array && value instanceof Array) {
                obj1[key] = obj1[key].concat(value);
            }
            else {
                if(overrideExisting){
                    obj1[key] = value;
                    lbs.log.debug("Key '{0}' in view model was overriden by dataload".format(key));
                }else{
                    lbs.log.warn("Key '{0}' was not added to the view model. Key already exists".format(key));
                }
            }
        });
        return obj1;
    },

    /**
    Generate GUID
    */
    generateGuid: function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },

    checkGroup : function(groups, userGroups){
        return userGroups.map(function(f){return f.Name;}).filter(function(n) {return groups.indexOf(n) != -1}).length > 0;
    },

    /*
        Returns the version in a comparable format.
    */
    parseVersion: function(inputString) {
        var nMajor = 0;
        var nMinor = 0;
        var nBuild = 0;
        var iMajor = 0;
        var iMinor = 0;
        var iBuild = 0;
        var nIndex = 0;

    
        strVersion = inputString.split(".");

        for (nIndex = 0; nIndex < strVersion.length && nIndex < 3; nIndex++) {
            if (!isNaN(strVersion[nIndex])) {
                if (nIndex === 0){
                    iMajor = parseInt(strVersion[nIndex]);
                    nMajor = iMajor * 10000;
                }
                else if (nIndex === 1){
                    iMinor = parseInt(strVersion[nIndex]);
                    nMinor = iMinor * 1000;
                }
                else if (nIndex == 2){
                    iBuild = parseInt(strVersion[nIndex]);
                    nBuild = iBuild;
                }
            }
            else {
                lbs.log.error("Could not parse lime version number '{0}'".format(inputString));
            }
        }

        return {
                "comparable": nMajor + nMinor + nBuild,
                "full": "{0}.{1}.{2}".format(iMajor,iMinor,iBuild),
                "major": iMajor,
                "nMinor":iMinor,
                "build": iBuild
            };
    },

    compareVersions : function(ls, rs) {
        var rsSplitted = rs.toString().split('.');
        var lsSplitted = ls.toString().split('.');
        var returnValue = null;

        for (var i = 0; i < Math.min(rsSplitted.length, lsSplitted.length); i++) {
            var rsCurrent = parseInt(rsSplitted[i]);
            var lsCurrent = parseInt(lsSplitted[i]);

            if (rsCurrent > lsCurrent) {
                returnValue = 1; // ls is a higher version number
                break;
            }
            else if (rsCurrent < lsCurrent) {
                returnValue = -1; // rs is a higher version number
                break;
            }
            else {
                // Continute to next version part
            }
        };

        if (returnValue == null && rsSplitted.length < lsSplitted.length) {
            returnValue = -1; // rs is a higher version number
        }
        else if (returnValue == null && rsSplitted.length > lsSplitted.length) {
            returnValue = 1; // ls is a higher version number
        }
        else if (returnValue == null) {
            returnValue = 0; // The same versions
        }

        return returnValue;
    }

    
};

/**
--------------------------------------------------------
Some extensions to standard classes
--------------------------------------------------------
*/

/**
String.format
*/
if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };
}
/**
Binding provider override
*/
ko.defaultBindingProvider = ko.bindingProvider.instance;
ko.bindingProvider.instance = {
    nodeHasBindings: ko.defaultBindingProvider.nodeHasBindings,
    getBindings: function (node, bindingContext) {
        var bindings;
        try {
            bindings = ko.defaultBindingProvider.getBindings(node, bindingContext);
            
            //check validity
            this.checkValue(bindings, 'text', node);
            this.checkValue(bindings, 'value', node);

            bindings = this.processDependentBindings(bindings);
        }
        catch (ex) {
            lbs.log.error(ex.message);
            bindings = this.getDummyBindings(node);
            bindings = this.processDependentBindings(bindings);
        }

        return bindings;
    },

    //is value ok to bind to view, empty string is ok, undefined is not
    checkValue: function (data, val, node) {
        if (!data) {return;}
        if (!data.hasOwnProperty(val)) {return;}
        if (data[val]) { return; }
        if (data[val] === '' || data[val] === false || data[val] === 0) { return; }

        throw new ReferenceError('Unable to set binding \'{0}\'.\nBindings value: {1}\nMessage: Property is undefined'.format(val, $(node).attr('data-bind')));
    },

    //replace dependent bindings with another that can handle the isses
    processDependentBindings: function (bindings) {

        //no bindings, nothing to do
        if (!bindings) { return; }

        //text and icon in same binding
        if (bindings.hasOwnProperty('text') && bindings.hasOwnProperty('icon')) {
            //dont run if text is empty
            if (bindings['text'] !== '') {
                bindings['textWithIcon'] = { icon: bindings['icon'], text: bindings['text'] };
                delete bindings['text'];
                delete bindings['icon'];
            }
        }
        return bindings;
    },

   
    //set visible bindings to the binding values. Used if bindings failed to display helper data.
    getDummyBindings: function (node) {
        var bindings = {};
        var match;

        //set text
        match = new RegExp('text\:[^\,\}]*').exec($(node).attr('data-bind'));
        if (match) {
            bindings['text'] = 'Binding: ' + match[0].split(':')[1].trim();
        }
           
        //set value
        match = new RegExp('value\:[^\,\}]*').exec($(node).attr('data-bind'));
        if (match) { 
            bindings['value'] = 'Binding: ' + match[0].split(':')[1].trim();
        }

        //icons
        match = new RegExp('icon\:[^\,\}]*').exec($(node).attr('data-bind'));
        if (match) { 
            bindings['icon'] = match[0].split(':')[1].trim().replace(/\'/g, '');
        }

        return bindings;
    },

};

/**
Text with icon
*/
ko.bindingHandlers.textWithIcon = {
    update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var value = ko.unwrap(valueAccessor());
        var iconHtml = lbs.common.iconTemplate.format(value['icon']);

        $(element).html(iconHtml + '<span></span>');
        ko.bindingHandlers.text.update($(element).find('span').get(0), function () { return value['text']; }, allBindingsAccessor, viewModel, bindingContext);
    }
};

/**
LimeLink    
*/
ko.bindingHandlers.limeLink = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var newValueAccessor = function() {
            return function() {
                 lbs.common.executeVba('shell,' + lbs.common.createLimeLink(ko.unwrap(valueAccessor().class), ko.unwrap(valueAccessor().value)));
            };
         };
        ko.bindingHandlers.click.init(element, newValueAccessor, allBindingsAccessor, viewModel, bindingContext);
    },
};

/**
VBA call  
*/
ko.bindingHandlers.vba = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var newValueAccessor = function() {
            return function() {
                 lbs.common.executeVba(valueAccessor());
            };
         };
        ko.bindingHandlers.click.init(element, newValueAccessor, allBindingsAccessor, viewModel, bindingContext);
    },
};

/**
Show on google map  
*/
ko.bindingHandlers.showOnMap = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var newValueAccessor = function() {
            return function() {
                lbs.common.executeVba('shell,https://www.google.com/maps?q=' + encodeURIComponent(ko.unwrap(valueAccessor()).replace(/\r?\n|\r/g, ' ')));
            };
         };
        ko.bindingHandlers.click.init(element, newValueAccessor, allBindingsAccessor, viewModel, bindingContext);
    },
};

/**
Call phone (simply drop to shell)
*/
ko.bindingHandlers.call = {
     init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var newValueAccessor = function() {
            return function() {
               lbs.common.executeVba('shell,tel:' + ko.unwrap(valueAccessor()));
            };
         };
        ko.bindingHandlers.click.init(element, newValueAccessor, allBindingsAccessor, viewModel, bindingContext);
    },
};

/**
Open URL (simply drop to shell)
*/
ko.bindingHandlers.openURL = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var newValueAccessor = function() {
            return function() {
                lbs.common.executeVba('shell,' + ko.unwrap(valueAccessor()));
            };
         };
        ko.bindingHandlers.click.init(element, newValueAccessor, allBindingsAccessor, viewModel, bindingContext);
    },
};

/**
Invoke old-style app
*/
ko.bindingHandlers.appInvoke = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        
        var newValueAccessor = function() {
            if(lbs.hasLimeConnection === true){
                return function() {
                    Invoker.invokeWebApplication(ko.unwrap(valueAccessor()));
                };
            }else{
                return function(){
                    alert('AppInvoker is not avalible outside of lime');
                };
            }
        };
        ko.bindingHandlers.click.init(element, newValueAccessor, allBindingsAccessor, viewModel, bindingContext);
    },
};

/**
Call VBA function to check if item should be visible 
THIS IS DEPRECATED AND WILL BE REMOVED IN A FUTURE VERSION.
*/
ko.bindingHandlers.vbaVisible = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var visible = lbs.common.executeVba(ko.unwrap(valueAccessor()));

        if (visible) {
            $(element).show();
            $(element).removeClass('hidden');
            $(element).removeClass('remainHidden');
        } else {
            $(element).hide();
            $(element).addClass('hidden');
            $(element).addClass('remainHidden');
        }
    }
};

// Override knockout visible binding to allow for cookies
ko.bindingHandlers.visible = {
    'update': function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());

        var isCurrentlyVisible = !(element.style.display == "none");
        if (value && !isCurrentlyVisible){
            element.style.display = "";
            $(element).removeClass("remainHidden");
        }
        else if ((!value) && isCurrentlyVisible){
            element.style.display = "none";
            $(element).addClass("remainHidden");
        }
    }
};

ko.bindingHandlers.email = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var newValueAccessor = function() {
            return function() {
                lbs.common.executeVba('shell,mailto:' + ko.unwrap(valueAccessor()));
            };
        };
        ko.bindingHandlers.click.init(element, newValueAccessor, allBindingsAccessor, viewModel, bindingContext);
    },
};

/**
Prepend icon
*/
ko.bindingHandlers.icon = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var content = lbs.common.iconTemplate.format(ko.unwrap(valueAccessor()));
        if (
            $(element).text() !== '' && $(element).text().substring(0, content.length) != content) {
            $(element).prepend(content);
            element = $(element).get(0);
        }
    }
};

/**
Safe text binding, failes to empty string
*/
ko.bindingHandlers.safeText = {
  update: function(element, valueAccessor, allBindingsAccessor) {
    var options = ko.utils.unwrapObservable(valueAccessor()),
    value = ko.utils.unwrapObservable(options.value),
    property = ko.utils.unwrapObservable(options.property),
    fallback = ko.utils.unwrapObservable(options.default) || '',
    text;

    text = value ? (options.property ? value[property] : value) : fallback;

    ko.bindingHandlers.text.update(element, function() { return text; });
    }
};

ko.bindingHandlers.href = {
    update: function (element, valueAccessor) {
        ko.bindingHandlers.attr.update(element, function () {
            return { href: valueAccessor()};
        });
    }
};

ko.bindingHandlers.src = {
    update: function (element, valueAccessor) {
        ko.bindingHandlers.attr.update(element, function () {
            return { src: valueAccessor()};
        });
    }
};

ko.bindingHandlers.instantValue = {
    init: function (element, valueAccessor, allBindings) {
        var newAllBindings = function(){
            // for backwards compatibility w/ knockout  < 3.0
            return ko.utils.extend(allBindings(), { valueUpdate: 'afterkeydown' });
        };
        newAllBindings.get = function(a){
            return a === 'valueupdate' ? 'afterkeydown' : allBindings.get(a);
        };
        newAllBindings.has = function(a){
            return a === 'valueupdate' || allBindings.has(a);
        };
        ko.bindingHandlers.value.init(element, valueAccessor, newAllBindings);
    },
    update: ko.bindingHandlers.value.update
};

ko.bindingHandlers.toggle = {
    init: function (element, valueAccessor) {
        var value = valueAccessor();
        ko.applyBindingsToNode(element, {
            click: function () {
                value(!value());
            }
        });
    }
};

ko.bindingHandlers.stopBinding = {
    init: function () {
        return { controlsDescendantBindings: true };
    }
};
ko.virtualElements.allowedBindings.stopBinding = true;

ko.bindingHandlers.popover = {
    init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        var dom;          
        var color;
        var title;
        var icon;
        var placement;
        var trigger;
        if (typeof(valueAccessor()) =="object"){  

            if(typeof(valueAccessor().color) == "undefined"){
                color = "blue";
            }else{
                color = valueAccessor().color;
            }

            if(typeof(valueAccessor().title) == "undefined"){
                title = "Titel saknas";
            }else{
                title = valueAccessor().title;
            }

            if(typeof(valueAccessor().placement) == "undefined"){
                placement = "top";
            }else{
                placement = valueAccessor().placement;
                if("left,right,top,bottom".indexOf(valueAccessor().placement) == -1){
                    placement = "top";
                }
            }

            if(typeof(valueAccessor().trigger) == "undefined"){
                trigger = "hover";
            }else{
                trigger = valueAccessor().trigger;
                if("hover,click".indexOf(valueAccessor().trigger) == -1){
                    trigger = "hover";
                }
            }

            if(typeof(valueAccessor().icon) == "undefined"){

                icon = "";
            }else{
                icon = '<i class="fa ' + valueAccessor().icon + '"></i>';
            }
            
            switch(valueAccessor().type){                     
                case 'error':
                    color = 'red';
                    icon = '<i class="fa fa-times"></i> ';
                    title = 'Error';
                    break;
                case 'info':
                    color = "blue";
                    icon = '<i class="fa fa-info-circle"></i> ';
                    title = 'Information';
                    break;
                case 'warning':
                    color = "orange";
                    icon = '<i class="fa fa-warning"></i> ';
                    title = 'Warning';
                    break;
                case 'success':
                    color = "green";
                    icon = '<i class="fa fa-check"></i> ';
                    title = 'Success';
                    break;
                case 'custom':
                    break;
                default:
                    title = '';
                    dom = valueAccessor().text;                                    
            }
            title = '<span>' + title + '</span>';
            dom = '<div><div class="message-header ' + color +'">' + icon + title + '</div>'+valueAccessor().text+'</div>';
        }
        else{            
           dom = valueAccessor();
           placement = "top";
           trigger = "hover";
        }        
        
        $(element).attr({'data-toggle':'popover','data-container':'body','data-content':dom,'data-placement':placement});   
        $(element).popover({ trigger: trigger, html:'true' });

    },
    update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
         var dom;          
        var color;
        var title;
        var icon;
        var placement;
        var trigger;
        if (typeof(valueAccessor()) =="object"){  

            if(typeof(valueAccessor().color) == "undefined"){
                color = "blue";
            }else{
                color = valueAccessor().color;
            }

            if(typeof(valueAccessor().title) == "undefined"){
                title = "Titel saknas";
            }else{
                title = valueAccessor().title;
            }

            if(typeof(valueAccessor().placement) == "undefined"){
                placement = "top";
            }else{
                placement = valueAccessor().placement;
                if("left,right,top,bottom".indexOf(valueAccessor().placement) == -1){
                    placement = "top";
                }
            }

            if(typeof(valueAccessor().trigger) == "undefined"){
                trigger = "hover";
            }else{
                trigger = valueAccessor().trigger;
                if("hover,click".indexOf(valueAccessor().trigger) == -1){
                    trigger = "hover";
                }
            }

            if(typeof(valueAccessor().icon) == "undefined"){

                icon = "";
            }else{
                icon = '<i class="fa ' + valueAccessor().icon + '"></i>';
            }
            
            switch(valueAccessor().type){                     
                case 'error':
                    color = 'red';
                    icon = '<i class="fa fa-times"></i> ';
                    title = 'Error';
                    break;
                case 'info':
                    color = "blue";
                    icon = '<i class="fa fa-info-circle"></i> ';
                    title = 'Information';
                    break;
                case 'warning':
                    color = "orange";
                    icon = '<i class="fa fa-warning"></i> ';
                    title = 'Warning';
                    break;
                case 'success':
                    color = "green";
                    icon = '<i class="fa fa-check"></i> ';
                    title = 'Success';
                    break;
                case 'custom':
                    break;
                default:
                    title = '';
                    dom = valueAccessor().text;                                    
            }
            
            dom = '<div><div class="message-header ' + color +'">' + icon + title + '</div>'+valueAccessor().text+'</div>';
        }
        else{            
           dom = valueAccessor();
           placement = "top";
           trigger = "hover";
        }        
        
        $(element).attr({'data-toggle':'popover','data-container':'body','data-content':dom,'data-placement':placement});   
    }
};

 ko.bindingHandlers.tooltip = {   
    init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        if (typeof valueAccessor() ==='object'){
            $(element).attr({'data-toggle':'tooltip','white-space':'nowrap','data-original-title':valueAccessor().text,'data-placement':valueAccessor().placement});        
            $(element).tooltip();    
        }
        else
        {
            //,'white-space':'nowrap'
            $(element).attr({'data-toggle':'tooltip','white-space':'pre-wrap','data-original-title':valueAccessor(),'data-placement':'top'});        
            $(element).tooltip();    
        }        
    },
    update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {    
        if (typeof valueAccessor() ==='object'){
            $(element).attr({'data-toggle':'tooltip','white-space':'pre-wrap','data-original-title':valueAccessor().text,'data-placement':valueAccessor().placement});        
        }
        else
        {
            $(element).attr({'data-toggle':'tooltip','white-space':'pre-wrap','data-original-title':valueAccessor(),'data-placement':'top'});                    
        }
    }
};

ko.filters.number = function(value,nbrOfDecimals) {
    if (nbrOfDecimals === undefined) nbrOfDecimals = 2;
    value = Number(Math.round(value+'e'+nbrOfDecimals)+'e-'+nbrOfDecimals);
    return value.toLocaleString();
};

ko.filters.currency = function(value, currency, divider) {
    var retval;
    var currencyfirst = ["$", "£", "¥", "₱", "₭", "₦", "₩", "₮", "฿", "₹", "₡", "৳"];
    if (typeof value !== "string") value = value.toString();
    if (currency === undefined) currency = 'kr';
    if (divider === undefined) divider = ' ';

    if (currencyfirst.indexOf(currency) > -1) {
        retval = currency + ' ' + value.replace(/\B(?=(\d{3})+(?!\d))/g, divider);
    }
    else {
        retval = value.replace(/\B(?=(\d{3})+(?!\d))/g, divider) + ' ' + currency;
    }
    return retval;
};

ko.filters.percent = function(value, arg1) {
    return (value * 100) + '%';
};


ko.filters.fromNow = function(date, arg1) {
    date = date.slice(0,19);
    //console.log(date)
    return moment(date).fromNow(true);
};

ko.bindingHandlers.rotate = {
    update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        // This will be called once when the binding is first applied to an element,
        // and again whenever the associated observable changes value.
        // Update the DOM element based on the supplied values here.
        
        var deg = valueAccessor();
        console.log(deg);
        $(element).css({
            '-webkit-transform':'rotate(' + deg + 'deg)',
            '-moz-transform-transform':'rotate(' + deg + 'deg)',
            '-ms-transform-transform':'rotate(' + deg + 'deg)',
            '-o-transform:':'rotate(' + deg + 'deg)',
            'transform:':'rotate(' + deg + 'deg)'
        });
    }
};


lbs.jotnar = {

	winterEgg : function(){
		
	    //TBI
		
	}
};
lbs.bakery = {

    loader: function () {       

        var ap = decodeURI(
            (RegExp('ap' + '=' + '(.+?)(&|$)').exec(location.search) || [, null])[1]
        );
        //On load: check collapsible menu cookies
        $('.expandable').each(function () {
            if (lbs.bakery.getCookie($(this).index() + 'ul' + ap) === "0") {
                $(this).find(".menu-header").prepend("<i class='fa fa-angle-down'> </i>");
                $(this).removeClass("collapsed");
                $(this).children("li").not(".remainHidden").show();
            }
            else{
                $(this).find(".menu-header").prepend("<i class='fa fa-angle-right'> </i>");
                $(this).addClass("collapsed");
                $(this).children("li").not(".menu-header").not(".divider").hide();
            }
        });


        $('.expandable').find(".menu-header").click(function () {
            var menuDiv = $(this).parent();
            var i = lbs.bakery.getCookie(menuDiv.index() + 'ul' + ap);
            i = i === "0" ? "1" : "0";
            lbs.bakery.setCookie(menuDiv.index() + 'ul' + ap, i, "200");
            lbs.bakery.hideshow(menuDiv, ap);
        });

    }
    ,
    hideshow: function (menu, ap) {        
        var menuDiv = $(menu);    
        $(menu).find("i").first().toggleClass("fa fa-angle-down"); //expanded
        $(menu).find("i").first().toggleClass("fa fa-angle-right"); // Hidden
        if (lbs.bakery.getCookie($(menu).index() + 'ul' + ap) === "0") {
            menuDiv.removeClass("collapsed");
            menuDiv.children("li").not(".remainHidden").fadeIn(200);
        } else {
            menuDiv.addClass("collapsed");
            menuDiv.children("li").not(".menu-header").not(".divider").fadeOut(200);
        }
    },
    
    setCookie: function (cname, cvalue, exdays) {

        var ap = decodeURI(
            (RegExp('ap' + '=' + '(.+?)(&|$)').exec(location.search) || [, null])[1]
        );

        cname = cname + '-' + ap;

        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();        
        var cookieid = "cookieid=" + $('.expandable').attr('id');
        document.cookie = cname + "=" + cvalue + "; " + expires;
    }
    ,
    getCookie: function (cname) {

        var ap = decodeURI(
            (RegExp('ap' + '=' + '(.+?)(&|$)').exec(location.search) || [, null])[1]
        );

        cname = cname + '-' + ap;

        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1);
            if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
        }
        return "";
    }
};

