
/**
--------------------------------------------------------
Common functions used in lbs
--------------------------------------------------------
*/
lbs.common = {

    /**
    Fetch a random funny error text
    */
    "getErrorText": function () {
        var nbr = Math.floor((Math.random() * 5) + 1);
        switch (nbr) {
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
    },

    /**
    Get icon html
    */
    iconTemplate : "<i class='fa {0}'></i>",

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

    /**
    Create a limelink from class, id, server and database properties
    */
    "createLimeLink": function (limeClass, limeId) {
        return "limecrm:"+limeClass+"."+lbs.activeDatabase + "." + lbs.activeServer + "?" + limeId
    },

    /**
    Fetch the url parameters from the GET-URL
    */
    "getURLParameter": function (name) {
        return decodeURI(
            (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search) || [, null])[1]
        );
    },

    /**
    * Helperfunction to run VBA functions from JS
    */
    "executeVba": function (inString) {
        try {
            lbs.log.debug("Trying to execute VBA:" + inString);
            var vbaline;

            var inArgs = inString.split(',');

            if (inArgs.length > 1) {

                var args = "";
                vbaline = "lbs.limeDataConnection.Run('" + inArgs[0] + "', ";
                for (var i = 1; i < inArgs.length; i++) {
                    while (inArgs[i].charAt(0) === ' ') {
                        inArgs[i] = inArgs[i].substr(1);
                    }
                    args += "'" + inArgs[i] + "'";
                    if (i != inArgs.length - 1)
                        args += ",";
                }
                vbaline += args + ")";
                
                //lbs.log.debug("Trying to execute multi argument VBA:" + vbaline);
                return eval(vbaline);
            }
            else {
                vbaline = "lbs.limeDataConnection.Run('"+arguments[0]+"')";
                //lbs.log.debug("Trying to execute single argument VBA:" + vbaline);
                return lbs.limeDataConnection.Run(arguments[0]);
            }

        } catch (e) {
            return null;
            //lbs.log.error("Failed to execute VBA:" + vbaline, e);
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
        })
        return obj1;
    },

    /**
    Generate GUID
    */
    generateGuid: function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        })
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
                if (nIndex == 0){
                    iMajor = parseInt(strVersion[nIndex]);
                    nMajor = iMajor * 10000;
                }
                else if (nIndex == 1){
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
    
}

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
            return typeof args[number] != 'undefined'
              ? args[number]
              : match
            ;
        });
    };
}
