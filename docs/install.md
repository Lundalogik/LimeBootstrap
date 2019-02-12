# Install & Update
## Requirements

Lime Bootstrap is only meant to be used inside Lime Crm, but for debugging reasons all functionality should work in any browser.

*	Internet Explorer 11
*   Chrome 59+

Older versions of IE __won't__ work!

*	Lime 10.12 or greater

## Install
Lime Bootstrap is included in the Lime Core database and nothing is needs to be done in this case. If installing Lime Bootstrap from scratch:

1.	Copy all the folders, `lbs.html` and `_config.js` to the Actionpad-folder
2.	Add the VBA modules `lbshelper` and `base64` found in `vba`-folder.
3.	Change the URL of all Actionpads in Lime CRM to `lbs.html`
4.  Make sure to add `Call lbsHelper.setDefaultActionpads(False)` to `ThisApplication.Setup`

If you'll like the some basic ActionPad views to start with you can find some [here](https://github.com/Lundalogik/LimeBootstrapBaseActionpads)

!!! warning
    Please note that Windows sometimes blocks dowloaded javascript files. Make sure to right click and unblock javascript files

## Update
Updating Lime Bootstrap is done by downloading the lastest version and replacing some files and updating some VBA.

1.	Replace the system folder and `lbs.html`
2.	Replace the VBA module

!!! info
    If you are upgrading from LBS 1.3 or older you also need to replace and upgrade `_config.js`


