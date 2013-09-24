var limejs = limejs || {};
limejs.common = {

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
    "escapeHtml": function (unsafe) {
        return unsafe
             .replace(/&/g, "&amp;")
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;")
             .replace(/"/g, "&quot;")
             .replace(/'/g, "&#039;");
    },

    "createLimeLink": function (limeClass, limeId) {
        return "limecrm:"+limeClass+"."+limejs.activeDatabase + "." + limejs.activeServer + "?" + limeId
    },

    "getURLParameter": function (name) {
        return decodeURI(
            (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search) || [, null])[1]
        );
    },

    /**
    * Helperfunction to run LIME functions from JS
    */
    "executeVba": function (inString) {
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

        } catch (e) {
            return null;
            limejs.log.error("executeVBA:" + vbaline, e);

        }
    },

    //replace newline with br
    nl2br: function (input) {
        return input.replace(/\n/g, '<br />');
    },

    //break for newline if braket
    brak2br: function (input) {
        return input.replace(/{/g, '<br />').replace(/}/g, '<br />');
    },

    mergeOptions: function (obj1, obj2) {
        var obj3 = {};
        for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
        for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
        return obj3;
   },
    
}
