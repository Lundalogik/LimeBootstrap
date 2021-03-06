Attribute VB_Name = "lbsHelper"

' NOTE THAT THE CODE IN THIS MODULE IS A PART OF THE LIME CRM BASE SOLUTION AND MAY NOT BE CHANGED.
' ANY CUSTOMIZATIONS OR ADDED FUNCTIONALITY SHOULD BE DONE IN SEPARATE FORMS, MODULES AND CLASS MODULES.
' IF YOU CHOOSE TO IGNORE THIS WARNING AND CHANGE THE CODE IN THIS MODULE, SUPPORT OR VERSION COMPATIBILITY IS
' NO LONGER GUARANTEED.
'
' //The Lime CRM Base Solution group at Lime Technologies

Option Explicit
Private locAvalibleActionpads As Scripting.Dictionary

'=============================================
' Sets correct actionpad settings for all inspectors and the main AP
'
' Param "bPublishable" changes settings to a publishable version as
' the settings are not supported by the client GUI in the current versions
'=============================================
Public Sub setDefaultActionpads(Optional ByVal bPublishable As Boolean = False)
On Error GoTo ErrorHandler

    Dim oClass As LDE.Class
    Dim bShouldExist As Boolean
    Dim oFiles As Scripting.Dictionary
    
    'get avalible actionpad files
    Set oFiles = lbsHelper.getAvaliableActionpads
    
    'set inspector actionpads
    For Each oClass In ThisApplication.Database.Classes
        bShouldExist = oFiles.Exists(oClass.Name)
        Call lbsHelper.setDefaultActionpad(oClass.Name, bShouldExist, bPublishable)
    Next oClass
    
    'set main actionpad
    Call lbsHelper.setDefaultActionpad("index", True, bPublishable)

Exit Sub
ErrorHandler:
    Call LC_UI.ShowError("LBSHelper.setDefaultActionpads")
End Sub

'=============================================
' Wrapper for "setActionpads" with "publishable" set to true
'=============================================
Public Sub setDefaultActionpadsPublishable()
On Error GoTo ErrorHandler

    Call lbsHelper.setDefaultActionpads(True)

Exit Sub
ErrorHandler:
    Call LC_UI.ShowError("LBSHelper.setDefaultActionpadsPublishable")
End Sub

'=============================================
' Apply settings for a specific actionpad
' Removed actionpad if "bShouldExist" is false
' Sets without get params if "bPublishable" is true
'=============================================
Public Sub setDefaultActionpad(ByVal sClass As String, ByVal bShouldExist As Boolean, Optional ByVal bPublishable As Boolean = False)
On Error GoTo ErrorHandler

    Dim oSettings As LDE.Settings
    Dim sInspectorGUID As String
    Dim sUrlBase As String
    Dim sUrlSuffix As String
    Dim sURL As String
    Dim lVisible As Long
    
    sUrlBase = ThisApplication.WebFolder + "lbs.html"
    sUrlSuffix = IIf(bPublishable, "", "?ap=" + sClass)
    sURL = IIf(bShouldExist, sUrlBase + sUrlSuffix, "")
    lVisible = IIf(VBA.Len(sURL) > 0, 1, 0)
    
    'index gets special treetment as it is not reloaded frequently and handle is avalible
    If sClass = "index" Then
        ThisApplication.WebBar.url = sURL
    'normal inspector AP
    Else
        'find inspector GUID
        sInspectorGUID = Database.Classes(sClass).GUID
        'find inspector settings
        Set oSettings = ThisApplication.Database.Settings.Item("Inspectors")
        'check if inspector of the shoosen class exists
        If oSettings.Exists(sInspectorGUID) Then
            'write url and visible property
            Call oSettings.Item(sInspectorGUID + "\WebBar").Write("URL", sURL)
            Call oSettings.Item(sInspectorGUID + "\WebBar").Write("Visible", lVisible)
        End If
    End If

Exit Sub
ErrorHandler:
    Call LC_UI.ShowError("LBSHelper.setDefaultActionpad")
End Sub


'=============================================
' Set actionpad url with params
'=============================================
Public Sub setActionpad(ByRef oInspector As Lime.Inspector)
On Error GoTo ErrorHandler

    Dim sUrlBase As String
    Dim sUrlSuffix As String
    Dim sURL As String
    Dim lVisible As Long
    Dim sClass As String
    
    sClass = oInspector.Class.Name
    
    sUrlBase = ThisApplication.WebFolder + "lbs.html"
    sUrlSuffix = "?ap=" + sClass + "&db=" + ThisApplication.DatabaseName
    sURL = IIf(locAvalibleActionpads.Exists(sClass), sUrlBase + sUrlSuffix, "")
    lVisible = IIf(VBA.Len(sURL) > 0, 1, 0)
    
    'index gets special treetment as it is not reloaded frequently and handle is avalible
    If sClass = "index" Then
        ThisApplication.WebBar.url = sURL
    'normal inspector AP
    Else
        oInspector.WebBar.url = sURL
        oInspector.WebBar.Visible = lVisible
    End If
    
    Debug.Print (sURL)

