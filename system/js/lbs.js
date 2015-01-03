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
    "verboseLevel":null,
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

        //load apps
        this.apploader.identifyApps();

        //load resources
        this.loader.loadResources();

        //apps vm
        this.apploader.buildApps();

        //setup bindings
        this.applyContentBindings();

        //init apps
        this.apploader.initializeApps();

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

        //syntax highjlight
        lbs.log.watch.sh();

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

    setVerboseLevel: function(){
        if(lbs.externalConfig.verboseLevel){
            switch(lbs.externalConfig.verboseLevel){
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
        }else{
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

        //Expandable: Toggels visibility of child-elements of the element. Used in menues
        $(".expandable").find(".menu-header").click(
            function () {
                var menuDiv = $(this).parent();
                $(this).find("i").first().toggleClass("fa fa-angle-down"); //expanded
                $(this).find("i").first().toggleClass("fa fa-angle-right"); // Hidden
                if (menuDiv.hasClass("collapsed")) {
                     menuDiv.removeClass("collapsed");
                     menuDiv.children("li").not(".remainHidden").fadeIn(200);
                     menuDiv.find(":hidden").removeClass("remainHidden");
                }else{
                    
                    menuDiv.addClass("collapsed");
                    menuDiv.find(":hidden").addClass("remainHidden");
                    menuDiv.children("li").not(".menu-header").not(".divider").fadeOut(200);
                }
            }
        );


    
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

        //menues
    
        $(".expandable").each(function () {
             // if hidden by some reason, don't fuck with it.
            if ($(this).hasClass("collapsed")) { //should be hidden if class hidden  exists
                $(this).find(":hidden").addClass("remainHidden");
                $(this).find(".menu-header").prepend("<i class='fa fa-angle-right'> </i>");
                $(this).children("li").not(".menu-header").not(".divider").hide();
            } else {
                $(this).find(".menu-header").prepend("<i class='fa fa-angle-down'> </i>");
            }
        });

        //header icons
        $(".header-icon").each(function(){
            $(this).addClass("header-icon-container");
            $(this).css("background-image", "url('resources/"+lbs.activeClass+".png')");
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
            var lbsURL = "http://limebootstrap.lundalogik.com/api/";
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
                var remoteData = lbs.loader.loadFromExternalWebService(lbsURL+ "version/");
                if(!remoteData){
                    lbs.log.warn("Failed to check remote version of LBS! ");
                    return;
                }
                var remoteVersionData = $.parseJSON(remoteData);

                var localVersionData = $.parseJSON(lbs.loader.loadLocalFileToString("system/version.json"));
                
                var currentRemoteVersion = _.max(remoteVersionData.versions, function(versionInfo){ return versionInfo.version; }).version;
                var currentLocalVersion = _.max(localVersionData.versions, function(versionInfo){ return versionInfo.version; }).version;

                if(currentRemoteVersion > currentLocalVersion) {
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
