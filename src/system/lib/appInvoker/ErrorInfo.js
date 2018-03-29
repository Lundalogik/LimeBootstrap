

var ErrorInfo = null;

(function() {
    if (ErrorInfo == null)
        ErrorInfo = new Object();
    
    // A javascript expression that defines how we get hold of the Lime.Application object
    var m_strGetLimeExpression = null;
    
    
    /***
        Return the Lime.Application object
     **/
    function getApplication() {
        return eval(m_strGetLimeExpression);
    }
    
    /***
        Initializes the error info and must be called before ErrorInfo.show.
     **/
    ErrorInfo.init = function (strGetLimeExpression) {
        if (strGetLimeExpression != undefined && strGetLimeExpression != null && strGetLimeExpression.length > 0)
            m_strGetLimeExpression = strGetLimeExpression;
        else
            m_strGetLimeExpression = "window.external;";   
    }
    
    /***
        Displays an error message and displays the source if is specified either through strSource
        or pError.source.
     **/
    ErrorInfo.showError = function (pError, strSource) {
        var pApplication = null;
        var strLocale = ""
        var strAlert = "";
        
        pApplication = getApplication();
        pApplication.MousePointer = 0;
        
        strAlert = pError.message;
        
        // If we have a source we regard the error as an actual error. Otherwise it's a custom
        // error intended to inform the user
        if (pError.type == undefined || pError.type != "custom") {
            if (pError.source != undefined && pError.source.length > 0)
                strSource = pError.source;
                
            if (strSource != undefined && strSource.length > 0) {
                strLocale = pApplication.Locale.toLowerCase();
            
                switch (strLocale)
                {
                case "sv":
                    strAlert += "\n\nKälla: " + strSource;
                    break;
                default:
                    strAlert += "\n\nSource: " + strSource;
                    break;
                }
            }
        }
        
        alert (strAlert);
    }

    /***
        Throws an existing error object and appends a source if one doesn't already exist.
     **/
    ErrorInfo.throwAgain = function (pError, strSource) {
        if (strSource != undefined && strSource.length > 0) {
            if (pError.type == undefined || pError.type != "custom") {
                if (pError.source == undefined || pError.source.length == 0)
                    pError.source = strSource;
            }
        }
            
        throw pError;
    }

    /***
        Creates and throws a new error object and append a source if one is specified.
     **/
    ErrorInfo.throwNew = function (strMessage, strSource) {
        var pError = new Error(strMessage);
        
        if (strSource != undefined && strSource.length > 0)
            pError.source = strSource;
        else
            pError.type = "custom";

        throw pError;
    }
    
}) ();