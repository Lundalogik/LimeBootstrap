
var LimeUrl = null;

(function() {
    var _url = null;

    if (LimeUrl == null) {
        LimeUrl = new Object();
    }

    /**
    * Adds a parameter to the url created by LimeUrl.Create. An error 
    * message is displayed if that method hasn't been called previous 
    * to this.
    */
    LimeUrl.AddParameter = function(name, value) {
        if (_url == null) {
            alert("The method LimeUrl.Create must be called before this method.");
            return;
        }

        _url += "&" + window.external.UriEncode(name) +
                "=" + window.external.UriEncode(value);
    }

    /**
     * Executes the url created by LimeUrl.Create. An error message is
     * displayed if that method hasn't been called previous to this.
     */
    LimeUrl.Click = function() {
    if (_url == null) {
    alert("The method LimeUrl.Create must be called before this method.");
    return;
    }

        window.external.Shell(_url);
    }

    /**
    * Create a new url parameters except for the command parameter.
    */
    LimeUrl.Create = function(classname, command) {
    _url = "limecrm:" + window.external.UriEncode(classname) +
    "." + window.external.UriEncode(window.external.Database.Name) +
    "." + window.external.UriEncode(window.external.Database.ActiveServerName) +
    "?command=" + command;
    }

    /**
    * Creates a new record of the specified class. Options is an object with the
    * following properties:
    *
    * ownerclass - the class of the record that owns the new record, eg if
    * classname is 'history' the ownerclass could be 'company'.
    *
    * ownersource - if the owner should be the record for the current active
    * inspector or explorer. For explorers the active item is used. Valid values
    * are 'activeinspector' and 'activeexplorer'
    *
    * ownerid - record id for the owner
    *
    * ownerfield - the field name for the owner. If no ownerfield is specified
    * Lime tries to find a relationfield based on ownerclass.
    *
    * autosave - if the new record should be save automagically. Valid values are 1 or 0.
    * If 1 the record is saved and no form is showed.
    *
    * fields - an object with field and value pairs. Use this property to set values for
    * fields on the new object.
    *
    * Example:
    *
    * <a href="#" onclick="javascript:LimeUrl.New('history', {
    *   ownerclass: 'sos',
    *   ownersource: 'activeinspector',
    *   autosave: 1,
    *   fields: {
    *     category: document.getElementById('urlCategory').value,
    *     history: document.getElementById('urlHistory').value
    *   }
    *  });">Create History</a>
    *
    * Create a new history record owned by the active SOS record. This link is placed
    * in the SOS form's actionpad.
    */
    LimeUrl.Execute = function(classname, command, options) {
        var url;

        url = "limecrm:" + window.external.UriEncode(classname) +
              "." + window.external.UriEncode(window.external.Database.Name) +
              "." + window.external.UriEncode(window.external.Database.ActiveServerName) +
              "?command=" + command;

        if (options != undefined) {
            for (var key in options) {
                if ("fields" != key)
                    url += "&" + window.external.UriEncode(key) + "=" + window.external.UriEncode(options[key]);
            }

            if (options.fields != undefined) {
                for (var key in options.fields) {
                    url += "&" + window.external.UriEncode(key) + "=" + window.external.UriEncode(options.fields[key]);
                }
            }
        }


        window.external.Shell(url);
    };

})();
