@echo off

echo.
echo Chrome campatibility
echo ====================
echo WARNING: This will close all open chrome windows
echo.
echo.

pause

set filepath=%~dp0
set url="%filepath%../../lbs.html"

taskkill /F /IM Chrome.exe /T
start "Chrome" chrome --new-window %url% --allow-file-access-from-files
