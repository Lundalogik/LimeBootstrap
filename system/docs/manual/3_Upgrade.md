# Upgrade instructions
These are  the changes that you will have to do to upgrade to a specific version

###0.9
*	Now in Twitter Bootstrap 3.1. 
*	Handeling of inline and tab views have been improved

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
