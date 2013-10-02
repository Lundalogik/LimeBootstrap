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
    "hasLimeConnection": true,
    "activeClass": "",
    "activeDatabase": "",
    "activeServer": "",
    "appsMetaData": {},
    "apps" : {},
    "error": false,
    "vm": {},

    /**
    config
    */
    config : {
        dataSources: [
             { type: 'activeInspector', source: '' },
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

        //load view
        this.loader.loadView(lbs.activeClass, $("#content"));

        //load datasources
        this.vm = lbs.loader.loadDataSources(this.vm, this.config.dataSources);

        //load apps
        this.app.IdentifyApps();

        //load resources
        this.loader.loadResources();

        //apps vm
        this.app.buildAppViewModels();

        //setup bindings
        this.applyBindings();

        //init apps
        this.app.InitializeApps();

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

        //TODO:remove this debug thingy
        this.vm.obj = { prop: { exists: 'a', empty : '' } }

       
        //check connection to Lime
        this.hasLimeConnection = (typeof lbs.limeDataConnection.Application != 'undefined');
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
    * On click handlers. Executes events when clicked, such as running VBA or manipulating the DOM
    * 
    **/ 
    SetOnclickEvents: function () {

        //Expandable: Toggels visibility of child-elements of the element. Used in menues
        $(".expandable").find(".nav-header").click(
            function () {
                $(this).find("i").toggleClass("icon-angle-down"); //expanded
                $(this).find("i").toggleClass("icon-angle-right"); // Hidden
                $(this).parent().children("li").not(".nav-header").not(".divider").not(".hidden").fadeToggle();
            }
        )
    },

    /**
    * On load handler. Executes events when the actionpad is loaded, such as running setting up the DOM, hideing things and setting up 
    * 
    **/
    ExecuteOnloadEvents: function () {

        $(".menu").addClass("nav nav-list")
        $(".expandable").each(function () {
            if ($(this).hasClass("hidden")) { //should be hidden if class hidden  exists
                $(this).find(".nav-header").prepend("<i class='icon-angle-right'> </i>");
                $(this).children("li").not(".nav-header").not(".divider").hide();
            } else {
                $(this).find(".nav-header").prepend("<i class='icon-angle-down'> </i>");
            };
        });
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