Exit Sub
ErrorHandler:
    Call LC_UI.ShowError("LBSHelper.setActionpad")
End Sub

'=============================================
' Collects all avalible actionpad views in a dictionary
'=============================================
Public Function getAvaliableActionpads() As Scripting.Dictionary
On Error GoTo ErrorHandler
    
    Dim sFileName As String
    Dim sClassName As String
    Dim oFiles As New Scripting.Dictionary
    
    If (locAvalibleActionpads Is Nothing) Then
    
        sFileName = Dir(ThisApplication.WebFolder + "\*.html")
        Do While Len(sFileName) > 0
            sClassName = VBA.Left(sFileName, VBA.Len(sFileName) - 5)
            'dont add the aplication entrypoint
            If sClassName <> "lbs" Then
                Call oFiles.Add(sClassName, sClassName)
            End If
            sFileName = Dir
        Loop
        
        Set locAvalibleActionpads = oFiles
    End If
        
    Set getAvaliableActionpads = locAvalibleActionpads
    
Exit Function
ErrorHandler:
    Call LC_UI.ShowError("LBSHelper.getAvaliableActionpads")
End Function

'=============================================
' Load file as if from webserver
'=============================================
Public Function loadHTTPResource(filePath As String) As String
    On Error GoTo ErrorHandler
    Dim oXHTTP As Object
    Dim s As String
    Set oXHTTP = CreateObject("MSXML2.XMLHTTP")
    oXHTTP.Open "GET", WebFolder + filePath, False
    oXHTTP.Send
    loadHTTPResource = oXHTTP.responseText
Exit Function
ErrorHandler:
    loadHTTPResource = ""
End Function

'=============================================
' Load JSON as if from webserver
'=============================================
Public Function loadFromREST(WebPath As String) As String
    On Error GoTo ErrorHandler
    Dim oXHTTP As Object
    Dim s As String
    Set oXHTTP = CreateObject("MSXML2.XMLHTTP")
    oXHTTP.Open "GET", WebPath, False
    oXHTTP.Send
    loadFromREST = oXHTTP.responseText
Exit Function
ErrorHandler:
    loadFromREST = ""
End Function

Private Function DecodeBase64(ByVal strData As String) As Byte()
    Dim objXML As Object
    Dim objNode As Object
    
    Set objXML = CreateObject("MSXML2.DOMDocument")
    Set objNode = objXML.createElement("b64")
    objNode.DataType = "bin.base64"
    objNode.text = strData
    DecodeBase64 = objNode.nodeTypedValue
    
    Set objNode = Nothing
    Set objXML = Nothing
End Function

Public Sub saveFile(filePath As String, Content As String)
    Dim File As String
    Dim toWrite As String
    Dim fnum1 As Variant
    toWrite = StrConv(DecodeBase64(Content), vbUnicode)
    File = WebFolder & filePath
    fnum1 = FreeFile()
    Open File For Output As #fnum1
    Print #fnum1, toWrite
    Close #fnum1
End Sub

'=============================================
' Load XML from SOAP webservice
'=============================================
Public Function loadFromSOAP(WebPath As String, SOAPAction As String, XML As String) As String
    On Error GoTo ErrorHandler
    Dim oXHTTP As MSXML2.XMLHTTP60
    Dim s As String
      Set oXHTTP = New MSXML2.XMLHTTP60
        ' POST
        Call oXHTTP.Open("POST", WebPath, False)
        ' Content-Type
        Call oXHTTP.setRequestHeader("Content-Type", "text/xml; charset=utf-8")
        ' SOAPAction
        Call oXHTTP.setRequestHeader("SOAPAction", SOAPAction)
        'Get RequestXML
    
        Call oXHTTP.Send(XML)
    
   
    loadFromSOAP = oXHTTP.responseText
Exit Function
ErrorHandler:
    loadFromSOAP = ""
End Function

'=============================================
' Load Xml from storedProcedure
'=============================================
Public Function loadXmlFromStoredProcedure(ProcedureName As String) As String
    On Error GoTo ErrorHandler
    Dim sXml As String
    Dim oProcedure As LDE.Procedure
    Set oProcedure = Application.Database.Procedures.Lookup(ProcedureName, lkLookupProcedureByName)
    oProcedure.Parameters("@@lang").InputValue = Database.Locale
    oProcedure.Parameters("@@idcoworker").InputValue = ActiveUser.Record.ID
    Call oProcedure.Execute(False)
    sXml = oProcedure.result
    loadXmlFromStoredProcedure = sXml
Exit Function
ErrorHandler:
    loadXmlFromStoredProcedure = ""
End Function

