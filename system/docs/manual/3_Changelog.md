#Updates
We continually release new versions of LIME Bootstrap. From version 0.7 the framework auto-magically checks for new versions only and notifies you if updates are available. Please install them ;)

# Upgrade instructions
Just replace the `system`-folder and `lbs.html` and you are good to go, unless specified otherwise in the change-log


#Change-log
###1.0
*	The big 1.0 release! *untz* *untz* *untz*
*	__NOTE:__ Format of `_config.js` has changed and the file must be replaced! If you are upgrading and you have modified the file, look at the new format and apply your changed accordingly. Should be a 10 second fix.
*	Apps now auto-magically check their versions compared to the latest version available on the appstore. If a newer (and always better) version has been released you can directly downloaded and install it with three clicks and one copy-paste. 
*	New dataSources are available. Most exciting is 'AsyncPost' which combined with a [proxy server](https://github.com/FredrikL/Lime.Proxy) for LIME WebService can fetch data without LIME freezing. Great job [FredrikL!](https://github.com/FredrikL)

###0.9
*	Now in Twitter Bootstrap 3.1. 
*	Handling of inline and tab views have been improved

###0.8
Bugs have been eaten!

### 0.7
*	Added version checking. If debug is turned on the version of the installed framework is compared with the current version on GitHub. The user is notified and can download a new version.
*	Added a method to the VBA method "lbsHelper". If upgrading, replace old version with new.

### 0.6
*	Added support for insepctorId param in 10.11
*	Added global config, removed inline config
*	Inline config entries in "comment-style" should be moved to _config.js 

### 0.5
*	Bugfix: The styling of the menu hover-effect is improved
*	Bugfix: Header icon is now properly aligned 

### 0.4
*	Skins are now supported! Actionpads must be reloaded to apply the skin change.

### 0.3
*	Updated to font awesome 4.0. All icon bindings must be changed to handle the new "fa-" naming convention
*	Updated to Twitter Bootstrap 3.0
*	.nav-header should be change to .menu-header
*	.menu property "hidden" should be changed to "collapsed"

### 0.2
*	Replace header tag `<div class="header-fa-container helpdesk">` with `<div class="header-icon"></div>`. The image to show will sort itself out.
*	Place any images you may need in the root folder "resources" or a subdirectory of it
*	Invoke old-school apps with the binding "appInvoke"
*	Remove div with id #header-info and add class .info-links to the list of info links in the header
*	Remove div with id #content-container


#Future
