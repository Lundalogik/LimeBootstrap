/**
* limejs.js is the default LIME Pro javascript lib for actionpad functions.
* It contains many functions to make the world a little better place.
*/


//declare limejs container
var limejs = {
    "debug": true,
    "limeDataConnection": window.external,
    "setup" : function () {
                  
        this.loadDOM();

        //load apps
        this.loadApps();

        //execute onLoad
        this.ExecuteOnloadEvents();

        //setOnclickEvents
        this.SetOnclickEvents();

        //Localize page
        this.localize();     

    },

    "loadDOM": function() {
        $.ajaxPrefilter( "json script html", function( options ) {
            options.crossDomain = true;
        });

        var url =""
        if (typeof this.limeDataConnection.ActiveInspector !== "undefined") {
            
            url = "../" + this.limeDataConnection.ActiveInspector.Class.Name + ".html"
        } else if (window.location.search !== "" ){
			
			url= "../" + window.location.search.replace("?","") + ".html";
			
        }else{
	        alert("No dataconnection nor querystring was supplied. Please do so in this format: class=[insert your class name] ")  
        }

		if(url != "") {
		        if (Handlebars.templates === undefined || Handlebars.templates[name] === undefined) {
		            $.ajax({
		                url: url,
		                datatype: 'text/javascript',
		                success: function (response, status, jqXHR) {
		                    if (Handlebars.templates === undefined) {
		                        Handlebars.templates = {};
		                    }
		                    Handlebars.templates[name] = Handlebars.compile(response);
		                   $('body').html(Handlebars.templates[name]);
		                },
		                async: false
		            });
		        }
		}
       


    },

    "loadApps" : function () {
        $.ajaxPrefilter( "json script", function( options ) {
            options.crossDomain = true;
        });
    
        var path;
        var appName;
        var htmlNode;
        $("[data-app]").each(function () {
            
            appName = $(this).attr("data-app")
            path = "../apps/" + appName + "/";
            htmlNode = $(this);
            console.log(htmlNode.txt)
            var data = limejs.executeVba($(this).attr("data-object"));
            data = '<checklist><businesstypeactivity order="10" name="Lead" required="0" multiplecheck="0" validatemandatoryfields="0" activitytype="173101" autocreatehistory="1" historytext="Lead avprickat" vbacode="ActionPad_Business.FormUploadFile, Lead" visibilitycondition=""/> <businesstypeactivity order="20" name="Bes√∂k" required="0" multiplecheck="0" validatemandatoryfields="0" activitytype="159601" autocreatehistory="0" historytext="Kundbesˆk genomfˆrt." vbacode="" visibilitycondition="" checked="1" /></checklist>';
            
                var appData;
                $.ajax({
                    type: 'GET',
                    url: path + "app.json?callback=?",
                    async: false,
                    jsonpCallback: 'app',
                    contentType: "application/json",
                    dataType: 'jsonp',
                    success: function (app) {
                       // console.log(app)
                        $.each(app.styles, function (index) {
                            $("head").append("<link rel='stylesheet' type='text/css' href='" + path + app.styles[index] + "' />");
                        });

                        $.each(app.libs, function (index) {
                            	$.getScript("js/" + app.libs[index]);
                           
                        });

                        $.each(app.scripts, function (index) {
                            $.getScript(path + app.scripts[index], function () {
                                if (data != null) {
                                    data = $.parseJSON(xml2json($.parseXML(data), ""));
                                    console.log(appName + ".initalize(" + "data" + "," + "htmlNode" + ")");
									eval(appName + ".initalize(data, htmlNode)");
                           
                                }
                            });
                        });


                    },
                    error: function (e) {
                        console.log(e.message);
                        return null;
                    }
                });
                    
             				
  		});
    },
    /**
    * Helperfunction to run LIME functions from JS
    */
    "executeVba" : function(inString) {
        try {
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
				return eval(vbaline);
			}
			else {
				return window.external.Run(arguments[0] );
			}
		} catch (e)
		{
			return null;
            limejs.log("executeVBA:" + vbaline, e);
            
		}
    },
    /**
    * On click handlers. Executes events when clicked, such as running VBA or manipulating the DOM
    * 
    **/ 
    "SetOnclickEvents": function () {

        //Performs the data-action
        $("[data-action]").click(function () {
            limejs.executeVba($(this).attr("data-args"))
        });

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
        $(".menu").addClass("nav nav-list")
        $(".expandable").each(function () {
            if ($(this).hasClass("hidden")) { //should be hidden if class hidden  exists
                $(this).find(".nav-header").append("<i class='icon-angle-right'> </i>");
                $(this).children("li").not(".nav-header").not(".divider").hide();
            } else {
                $(this).find(".nav-header").append("<i class='icon-angle-down'> </i>");
            };
        });

        $("[data-field]").each(
            function () {
                try{
                    var content = eval('limejs.limeDataConnection.ActiveInspector.Controls.GetText("' + $(this).attr("data-field") + '")');
                    if (content != "") {
                        $(this).append(content);
                    } else {
                        $(this).hide();
                    }
                }
                catch (e) {
                    $(this).append("ERROR: Couldn't find LIME data connection!");
                    limejs.log("data-field:", e)
                }
            }
        )
        $("[data-visibility]").each(
            function(){
            var args = ($(this).attr("data-visibility")).toString();
            var visible = limejs.executeVba(args);
              if (visible == true){
                  $(this).show();
                  $(this).removeClass("hidden")
              }else{
                  $(this).hide();
                  $(this).addClass("hidden")
              }

            }
        )
            /**
            * data-action has four built in special handlers
            * - Call: Makes a CallTo-link from an Phonenbr
            * - openUrl: Helps with opening URLs in an external browser
            * - showOnMap: Performs a search on google maps
            * - lime-link:
            **/
        $("[data-action]").each(
            function () {
                try{
                    var arg;
                    var val = $(this).attr("data-action").toString();
                    if (val === "call") {
                        arg = "shell,tel:" + $(this).text().replace(/\s/g, '')
                    } else if (val === "openUrl") {
                        arg = "shell," + $(this).text().replace(/\s/g, '');
                    } else if (val === "lime-link") {
                        arg ="shell," + limejs.executeVba("ActionPadTools.CreateLIMELink," + $(this).attr("data-field").toString())
                    } else if (val.indexOf("showOnMap") != -1) {
                        arg = "shell,https://www.google.com/maps?q=";
                        var fieldData = val.split(',');
                        while (fieldData[1].charAt(0) === ' ') {
                            fieldData[1] = fieldData[1].substr(1);
                        }
                        arg += eval('limejs.limeDataConnection.ActiveInspector.Controls.GetText("' + fieldData[1] + '")');
                        arg = arg.replace(/\r?\n|\r/g, ' ');
                    }
                    else {
                        arg = val
                    }

                    $(this).attr('data-args',arg);
                } catch (e) {
                    limejs.log("data-action:", e)
                }
            }
        );

    
        /**
            Displays an Bootstrap alert with the text from the LIME-function. 
            Input: Function, Type (success, error, warning, info), icon
        **/
        $("[data-info]").each(function () {

            var args = $(this).attr("data-info").toString().split(',');
            var text = limejs.executeVba(args[0])
            if (text != "") {
                $(".content-container").append("<div class='alert alert-dismissable alert-" + args[1] + " info'><i class='" + args[2] + "'></i><button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button><p>" + text + "</p></div>")
            }
            $(".info").css("width", $(".content-container").width() - 50 );
            
        });
        
        $("[data-object]").each(function () {
	        
            var args = $(this).attr("data-object").toString().split(',');
            var data = limejs.executeVba(args[0])
            while (args[1].charAt(0) === ' ') {
                args[1] = args[1].substr(1);
            }
            eval(args[1]());
	        
        });

    },
    "log" : function(msg, error){
        if (limejs.debug){
            $(".content-container").append("<div class='alert alert-dismissable alert-danger'> <button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button><strong>" + limejs.getErrorText() + " </strong><p>" + error.message + "<br>@" + msg + "</p></div>")
            if(console != null){
                console.log(error);
            }
        }
       return limejs;
    },
    "setDebug" : function(bool){
        limejs.debug = bool;
    },


    "localize"  :  function() {
    try{
        var locale = window.external.Locale;
     }
	 catch(e){var locale = 'sv';}
        if(locale!= 'sv')
        {
            locale = 'en-us';
        }
	 
        var title;

        // set innerhtml for all tags with a locale attribute
        $("*", document.body).each(function(i) {
            if ($(this).attr(locale) != undefined){
                $(this).append($(this).attr(locale));
            }
        });

        // set tooltip for all hrefs
        title = "title-" + locale;
        $("li", document.body).each(function(i) {
            if ($(this).attr(title) != undefined){
                $(this).attr({title: $(this).attr(title)});
            }
        });

    },

    "getErrorText": function () {
        var nbr = Math.floor((Math.random() * 5) + 1);
        switch(nbr)
        {
            case 1:
                return "Oh snap!"
                break;
            case 2:
                return "Oh no!"
                break;
            case 3:
                return "God damit!"
                break;
            case 4:
                return "Holy guacamole!"
                break;
            case 5:
                return "Arghhhh!"
                break;
        }
    }

}


$(document).ready(function () { limejs.setup();})
