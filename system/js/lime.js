/**
* limejs.js is the default LIME Pro javascript lib for actionpad functions.
* It contains many functions to make the world a little better place.
*/


//declare limejs container
var limejs = limejs || {

    //config
    "debug": false,
    "limeDataConnection": window.external,
    "hasLimeConnection" : true,

    //props
    "activeClass": "",
    "activeDatabase": "",
    "activeServer": "",
    "appsMetaData": {},
    "apps" : {},
    "error": false,
    "vm": {},

    //config
    config : {
        dataSources: [
             { type: 'activeInspector', source: '' },
             { type: 'localization', source: '' },
        ],
        resources: {
            scripts: [],
            styles: [],
            libs: ['json2xml.js']
        }
    },

    //setup
    setup: function () {

        //system param
        this.setSystemOperationParameters();

        //find debug flag
        this.setDebugStatus();

        //init the log
        this.log.setup(limejs.debug);

        //get AP class
        this.setActionPadClass();

        //get Server and Database
        this.setActiveDBandServer();

        //load view
        this.loader.loadView(limejs.activeClass, $("#content"));

        //load datasources
        this.vm = limejs.loader.loadDataSources(this.vm, this.config.dataSources);

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

        //execute onLoad
        this.ExecuteOnloadEvents();

        //setOnclickEvents
        this.SetOnclickEvents();

    },
    "setSystemOperationParameters": function () {

        //ajax should be async
        $.ajaxSetup({
            async: false
        });

        //create viewmodel container
        this.vm = new limejs.vmFactory();

        //check connection to Lime
        this.hasLimeConnection = (typeof limejs.limeDataConnection.Application != 'undefined');
    },

    "setDebugStatus": function () {
        if ($("html").attr("data-debug").toLowerCase() === "true") {
            limejs.debug = true
        } else {
            limejs.debug = false
        }
    },

    "setActionPadClass": function () {
        if (limejs.common.getURLParameter("ap") != 'null') {
            this.activeClass = limejs.common.getURLParameter("ap");
        } else {
            try {
                this.activeClass = eval('limejs.limeDataConnection.ActiveInspector.Class.Name');
            }
            catch (e) {
                limejs.log.warn("Could not determine inspector class, assuming index", e);
                limejs.activeClass = 'index';
            }
        }

        limejs.log.info("Using view: " + limejs.activeClass);
    },


    "setActiveDBandServer": function () {
       
        try {
            limejs.activeServer = limejs.limeDataConnection.Database.ActiveServerName;
            limejs.activeDatabase = limejs.limeDataConnection.Database.Name;
            limejs.log.info("Active Server, Database: " + limejs.activeServer + ", " + limejs.activeDatabase);
        }
        catch (e) {
            limejs.log.warn("Could not set active server and database");

        }        
    },
    
    /**
    * On click handlers. Executes events when clicked, such as running VBA or manipulating the DOM
    * 
    **/ 
    "SetOnclickEvents": function () {

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

    "ExecuteOnloadEvents": function () {

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

    "applyBindings": function () {
        try {
            limejs.log.debug('ViewModel: ' + JSON.stringify(limejs.vm));
            limejs.vm = ko.mapping.fromJS(limejs.vm);
            ko.applyBindings(limejs.vm, $("#content").get(0));
        } catch (e) {
            limejs.log.warn("Binding of data to view failed! \n Displaying mapping attributes");
            limejs.log.exception(e);
            limejs.loader.setFallBackDummyData($("#content").get(0));
        }
    },
}

//ViewModel
limejs.vmFactory = function () {

}

//run the awesomeness
$(document).ready(function () { window.limejs = limejs; limejs.setup();})
