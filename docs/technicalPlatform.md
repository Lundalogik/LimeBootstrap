Technical
================

## Included javascript frameworks
The bundled library contains:

*	[jQuery](http://jquery.com)
*	[Underscore.js](http://underscorejs.org)
*	[Moment.js](http://momentjs.com)
*	[Knockout.js](http://knockoutjs.com/)
*	[Bootstrap.js](http://getbootstrap.com)

##Icons
[Font awesome](http://fortawesome.github.io/Font-Awesome/) is include. Please see the font awesome documentation.

##Structure of the framework

The framework has the following file structure

*	__apps__ - _small selfdependent html apps that can be dynamically loaded into the Actionpads_
	*	...
*	__System__ - _READ ONLY! This is the base of the framework and should never be modified_
	*	__bin__ - _launch Google Chrome in Allow Cross Origin mode_
	*	__css__
		*	lime.css - _styling for the framework. Overrides several Twitter Bootstrap stylings_

		*	font-awesome.css
		*	bootstrap.css
	*	__font__ - _Font files for Font awesome_
		*	... 
	*	__img__ - _images used in the framework which aren't from Font Awesom_
		*	...
	*	__js__ - _all javacript used in the framework_
		*	lbs.js - _Frameworks main javascript_
		*	... Third party frameworks ...
	*	__view__ - _Views used by the system, for example the debug view_
*	application.html
		

## The core: lbs.js and it's modules
lbs.js is the main file of the framework is mainly in charge of setup and delegating tasks. It uses the following modules to accually do stuff:
*	__lbs.apploader.js__ - Handels the loading of the apps and their initiation 
*	__lbs.bindings.js__ - The custom knockout bindnings are defined here
*	__lbs.loader.js__  - Handels loading of scripts, views and styles. 
*	__lbs.log.js__ - Handels logging to the custom console. 