'=============================================
' Load related record
'=============================================
Public Function loadRelatedRecord(sClass As String, lId As Long, Optional sViewString As String) As LDE.Record
    On Error GoTo ErrorHandler
    
    Dim oRecords As New LDE.Records
    Dim oView As New LDE.View
    Dim oFilter As New LDE.Filter
    Dim sViewItem As Variant

    Call oFilter.AddCondition("id" & sClass, lkOpEqual, lId)

    For Each sViewItem In Split(sViewString, ";", -1, vbTextCompare)
        Call oView.Add(sViewItem)
    Next sViewItem
    
    Call oRecords.Open(Database.Classes(sClass), oFilter, oView, 1)
    
    If oRecords.Count = 1 Then
        Set loadRelatedRecord = oRecords.Item(1)
    Else
        Set loadRelatedRecord = Nothing
    End If
    
Exit Function
ErrorHandler:
    Set loadRelatedRecord = Nothing
End Function


'=============================================
' test
'=============================================
Public Function test() As LDE.Record
    On Error GoTo ErrorHandler
    
    Set test = ActiveInspector.Record
    
Exit Function
ErrorHandler:
    Call LC_UI.ShowError("test")
End Function

'=============================================
' Add translation to db
'=============================================
Public Sub CreateUpdateTranslation(ByVal sOwner As String, ByVal sCode As String, ByVal sLocalName As String, ByVal sLanguage As String)
    On Error GoTo ErrorHandler
    Dim oFilter As New LDE.Filter
    Dim oView As New LDE.View
    Dim oRecord As New LDE.Record

    If Application.Classes("localize").Fields.Exists(sLanguage) = False Then
        Call Application.MessageBox("F�ltet '" & sLanguage & "' finns inte i tabellen '" & Application.Classes("localize").LocalName & "'.")
        Exit Sub
    End If

    Call oFilter.AddCondition("owner", lkOpEqual, sOwner)
    Call oFilter.AddCondition("code", lkOpEqual, sCode)
    Call oFilter.AddOperator(lkOpAnd)

    Call oView.Add("owner")
    Call oView.Add("code")
    Call oView.Add(sLanguage)

    If oFilter.hitCount(Application.Classes("localize")) = 1 Then
        Call oRecord.Open(Application.Classes("localize"), oFilter, oView)
        oRecord.Value(sLanguage) = sLocalName
        oRecord.Update
    Else
        Set oRecord = New LDE.Record
        Call oRecord.Open(Application.Classes("localize"))
        oRecord.Value("owner") = sOwner
        oRecord.Value("code") = sCode
        oRecord.Value(sLanguage) = sLocalName
        oRecord.Update
    End If

    Exit Sub
ErrorHandler:
    Call LC_UI.ShowError("CreateUpdateTranslation")
End Sub

'=============================================
' Log to Lime CRM infolog tab.
' logType should be one of: "info", "warning" or "error".
'=============================================
Public Sub logToInfolog(strType As String, message As String)
    On Error GoTo ErrorHandler
    
    Dim lngType As Long
    If strType = "info" Then
        lngType = lkLogTypeInformation
    ElseIf strType = "warning" Then
        lngType = lkLogTypeWarning
    ElseIf strType = "error" Then
        lngType = lkLogTypeError
    Else
        lngType = lkLogTypeInformation
    End If
    
    ' Change back to , instead of !@! and ' instead of %&%
    message = VBA.Replace(message, "!@!", ",")
    message = VBA.Replace(message, "%&%", "'")
    
    Call Application.Log.Add(lngType, "Lime Bootstrap", "JavaScript", , message)
    
    Exit Sub
ErrorHandler:
    Call LC_UI.ShowError("LBSHelper.logToInfolog")
End Sub
Public Function getActiveUser() As String
On Error GoTo ErrorHandler
    
    Dim sActiveUserJSON As String
    Dim sGroups As String
    Dim sGroupsTrimed As String
    Dim group As Object
    
    For Each group In ActiveUser.MemberOfGroups
        sGroups = sGroups + "{""Name"":""" + group.Name + """},"
    Next group
    
    sGroupsTrimed = Left(sGroups, Len(sGroups) - 1)
    
    sActiveUserJSON = "{""ActiveUser"": {""Name"":" + """" + ActiveUser.Name + """" + ", ""ID"":" + CStr(ActiveUser.ID) + ", ""isAdmin"":" + LCase(CStr(ActiveUser.Administrator)) + ", ""isSuperUser"":" + LCase(CStr(ActiveUser.SuperUser)) + "," & _
    """Groups"":[" + sGroupsTrimed + " ]}" & _
    "}"
        
    getActiveUser = sActiveUserJSON
    Exit Function
ErrorHandler:
    Call LC_UI.ShowError("LBSHelper.getActiveUser")
End Function

Public Function Log(sMsg)
    Debug.Print sMsg
End Function


