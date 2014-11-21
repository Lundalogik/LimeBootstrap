#LIME Bootstrap
The LIME Bootstrap is made to make it easier, better and faster working with Actionpads in LIME pro. The framework relies heavily on Knockout.js and Twitter Bootstrap but with custom styling and a simple, yet powerful script called `lbs.js`. The framework contains several built in functions and third 
party libraries, but is also expandable through custom apps. 


LIME-bootstrap is only meant to be used inside LIME Pro, but for debugging reasons all functionality (except the data connections) should work in any browser.

##Requirements

*	Internet Explorer 9 <- With some design quirks
*	Internet Explorer 10
*	Internet Explorer 11

Older versions of IE __won't__ work!

*	LIME 10.11 or greater


##Install
LIME Bootstrap is included in the LIME Basic database and nothing is needs to be done in this case. If installing LIME Bootstrap from scratch:

1.	Copy all the folders, `lbs.html` and `_config.js` to the Actionpad-folder
2.	Create two new VBA modules from the VBA found in `system/vba/` with the same name as the files
3.	Change the URL of all Actionpads in LIME Pro to `lbs.html`

If you'll like the some basic views to start with you can find some [here](https://github.com/Lundalogik/LimeBootstrapBaseActionpads)
