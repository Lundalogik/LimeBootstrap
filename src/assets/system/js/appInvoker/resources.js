var Resources = null;

(function() {
    if (Resources == null)
        Resources = new Object();
        
    /*
        Constants
    */
        var lkResourceTypeAll = 0;
        var lkResourceTypeLanguage = 1;
        var lkResourceTypeIniFile = 2;

    /*
        Member variables
    */
        var m_strGetLimeExpression = null;
        var m_strApplication = null;


    /*
        A wrapper for the method Application.Resources.GetText
        
        Parameters:
            strId - Specified both section and id like in "mysection.myid". If the text doesn't belong to
                    a section then the dot must also be omitted like in "myid".
            strP1 - Will replace all occurrences of %1 in the requested text.
            strP2 - Will replace all occurrences of %2 in the requested text.
            strP3 - Will replace all occurrences of %3 in the requested text.
            strP4 - Will replace all occurrences of %4 in the requested text.
            
        Comment:
            The method will use the same application name as was specified on the call to inializeResources 
            and the locale of the current Lime session.
    */
    Resources.getText = function (strId, strP1, strP2, strP3, strP4) {
        var strSection = "";
        var nIndexOf = 0;

        if (strId == undefined)
            strId = "";
        
        if (strP1 == undefined)
            strP1 = "";
        
        if (strP2 == undefined)
            strP2 = "";
            
        if (strP3 == undefined)
            strP3 = "";
            
        if (strP4 == undefined)
            strP4 = "";
        
        nIndexOf = strId.indexOf(".");
        
        if (nIndexOf >= 0) {
            strSection = strId.substring(0, nIndexOf);
            strId = strId.substring(nIndexOf + 1);
        }
            
        return getResourceApplication().Resources.GetText(m_strApplication, strId, strSection, strP1, strP2, strP3, strP4);
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
    Resources.getIniString = function (strSection, strId, strDefault) {
        if (strDefault == undefined)
            strDefault = "";
      
        return getResourceApplication().Resources.GetIniString(m_strApplication, strSection, strId, strDefault);
    }

    /*
        Returns the Lime application from the dialog arguments.
    */
    function getResourceApplication() {
        return eval(m_strGetLimeExpression);
    }

    /**
        Adds the applications resources to the resource continer in Lime.
        
        Parameters:
            strApplication - The name of the application. The resourcefiles are assumed to
                             have the same name as the application.
            strGetLimeExpression - A javascript expression to get the Lime application. If non is specified
                                   window.external will be used
        Comment:
            The method assumes that the resources are located in the parent folder of the folder 
            where this application resides.
     **/
    Resources.initializeResources = function (strApplication, strGetLimeExpression) {
        var pApplication = null;
        var strFolder = "";
        var strLangFile = "";
        var strIniFile = "";
        var nIndexOf = 0;
        
        if (strGetLimeExpression != undefined && strGetLimeExpression != null && strGetLimeExpression.length > 0)
            m_strGetLimeExpression = strGetLimeExpression;
        else
            m_strGetLimeExpression = "window.external;";
            
        pApplication = getResourceApplication();
        m_strApplication = strApplication;
        
        // Uncomment this line to always reload the resources
        pApplication.Resources.Remove(strApplication, lkResourceTypeAll);
        
        if (!pApplication.Resources.Exists(strApplication, lkResourceTypeAll)) {
            
            strFolder = window.location.href.toLowerCase();
            nIndexOf = strFolder.lastIndexOf("/");
            
            strFolder = strFolder.substring(0, nIndexOf);
            
            nIndexOf = strFolder.lastIndexOf("/");
            strFolder = strFolder.substring(0, nIndexOf);
            
            strLangFile = strFolder + "/" + strApplication + ".lng"
            strIniFile = strFolder + "/" + strApplication +  ".ini"
			
			// fix for network path roaming profiles
            netPathAdd = "";
            if(strFolder.match(/file:\/\/\/[a-z]:/g) == null) // we have a network drive path, add the missing two backslashes
            {
                netPathAdd = "\\\\";
            }
            pApplication.Resources.Add(netPathAdd + strLangFile, strApplication, lkResourceTypeLanguage);
            pApplication.Resources.Add(netPathAdd + strIniFile, strApplication, lkResourceTypeIniFile);
        }
        
        Resources.localizeDocument();
    }

    /*
        Sets regional text on all nodes in pNodes and its child nodes that contains the attribute "resid".
        
        Parameters:
            pNodes - The node collection to localize. Will call this method recursively for each child node 
                     collection that contains items.
    */
    function localizeAllDocumentNodes(pNodes) {
        var pNode = null;
        var nIndex = 0;

        for (nIndex = 0; nIndex < pNodes.length; nIndex++) {
            pNode = pNodes[nIndex];
            
            try {
                if (pNode.resid != undefined)
                    pNode.innerHTML = Resources.getText(pNode.resid);
            }
            catch (pError) {
            }
             
            try {   
                if (pNode.title != undefined && pNode.title.length > 0)
                    pNode.title = Resources.getText(pNode.title);
            }
            catch (pError) {
            }
            
            if (pNode.childNodes != null && pNode.childNodes.length > 0)
                localizeAllDocumentNodes(pNode.childNodes);
        }
    }

    /*
        Sets regional text on all nodes in the document
    */
    Resources.localizeDocument = function () {
        // Get the window title which must be stored as appname.windowTitle
        var strWindowTitle = Resources.getText(m_strApplication + ".windowTitle");

        if (strWindowTitle != "windowTitle")
            document.title = strWindowTitle;
        
        localizeAllDocumentNodes(document.documentElement.childNodes);
    }
}) ();