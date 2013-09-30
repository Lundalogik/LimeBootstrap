#LIME-bootstrap

Welcome to the LIME Pro Actionpad framework called LIME-bootstrap. 
The LIME-bootstrap is made to make it easier, better and faster working with Actionpads in LIME pro. The framework relies heavily on Knockout.js and Twitter Bootstrap but with custom styling and a simple, yet powerful script called lbs.js. The framework contains several built in functions and third 
party libraries, but is also expandable through custom apps. Some actual actionpads used in the LIME basic database are also included.  

The framework is "convention over configuration", meaning there should be one and only one way to do thing.

LIME-bootstrap is only meant to be used inside LIME Pro, but for debugging reasons all functionality (except the data connections) should work in any browser. In LIME Pro the supporter browser versions are:

*	Internet Explorer 9
*	Internet Explorer 10
*	Internet Explorer 11

Older versions of IE _may_ work, but the ActionPads will surely not look so great. 

### Included javascript frameworks
The bundled library contains:

*	[jQuery](http://jquery.com)
*	[Underscore.js](http://underscorejs.org)
*	[Moment.js](http://momentjs.com)
*	[Knockout.js](http://knockoutjs.com/)
*	[Bootstrap.js](http://getbootstrap.com)

###Icons
[Font awesome](http://fortawesome.github.io/Font-Awesome/) is include. Please see the font awesome documentation.

###Structure of the framework
The framework has the following file structure

*	__apps__ - _small selfdependent html apps that can be dynamically loaded into the Actionpads_
	*	...
*	__System__ - _READ ONLY! This is the base of the framework and should never be modified_
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
*	Actionpads.html
		
### Structure of an Actionpad
An Actionpad built with LIME-bootstrap has the following structure

```html
    <!-- Header section, The colorfull thing at the top  -->
        <div class="header-container red"> <!-- Specify the color of the header. Please see color section for available colors  -->
            <div class="header-icon-container helpdesk"> <!-- Specify the icon of the header. Please see icon section for available special icons  -->
                
            </div>
            <div id="header-info"> 
                <h2 data-field="helpdeskno"></h2>
					<ul>
						<li data-field="person" data-action="lime-link"><i class="icon-user"></i></li>						
  					  	...
                    </ul> 
            </div>
        </div>		
		
    <!-- /Header section  -->
    <!-- Body section  -->
    <div class="content-container">
      		
			<!-- Menus and apps goes here!  -->
		 
    </div>
	<!-- /Body section  -->

```

##HTML Elements
LIME bootstrap supports all Twitter boostrap elements but has also a few special elements. Please see the [Twitter bootstrap](http://getbootstrap.com/components/) documentation for additional info

###The header section colors
The header section is the colorfull header of each actionpad. The following colors are provided:

*	red
*	green
*	blue
*	yellow
*	orange
*	darkgrey
*	white
*	purple

```html
<div class="header-container [insert color here]">
```
###The menu

A menu can be created by the following HTML: 

```html
<ul class="menu">
	<li class="nav-header"> Commands</li>
    <li class="divider"></li>
	...
</ul>
```

A menu has two properties, __Expandable__ and __Hidden__. The are added in the `<ul>` class:
`<ul class="menu expandable hidden">`	
	

__Expandable:__ The menu can be collapsed by clicking the header   
__Hidden:__ The menu is collapsed when the actionpad is loaded. Stupid to use without using Expandable...


##Functions
All Twitter bootstrap functions are included, please see the [Twitter bootstrap documentation](http://getbootstrap.com/2.3.2/javascript.html) 

### Translation: Handeling multiple languages
By adding language specific tags the actionpads can support multiple languages. The same language as the loged in user uses is automatically used.

```html
<li sv="Ny att göra" fi="Uusi tehtävä" en-us="New todo" no="Ny oppgave" title-no="Ny oppgave" title-fi="Uusi tehtävä" title-sv="Ny att göra uppgift"  title-en-us="New todo" data-action="ActionPadTools.NewInspectorFromInspector, todo"></li>
```

The string is added with `$.append()`, hence the string will always end up at the end of any custom html. Example:

```html
<li en="New todo"> <i class="icon-calendar"></i></li>
```
will render into "icon New todo" 


### Data-field: Fetching data from fields in LIME Pro
The data-field attribute fetches data from the specified field from the ActiveInspector.

```html
<li data-field="name"></li> `
```

Please note that accessing information on linked records will be slow, as the information must be fetched from the server and not the Inspector, i.e calling the company name from a person will be slow:

```html
<li data-field="company.name"></li> `
```
Consider using an Information rendering app instead and provide the data required via XML (refer to the app section).

### Data-visibility: Hiding or showing elements
It is common that some elements only should be visible for certain users or when specific conditions apply. The Data-visibility is used as follows:

```html
<li data-visibility="ActionPad_Helpdesk.HideLinks, take" sv="Ta ärende" fi="Ota tehtäväksi" title-fi="Ota tehtäväksi" en-us="Take case" no="Ta saken" title-no"Ta saken" title-sv="Ta ärende" title-en-us="Take Case" data-action="ActionPad_Helpdesk.Take" > <i class="icon-rocket"></i></li>
```

A VBA function is called, handeling the logic wether the elemet should be visible or not, returing an boolean.   
__true:__ Element is visible   
__false:__ Element hidden
In complex cases the VBA-function can take input parameters to reduce the number of VBA functions required. 

###Data-action: Executing VBA-functions and specific actions
Data-action is used to trigger VBA-functions and specific actions on click. To call a VBA function simply use:

```html
<li data-action="ActionPad_Helpdesk.Take"></li>
 ```
 
Input parameters are provided by simply seperateing them by commas.

```html
<li data-action="ActionPad_Helpdesk.Park, 1, t_park_1_hour"></li>
 ```
 
 There are four included special actions:
 
*	__ShowOnMap, [address]__ - Searches Google Maps for the provided address.
 
 	```html
 	<li data-field="postalcity" data-action="showOnMap, fullpostaladdress"><i class="icon-map-marker"> </i> </li>
	```
	
*	__call__ - Ads an tel: link to the HTML, In advantage used in compination with the Data-field function  
	
	```html
	<li data-field="phone" data-action="call"><i class="icon-phone"> </i> </li>
	```
	
*	__www__ - Opens the suplied URL in an external browser
	
	```html
	 <li data-field="www" data-action="openUrl"><i class="icon-globe"> </i> </li>
	```
*	__lime-link__ - Tries to create an LIME link to the object provided by the Data-field.
	
	```html
	<li data-field="company" data-action="lime-link"><i class="icon-building"></i></li>
	```
	
The input parameters are evaluated at load and the string to be executed is stored in a Data-args attribute. 

 
##Technical
### The core: lbs.js
It's all very technical and smart!

### Building apps
Please see the readme file in the apps folder 
