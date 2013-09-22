/**
* limejs.js is the default LIME Pro javascript lib for actionpad functions.
* It contains many functions to make the world a little better place.
*/


//declare limejs container
var limejs = {

    //config
    "debug": "",
    "limeDataConnection": window.external,
    "hasLimeConnection" : true,

    //props
    "activeClass": "",
    "activeDatabase": "",
    "activeServer": "",
    "apps": [],
    "error": false,
    "actionPadData": null,

    "setup": function () {

        $.ajaxSetup({
            async: false
        });

        //init the log
        if ($("html").attr("debug").toLowerCase() === "true") {
            limejs.debug = true
        } else {
            limejs.debug = false
        }
        this.log.setup();

        //check Lime connection
        this.setHasLimeConnection();

        //get AP class
        this.setActionPadClass();

        //get Server and Database
        this.setActiveDBandServer();

        //load config
        this.loader.loadSiteConfig(); 

        //load resources
        this.loader.loadResources();

        //load view
        this.loader.loadView(limejs.activeClass, $("#content"));

        //load view
        this.loader.loadData();

        //load apps
        //this.app.loadApps();

        //init apps
        this.app.InitializeApps();

        //execute onLoad
        this.ExecuteOnloadEvents();

        //setOnclickEvents
        this.SetOnclickEvents();

        //Localize page
        this.localize();

        if (!limejs.error) {
            limejs.log.info("Puh! Everything went fine!")
        }
    },

    "setHasLimeConnection" : function(){
        this.hasLimeConnection = (typeof limejs.limeDataConnection.Application != 'undefined'); 
    },

    "setActionPadClass": function () {
        if (limejs.common.getURLParameter("ap") != 'null') {
            limejs.activeClass = limejs.common.getURLParameter("ap");
        } else {
            try {
                limejs.activeClass = eval('limejs.limeDataConnection.ActiveInspector.Class.Name');
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
    * Helperfunction to run LIME functions from JS
    */
    "executeVba" : function(inString) {
        try {
            limejs.log.debug("Trying to execute VBA:" + inString);

            var inArgs = inString.split(',');
            
            if (inArgs.length > 1) {
              
				var args = "";
				var vbaline = "limejs.limeDataConnection.Run('" + inArgs[0] + "', ";
				for (var i = 1; i < inArgs.length; i++) {
				    while (inArgs[i].charAt(0) === ' ') {
				        inArgs[i] = inArgs[i].substr(1);
				    }
					args += "'" + inArgs[i] + "'";
					if (i != inArgs.length - 1) 
						args += ",";
				}
				vbaline += args + ")";
                //alert(vbaline)
				 eval(vbaline);
			}
			else {
                return limejs.limeDataConnection.Run(arguments[0]);
            }

		} catch (e)
		{
			return null;
            limejs.log.error("executeVBA:" + vbaline, e);
            
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
        /**
        * Set up menu to be able to expand or not
        **/
        if (!this.hasLimeConnection) {
           // this.alert.error("Offline", "Connection to Lime could not be found");
        }

        $(".menu").addClass("nav nav-list")
        $(".expandable").each(function () {
            if ($(this).hasClass("hidden")) { //should be hidden if class hidden  exists
                $(this).find(".nav-header").prepend("<i class='icon-angle-right'> </i>");
                $(this).children("li").not(".nav-header").not(".divider").hide();
            } else {
                $(this).find(".nav-header").prepend("<i class='icon-angle-down'> </i>");
            };
        });


        function ActionPadViewModel() {

            try {
                eval("this." + limejs.activeClass  + " = limejs.actionPadData." + limejs.activeClass);
            } catch (e) {
                limejs.log.error("Data failed to be bound to View Model",e)
            }
        }

        //limeData
        ko.bindingHandlers.limeData = {
            init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                 $(element).append(valueAccessor);   
            }
        };
        //limeActions
        ko.bindingHandlers.limeAction = {
            init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                //LimeLink
                if (valueAccessor().limeLink) {
                    $(element).click(function () {
                        limejs.executeVba("shell," + limejs.common.createLimeLink(valueAccessor().limeLink.class, valueAccessor().limeLink.value));
                    });
                }
                //VBA
                if (valueAccessor().VBA) {
                    $(element).click(function () {
                        limejs.executeVba(valueAccessor().VBA);
                    });
                }
                //showOnMap
                if (valueAccessor().showOnMap) {
                    try{
                        $(element).click(function () {                     
                            limejs.executeVba("shell,https://www.google.com/maps?q=" + valueAccessor().showOnMap.replace(/\r?\n|\r/g, ' '));
                        });
                    } catch (e) {
                        limejs.log.error("ShowOnMap", e);
                    }
                }
                //call
                if (valueAccessor().call) {
                    $(element).click(function () {
                        limejs.executeVba("shell,tel:" + valueAccessor().call);
                    });
                }
                //openURL
                if (valueAccessor().openURL) {
                    $(element).click(function () {
                        limejs.executeVba("shell," + valueAccessor().openURL);
                    });
                }
            }
        };

        //limeVisibility
        ko.bindingHandlers.limeVisibility = {
            init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                $(element).click(function () {
                    var visible = limejs.executeVba(valueAccessor);
                    if (visible == true) {
                        $(this).show();
                        $(this).removeClass("hidden")
                    } else {
                        $(this).hide();
                        $(this).addClass("hidden")
                    }
                });
            }
        };
        ko.bindingHandlers.icon = {
            init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                $(element).prepend("<i class='" + valueAccessor() + "'></i>");
            }
        };

        if (limejs.actionPadData) {
            try{
                ko.applyBindings(new ActionPadViewModel(), $("#content").get(0));
            }catch(e){
                limejs.log.error("Binding of data to view failed!",e);
            }
        }
      

        /**
            Displays an Bootstrap alert with the text from the LIME-function. 
            Input: Function, Type (success, error, warning, info), icon
        **/
        //$("[data-info]").each(function () {

        //    var args = $(this).attr("data-info").toString().split(',');
        //    var text = limejs.executeVba(args[0])
        //    if (text != "") {
        //        $(".content-container").append("<div class='alert alert-dismissable alert-" + args[1] + " info'><i class='" + args[2] + "'></i><button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button><p>" + text + "</p></div>")
        //    }
        //    $(".info").css("width", $(".content-container").width() - 50 );
            
        //});
        
        //$("[data-object]").each(function () {
	        
        //    var args = $(this).attr("data-object").toString().split(',');
        //    var data = limejs.executeVba(args[0])
        //    while (args[1].charAt(0) === ' ') {
        //        args[1] = args[1].substr(1);
        //    }
        //    eval(args[1]());
	        
        //});

    },
    "setDebug" : function(bool){
        limejs.debug = bool;
    },

    "localize"  :  function() {

        var textValue;
        var tooltipValue;

             //set innerhtml for all tags with a locale attribute
            $("[data-locale]").each(function (i) {
                textValue = limejs.common.escapeHtml('<Loc: ' + $(this).attr("data-locale")+">");
                $(this).append(textValue);
            });

             //set tooltip for all hrefs
            $("[data-title]").each(function (i) {
                tooltipValue = limejs.common.escapeHtml('<Loc: ' + $(this).attr("data-title") + ">");
                $(this).attr({ title: tooltipValue });
            });
        },

}

$(document).ready(function () { window.limejs = limejs; limejs.setup();})
