Attribute VB_Name = "vip"

Private Const BaseURL As String = "http://limebootstrap.lundalogik.com"
Private Const ApiURL As String = "/api/apps/"

Public Sub Install(AppName As String)
    Dim sJSON As String
    Dim oJSON As Object
    Dim oInstall As Object
    Dim vba As Object
    
    If Dir(WebFolder + "package.json") = "" Then
        Debug.Print "No package.json found, assuming fresh install"
        Call InstallVIP
    End If

    Debug.Print "Looking for package: " + AppName
    sJSON = getJSON(BaseURL + ApiURL + AppName + "/")
    Set oJSON = parseJSON(sJSON)
    If Not oJSON.Item("error") = "" Then
        Debug.Print AppName + " package not found!"
        Exit Sub
    End If
    If oJSON.Item("info").Item("install") Is Nothing Then
        Debug.Print "Package has no valid install instructions!"
        Exit Sub
    End If
    Set oInstall = oJSON.Item("info").Item("install")
    
    Debug.Print AppName + " package found. Downloading..."
    
    Call DownloadFile(AppName)
    Call Unzip(AppName)
    
    Debug.Print "Download complete!"
    
    If Not oInstall.Item("localize") Is Nothing Then
        Debug.Print "Adding localizations..."
        Call addLocalize(oInstall.Item("localize"))
    End If
    
    If Not oInstall.Item("vba") Is Nothing Then
        Debug.Print "Adding VBA functions..."
        Call InstallVBAComponents(AppName, oInstall.Item("vba"))
    End If
    
    Debug.Print "Install of " + AppName + " done!"

End Sub

Private Function getJSON(sURL As String) As String
On Error GoTo ErrorHandler
    Dim qs As String
    qs = CStr(Rnd() * 1000000#)
    Dim oXHTTP As Object
    Dim s As String
    Set oXHTTP = CreateObject("MSXML2.XMLHTTP")
    oXHTTP.Open "GET", sURL + "?" + qs, False
    oXHTTP.Send
    getJSON = oXHTTP.responseText
Exit Function
ErrorHandler:
    getJSON = ""
End Function

Private Function parseJSON(sJSON As String) As Object
    Dim oJSON As Object
    Set oJSON = JSON.parse(sJSON)
    Set parseJSON = oJSON
End Function

Private Sub addLocalize(oJSON As Object)

    Dim Localize As Object
        
    For Each Localize In oJSON
        Call lbsHelper.AddOrCheckLocalize( _
            Localize.Item("owner"), _
            Localize.Item("context"), _
            "", _
            Localize.Item("en_us"), _
            Localize.Item("sv"), _
            Localize.Item("no"), _
            Localize.Item("fi") _
        )
    Next Localize

End Sub


Private Sub DownloadFile(AppName As String)
    Dim qs As String
    qs = CStr(Rnd() * 1000000#)
    Dim downloadURL As String
    downloadURL = BaseURL + ApiURL + AppName + "/download/"
    
    Dim WinHttpReq As Object
    Set WinHttpReq = CreateObject("Microsoft.XMLHTTP")
    WinHttpReq.Open "GET", downloadURL + "?" + qs, False
    WinHttpReq.Send
    
    myURL = WinHttpReq.responseBody
    If WinHttpReq.status = 200 Then
        Set oStream = CreateObject("ADODB.Stream")
        oStream.Open
        oStream.Type = 1
        oStream.Write WinHttpReq.responseBody
        oStream.SaveToFile WebFolder + "apps\" + AppName + ".zip", 2 ' 1 = no overwrite, 2 = overwrite
        oStream.Close
    End If

End Sub

Private Sub Unzip(AppName)
    Dim FSO As Object
    Dim oApp As Object
    Dim Fname As Variant
    Dim FileNameFolder As Variant
    Dim DefPath As String
    Dim strDate As String

    Fname = WebFolder + "apps\" + AppName + ".zip"
    FileNameFolder = WebFolder & "apps\" & AppName & "\"

    On Error Resume Next
    Set FSO = CreateObject("scripting.filesystemobject")
    'Delete files
    FSO.DeleteFile FileNameFolder & "*.*", True
    'Delete subfolders
    FSO.DeleteFolder FileNameFolder & "*.*", True
    
    'Make the normal folder in DefPath
    MkDir FileNameFolder
    
    Set oApp = CreateObject("Shell.Application")
    oApp.Namespace(FileNameFolder).CopyHere oApp.Namespace(Fname).items

End Sub

Private Sub InstallVBAComponents(AppName As String, VBAModules As Object)
    
    Dim VBAModule As Object
        
    For Each VBAModule In VBAModules
        Call addModule(AppName, VBAModule.Item("name"), VBAModule.Item("relPath"))
    Next VBAModule

End Sub

Private Function addModule(AppName As String, ModuleName As String, RelPath As String)

    Dim VBComps As VBIDE.VBComponents
    Dim Path As String
    
    Set VBComps = Application.VBE.ActiveVBProject.VBComponents
    If ComponentExists(ModuleName, VBComps) = True Then
        Call VBComps.Remove(VBComps.Item(ModuleName))
    End If
    Path = WebFolder + "apps\" + AppName + "\" + RelPath
 
    Call Application.VBE.ActiveVBProject.VBComponents.Import(Path)
    
End Function

Private Function ComponentExists(ComponentName As String, VBComps As VBIDE.VBComponents) As Boolean
    Dim VBComp As VBIDE.VBComponent

    For Each VBComp In VBComps
        If VBComp.Name = ComponentName Then
             ComponentExists = True
             Exit Function
        End If
    Next VBComp
    
    ComponentExists = False
    
End Function

Private Sub WriteToPackageFile(AppName, Version)
    Dim oJSON As Object
    
    Set oJSON = ReadPackageFile
    
    oJSON.Item("dependencies").Item(AppName) = Version

    Set fs = CreateObject("Scripting.FileSystemObject")
    Set a = fs.CreateTextFile(WebFolder + "package.json", True)
    a.WriteLine JSON.toString(oJSON)
    a.Close

End Sub

Private Function ReadPackageFile() As Object
    Dim oXHTTP As Object
    Dim s As String
    Set oXHTTP = CreateObject("MSXML2.XMLHTTP")
    oXHTTP.Open "GET", WebFolder + "package.json", False
    oXHTTP.Send
    If oXHTTP.responseText <> "" Then
        Set ReadPackageFile = JSON.parse(oXHTTP.responseText)
    Else
        Set ReadPackageFile = Nothing
    End If
End Function

Sub CreateANewPackageFile()
    Set fs = CreateObject("Scripting.FileSystemObject")
    Set a = fs.CreateTextFile(WebFolder + "package.json", True)
    a.WriteLine "{""dependencies"":{}}"
    a.Close
End Sub

Private Sub InstallVIP()

    Debug.Print "Installing JSON-lib..."
    Call DownloadFile("vba_json")
    Call Unzip("vba_json")
    Call addModule("vba_json", "JSON", "JSON.bas")
    Call addModule("vba_json", "cStringBuilder", "cStringBuilder.cls")
    
    Debug.Print "Creating a new package.json file..."
    Call CreateANewPackageFile
    Call WriteToPackageFile("vba_json", 1)

    Debug.Print "Install of VIP complete!"

End Sub
