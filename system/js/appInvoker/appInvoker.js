

var Invoker = null;

(function() {
    if (Invoker == null)
        Invoker = new Object();

/*
    Constants
 */
    var appInvokerVersion = ""


    var lkResourceTypeAll = 0;
    var lkResourceTypeLanguage = 1;
    var lkResourceTypeIniFile = 2;


/*
    Member variables
 */
    // We need a global reference to the application to support
    // modal dialogs
    var m_pApplication = null;

    Invoker.Application = function () {
        return m_pApplication;
    }


    /*
        Adds included script files to the head tag
    */
    function addIncludeFiles (strApplication) {
        var pHeadTag = null;
        var pNewTag = null;
        var strSrc = "";
        var strExtension = "";
        var nIndex = 0;
        var nIndexOf = 0;

        pHeadTag = document.getElementsByTagName("head")[0];

        strSrc = Invoker.getIniString(strApplication, "Includes", "src-" + nIndex, "");

        while (strSrc.length > 0) {
            pNewTag = null;

            nIndexOf = strSrc.lastIndexOf(".");
            strExtension = strSrc.substring(nIndexOf + 1).toLowerCase();

            switch (strExtension)
            {
            case "js":
                if (!isFileIncluded("script", strSrc)) {
                    pNewTag = document.createElement("script");
                    pNewTag.type = "text/javascript";
                    pNewTag.language = "javascript";
                    pNewTag.src = strSrc;
                }

                break;
            case "vbs":
                if (!isFileIncluded("script", strSrc)) {
                    pNewTag = document.createElement("script");
                    pNewTag.type = "text/vbscript";
                    pNewTag.language = "vbscript";
                    pNewTag.src = strSrc;
                }

                break;
            case "css":
                if (!isFileIncluded("link", strSrc)) {
                    pNewTag = document.createElement("link");
                    pNewTag.rel = "stylesheet";
                    pNewTag.type = "text/css";
                    pNewTag.href = strSrc;
                    pNewTag.media = "screen";
                }

                break;
            }

            if (pNewTag != null)
               pHeadTag.appendChild(pNewTag);

            nIndex += 1;
            strSrc = Invoker.getIniString(strApplication, "Includes", "src-" + nIndex, "");
        }
    }


    /*
        Compares required version to current Lime version
    */
    Invoker.compareVersions = function (strRequired) {
        var strLocale = "";
        var strError = "";

        if (getComparableVersion(window.external.Version) < getComparableVersion(strRequired)) {
            strLocale = window.external.Locale.toLowerCase();

            switch (strLocale)
            {
            case "sv":
                strError = "Applikation kräver Lime version " + strRequired + " eller nyare.";
                break;
            default:
                strError = "The application requires Lime version " + strRequired + " or better.";
                break;
            }

            throw new Error(strError);
        }
    }

    /*
        Returns the version in a comparable format.
    */
    function getComparableVersion (strVersion) {
        var nMajor = 0;
        var nMinor = 0;
        var nBuild = 0;
        var nIndex = 0;
        var strLocale = "";
        var strError = "";

        strVersion = strVersion.split(".");

        for (nIndex = 0; nIndex < strVersion.length && nIndex < 3; nIndex++) {
            if (!isNaN(strVersion[nIndex])) {
                if (nIndex == 0)
                    nMajor = parseInt(strVersion[nIndex]) * 10000;
                else if (nIndex == 1)
                    nMinor = parseInt(strVersion[nIndex]) * 1000;
                else if (nIndex == 2)
                    nBuild = parseInt(strVersion[nIndex]);
            }
            else {
                strLocale = window.external.Locale;

                switch (strLocale.toLowerCase())
                {
                case "sv":
                    strError = "Det angivna versionnumret har ett felaktigt format.";
                    break;
                default:
                    strError = "Invalid format of the specified version.";
                    break;
                }

                throw new Error(strError);
            }
        }

        return nMajor + nMinor + nBuild;
    }

    /*
        A wrapper for the method Application.Resources.GetText

        Parameters:
            strId - Specified both section and id like in "mysection.myid". If the text doesn't belong to
                    a section then the dot must also be omitted like in "myid".
    */
    Invoker.getText = function (strApplication, strId) {
        var strSection = "";
        var nIndexOf = 0;

        if (strId == undefined)
            strId = "";

        nIndexOf = strId.indexOf(".");

        if (nIndexOf >= 0) {
            strSection = strId.substring(0, nIndexOf);
            strId = strId.substring(nIndexOf + 1);
        }

        return window.external.Resources.GetText(strApplication, strId, strSection);
    }

    /*
        A wrapper for the method Application.Resources.GetIniString

        Parameters:
            strSection - The section where to look for the requested setting.
            strId - The id of the requested setting.
            strDefault - The default value to be used if the requested setting doesn't exist.

        Comment:
            The method will use the same application name as was specified on the call to inializeResources.

    */
    Invoker.getIniString = function (strApplication, strSection, strId, strDefault) {
        if (strDefault == undefined)
            strDefault = "";

        return window.external.Resources.GetIniString(strApplication, strSection, strId, strDefault);
    }

    /**
        Adds the applications resources to the resource continer in Lime.

        Parameters:
            strApplication - The name of the application. The resourcefiles are assumed to
                             have the same name as the application.

        Comment:
            The method assumes that the resources are located in the parent folder of the folder
            where this application resides.
     **/
    function initializeResources (strApplication) {
        var pApplication = window.external;
        var strFolder = "";
        var strLangFile = "";
        var strSystemLangFile = "";
        var strUserLangFile = "";
        var strIniFile = "";


        // Uncomment this line to always reload the resources
        pApplication.Resources.Remove(strApplication, lkResourceTypeAll);

        try
        {

            strFolder = pApplication.WebFolder + "apps/" + strApplication + "/";
            strIniFile = strFolder + strApplication +  ".ini";
            strUserLangFile = strFolder + strApplication + ".lng";
            strSystemLangFile = strFolder + "src/" + strApplication + ".lng";

            if (getComparableVersion(window.external.Version) >= getComparableVersion("10.3.3"))
            {
                // Lime "10.3.3" or later -> check if file exists before it is added

                if (pApplication.Resources.FileExists(strIniFile))
                    pApplication.Resources.Add(strIniFile, strApplication, lkResourceTypeIniFile);

                if (pApplication.Resources.FileExists(strSystemLangFile))
                {
                    pApplication.Resources.Add(
                        strSystemLangFile, strApplication, lkResourceTypeLanguage);

                    if (pApplication.Resources.FileExists(strUserLangFile))
                        pApplication.Resources.Add(
                            strUserLangFile, strApplication + "-user", lkResourceTypeLanguage);
                }
                else if (pApplication.Resources.FileExists(strUserLangFile))
                {
                    pApplication.Resources.Add(
                        strUserLangFile, strApplication, lkResourceTypeLanguage);
                }
            }
            else
            {
                // Lime 10.2 or earlier -> check if files using a try/catch
                if (!pApplication.Resources.Exists(strApplication, lkResourceTypeAll)) {
                    Invoker.addFileToResources(strIniFile, strApplication, lkResourceTypeIniFile);

                    Invoker.addFileToResources(
                        strSystemLangFile, strApplication, lkResourceTypeLanguage);
                    Invoker.addFileToResources(
                        strUserLangFile, strApplication + "-user", lkResourceTypeLanguage);
                }
            }
        }
        catch (pError) {
            throw pError;
        }
    }

    Invoker.addFileToResources = function(filename, applicationName, lkResourceType) {
        try
        {
            window.external.Resources.Add(filename, applicationName, lkResourceType);
        }
        catch (errror)
        {
            // be silent. the file was probably not found.

        }
    }
    
    /**
	        Closes the active pane unless it's the first. If only the first pane remains
	        after the active is closes and has no url, then the panes will be hidden
	     */
	    Invoker.removeActivePane = function (pApplication) {
	        if (pApplication.Panes.ActivePane != pApplication.Panes.Item(1)) {
	            pApplication.Panes.Remove(pApplication.Panes.ActivePane);
	            
	            if (pApplication.Panes.Count == 1 && pApplication.Panes.Item(1).URL.length == 0)
	                pApplication.Panes.Visible = false;
	        }
    }

    /**
        A helper method that displays specified relative url in the navigator pane in Lime. It will
        also make sure the navigator is visible and activated.

        The method assumes that the specified path is relative to Actionpads\apps\[appname]\src\
        and if not the method will fail.

        Parameters
        strApplication - The name of the application
        strHtmlPath    - Is a relative path and must be relative to the path Actionpads\apps\[appname]\src\
    **/
    Invoker.showAppInNavigatorPane = function (strApplication, strHtmlPath) {
        var pApplication = window.external;
        var strAbsolutUrl = pApplication.WebFolder + "apps\\" + strApplication + "\\src\\" + strHtmlPath;

        if (!pApplication.Panes.Visible)
            pApplication.Panes.Visible = true;

        if (pApplication.Panes.ActivePane != pApplication.Panes.Item(1))
            pApplication.Panes.ActivePane = pApplication.Panes.Item(1);

        pApplication.Panes.Item(1).URL = strAbsolutUrl;
    }

    /**
        A helper method that displays the application in its own pane. If the pane doesn't exist it will
        be created and it will make sure the panes are visible and activate the correct one.

        The method assumes that the specified url:s for html and icon are relative to Actionpads\apps\[appname]\src\
        and if not the method will fail.

        Parameters
        strApplication  - The name of the application
        strIdCaption    - Id for the language text to use as caption for the pane. Must be formatted
                          as [section.id]. Please note that the caption also is the key for the pane.
        strHtmlUrl      - Is a relative path and must be relative to the path Actionpads\apps\[appname]\src\
        strIconUrl      - Is a relative path and must be relative to the path Actionpads\apps\[appname]\src\. If
                          omitted no icon will be displayed
    **/
    Invoker.showAppInNewPane = function (strApplication, strIdCaption, strHtmlPath, strIconPath) {
        var pApplication = null;
        var pPane = null;
        var strAbsHtmlPath = "";
        var strAbsIconPath = "";
        var strCaption = "";

        pApplication = window.external;

        strCaption = Invoker.getText(strApplication, strIdCaption);
        strAbsHtmlPath = pApplication.WebFolder + "apps\\" + strApplication + "\\src\\" + strHtmlPath;

        // Add pane if needed
        if (!pApplication.Panes.Exists(strCaption)) {
            if (strIconPath.length > 0)
                strAbsIconPath = pApplication.WebFolder + "apps\\" + strApplication + "\\src\\" + strIconPath;

            // Add the pane but do not display anything just yet
            pPane = pApplication.Panes.Add(strCaption, strAbsIconPath, "", 2);
        }
        else
            pPane = pApplication.Panes.Item(strCaption);

        // Activate the pane and add or update it's content
        if (pPane != null) {
            if (!pApplication.Panes.Visible)
                pApplication.Panes.Visible = true;

            if (pApplication.Panes.ActivePane != pPane)
                pApplication.Panes.ActivePane = pPane;

            pPane.URL = strAbsHtmlPath;
        }
    }

    /**
        Validated that current Lime version meets the applications requirements and
        evaluates all validation expressions specified by the application ini-file.

        If any of the expressesions fails (return false) the message associated with the expressesion
        will be displayed and the application will not be invoked.
        If no message is specified the message "Validation failed" will be displayed.
    **/
    function validateApplication (strApplication) {
        var strRequired = "";
        var strSrc = "";
        var strText = "";
        var strLocale = "";
        var nIndex = 0;

        // Validate required version
        strRequired = Invoker.getIniString(strApplication, "Application", "requiredversion", "");

        if (strRequired.length > 0)
            Invoker.compareVersions(strRequired);

        strSrc = Invoker.getIniString(strApplication, "Validations", "validationsrc-" + nIndex, "");

        while (strSrc.length > 0) {
            if (!eval(strSrc)) {
                strText = Invoker.getIniString(strApplication, "Validations", "validationtext-" + nIndex, "");

                if (strText.length > 0) {
                    strText = Invoker.getText(strApplication, strText);
                }
                else if (strText.toLowerCase() != "nomessage") {
                    strLocale = window.external.Locale;

                    switch (strLocale.toLowerCase())
                    {
                    case "sv":
                        strText = "Valideringen misslyckades och applikationen kan inte köras.";
                        break;

                    default:
                        strText = "Cannot start the application since the validation failed.";
                        break;
                    }
                }

                throw new Error(strText);
            }

            nIndex += 1;
            strSrc = Invoker.getIniString(strApplication, "Validations", "validationsrc-" + nIndex, "");
        }
    }

    /**
    **/
    function isFileIncluded(strTagName, strSrc) {
        var pTags = null;
        var nIndex = 0;

        pTags = document.getElementsByTagName(strTagName);

        for (nIndex = 0; nIndex < pTags.length; nIndex++) {
            if (pTags[nIndex].src != undefined && pTags[nIndex].src == strSrc)
                return true;
        }

        return false;
    }

    /*
        Initializes, validated and invokes an application.

        It is assumed that the actionpad calling this function is located at the root of the
        actionpad folder. It is also assumed that the application is located in /apps/[ApplicationName]
        and that this folder contains [ApplicationName].ini and [ApplicationName].lng
    */
    Invoker.invokeWebApplication = function (strApplication) {
        try {
            // Lime must be 10.1.138 or better to support resources
            Invoker.compareVersions("10.1.138");

            initializeResources(strApplication);
            addIncludeFiles(strApplication);
            validateApplication(strApplication);

            if (m_pApplication == null)
                m_pApplication = window.external;

            // Startup application
            eval (Invoker.getIniString(strApplication, "Application", "exec"));

        }
        catch (pError) {
            if (pError.message.toLowerCase() != "nomessage")
                alert (pError.message);
        }

        if (m_pApplication != null)
            m_pApplication = null;
    }

    /*

    */
    Invoker.invokeWebMethod = function (strApplication, strMethod, nValidate) {
        var strExpression = "";
        var strLocale = "";

        try {
            // Lime must be 10.1.138 or better to support resources
            Invoker.compareVersions("10.1.138");

            if (nValidate == undefined)
                nValidate = 1;

            // Make sure the resources are initialized and that files are included
            initializeResources(strApplication);
            addIncludeFiles(strApplication);

            strExpression = Invoker.getIniString(strApplication, "Methods", strMethod, "");

            if (strExpression.length > 0) {
                if (parseInt(nValidate) != 0)
                    validateApplication(strApplication);

                eval (strExpression);
            }
            else {
                strLocale = window.external.Locale;

                switch (strLocale.toLowerCase())
                {
                case "sv":
                    throw new Error("Det gick inte att exekvera metoden '" + strMethod + "'.");
                    break;

                default:
                    throw new Error("Failed to execute the method '" + strMethod + "'.");
                    break;
                }
            }
        }
        catch (pError) {
            if (pError.message.toLowerCase() != "nomessage")
                alert (pError.message);
        }
    }

}) ();
