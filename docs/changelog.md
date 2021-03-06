# Changelog

### 1.12
This is the last release of LBS. Further updates will be included in Lime CRM Desktop. To make sure a solution will work with Lime CRM Desktop 11.0 or greater, Please make sure LBS 1.12 is installed.
[Download LBS 1.12](https://github.com/Lundalogik/LimeBootstrap/releases/tag/v1.12)

### 1.9
* Cookies
* Currency filter
* Selectable watch
* Improved searchability
* Option keys in VM
* No more snow
* Log to infolog
* Improved language support
* Font awesome 4.4
* Info about load time for apps and LBS


### 1.8
* Search for data in the watch
* Improved log functionality
* Minified CSS and JavaScript
* Knockout 3.3
* Fontawesome 4.3
* Moment 2.10.3
* Twitter Bootstrap 3.3.5

### 1.7
* New data carousel
* New colors
* Improved data-bind popover
* Updated Font Awsome to 4.2 
* Updated Bootstrap to 3.2.1
* Added utility file Jotnar.js

### 1.6
This is coming

### 1.5
*	Shortkeys for opening and closing watches and logs 
*	A lot of new bindings 
*	Knockout 3.1 
*	Knockout punches
*	Fontawesome 4.1

### 1.4
*	Better watch management
*	Linting and errorhandling
*	Bug fixes

### 1.3
*	Updated log functionality
*	New config solution
*	Joshua - helper to get started with apps

### 1.2
*	ViewModel viewer
*	Right-click enabled in debugmode
*	No version check outside if Lime

### 1.1
*	Bugfix: Handeling of `_config.js` now works in IE9 
*	Bugfix: Index-view won't cause an ugly error any more
*	Bugfix: Checking for updates should work better

### 1.0
`NOTE: Not backwards compatible, user action needed on upgrade.`

*	The big 1.0 release! *untz* *untz* *untz*
*	__NOTE:__ Format of `_config.js` has changed and the file must be replaced! If you are upgrading and you have modified the file, look at the new format and apply your changed accordingly. Should be a 10 second fix.
*	Apps now auto-magically check their versions compared to the latest version available on the appstore. If a newer (and always better) version has been released you can directly downloaded and install it with three clicks and one copy-paste. 
*	New dataSources are available. Most exciting is 'AsyncPost' which combined with a [proxy server](https://github.com/FredrikL/Lime.Proxy) for Lime WebService can fetch data without Lime freezing. Great job [FredrikL!](https://github.com/FredrikL)

###0.9
*	Now in Twitter Bootstrap 3.1. 
*	Handling of inline and tab views have been improved

###0.8
* Bugs have been eaten!

### 0.7
`NOTE: Not backwards compatible, user action need on upgrade.`

*	Added version checking. If debug is turned on the version of the installed framework is compared with the current version on GitHub. The user is notified and can download a new version.
*	Added a method to the VBA method "lbsHelper". If upgrading, replace old version with new.

### 0.6
*	Added support for insepctorId param in 10.11
*	Added global config, removed inline config
*	Inline config entries in "comment-style" should be moved to _config.js 

### 0.5
*	Bugfix: The styling of the menu hover-effekt is imporoved
*	Bugfix: Header icon is now properly aligned 

### 0.4
*	Skins are now supported! Actionpads must be reloaded to apply the skin change.

### 0.3
*	Updated to font awesome 4.0. All icon bindings must be changed to handel the new "fa-" naming convention
*	Updated to Twitter Bootstrap 3.0
*	.nav-header should be change to .menu-header
*	.menu property "hidden" should be changed to "collapsed"

### 0.2
*	Replace header tag `<div class="header-fa-container helpdesk">` with `<div class="header-icon"></div>`. The image to show will sort itself out.
*	Place any images you may need in the root folder "resources" or a subdirectory of it
*	Invoke old-school apps with the binding "appInvoke"
*	Remove div with id #header-info and add class .info-links to the list of info links in the header
*	Remove div with id #content-container
