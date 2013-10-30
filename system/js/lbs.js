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
    "limeDataConnection": window.external,
    "limeVersion" : {},
    "hasLimeConnection": true,
    "activeClass": "",
    "activeDatabase": "",
    "activeServer": "",
    "apps" : {},
    "error": false,
    "vm": {},

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
        }
    },

    /**
    Setup
    */
    setup: function () {

        //system param
        this.setSystemOperationParameters();

        //find debug flag
        this.setDebugStatus();

        //init the log
        this.log.setup(lbs.debug);

        //get AP class
        this.setActionPadClass();

        //get Server and Database
        this.setActiveDBandServer();

        //set Skin
        this.setSkin();

        //set moment language
        moment.lang(lbs.common.executeVba('Localize.GetLanguage'));
        
        //load view
        this.loader.loadView(lbs.activeClass, $("#content"));

        //load datasources
        this.vm = lbs.loader.loadDataSources(this.vm, this.config.dataSources, false);

        //load apps
        this.apploader.identifyApps();

        //load resources
        this.loader.loadResources();

        //apps vm
        this.apploader.buildApps();

        //setup bindings
        this.applyBindings();

        //init apps
        this.apploader.initializeApps();

        //push delayed logitems
        this.log.vm.enableConsole();

        //execute onLoad
        this.ExecuteOnloadEvents();

        //setOnclickEvents
        this.SetOnclickEvents();

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
            lbs.common.parseVersion(lbs.limeDataConnection.Version) : lbs.common.parseVersion("0.0.0")
    },



    /**
    Find debug flags
    */
    setDebugStatus: function () {
        if ($("html").attr("data-debug").toLowerCase() === "true") {
            lbs.debug = true
        } else {
            lbs.debug = false
        }
    },

    /**
    Find active actionpad view
    */
    setActionPadClass: function () {
        if (lbs.common.getURLParameter("ap") != 'null') {
            this.activeClass = lbs.common.getURLParameter("ap");
        } else {
            try {
                this.activeClass = lbs.limeDataConnection.ActiveInspector.Class.Name;
            }
            catch (e) {
                lbs.log.warn("Could not determine inspector class, assuming index",e);
                lbs.activeClass = 'index';
            }
        }

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
            var skin = lbs.common.executeVba("ActionPadTools.GetSkin");
            if(skin == 1){
                lbs.log.info("Silver skin is used");
                $("body").addClass("silver")
            }else if(skin == 2){
                lbs.log.info("Yay! Britney skin is used");
                $("body").addClass("britney")
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
    SetOnclickEvents: function () {

        //Expandable: Toggels visibility of child-elements of the element. Used in menues
        $(".expandable").find(".menu-header").click(
            function () {
                var menuDiv = $(this).parent()
                $(this).find("i").toggleClass("fa fa-angle-down"); //expanded
                $(this).find("i").toggleClass("fa fa-angle-right"); // Hidden
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
        )
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
            };
        });

        //header icons
        $(".header-icon").each(function(){
            $(this).addClass("header-icon-container");
            $(this).css("background-image", "url('resources/"+lbs.activeClass+".png')");
        })
    },

    /**
    Apply knockout bindings to actionpad, note: no apps will be effected
    */
    applyBindings: function () {
        try {
            lbs.log.debug('ViewModel: ' + JSON.stringify(lbs.vm));
            ko.applyBindings(lbs.vm, $("#content").get(0));
        } catch (e) {
            lbs.log.warn("Binding of data ActionPad failed! \n Displaying mapping attributes",e);
        }
    },
}

/**
ViewModel factory, extend this to add knockout functionality to actionpads
*/
lbs.vmFactory = function () {}

/**
Every this is loaded, run the awesomeness!
*/
$(document).ready(function () { window.lbs = lbs; lbs.setup();})
