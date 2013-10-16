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
		
### Structure of an Actionpad
An Actionpad built with LIME-bootstrap has the following structure

```html
    <!-- Header section, The colorfull thing at the top  -->
        <div class="header-container red"> <!-- Specify the color of the header. Please see color section for available colors  -->
            <div class="header-icon-container helpdesk"> <!-- Specify the icon of the header. Please see icon section for available special icons  -->
                
            </div>
            <div id="header-info"> 
                <h2 data-bind="text: helpdesk.helpdeskno.text"></h2>
					<ul>
						<li data-bind="text:helpdesk.person.text, limeLink=helpdesk.person", icon='icon-user'></li>						
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
LIME bootstrap supports all Twitter bootstrap elements but has also a few special elements. Please see the [Twitter bootstrap](http://getbootstrap.com/components/) documentation for additional info

###The header section colors
The header section is the colorful header of each actionpad. The following colors are provided:

*	red
*	green
*	blue
*	yellow
*	orange
*	darkgrey
*	white
*	purple

Usage: 

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

A menu has two properties, __Expandable__ and __Hidden__. The are added in the `<ul>`  class:
`<ul class="menu expandable hidden">`	
	

__Expandable:__ The menu can be collapsed by clicking the header   
__Hidden:__ The menu is collapsed when the actionpad is loaded. Stupid to use without using Expandable...


##Functions
All Twitter bootstrap functions are included, please see the [Twitter bootstrap documentation](http://getbootstrap.com/2.3.2/javascript.html) 
As we relay heavily on knockout their `data-bind:""` syntax is used through out the framework. The `data-bind:""` syntax is a used as a property on an html element. In a `data-bind` you add `bindings`, actions or triggers, to perform actions. All Knockout bindings are available, but also a few custom bindings to make your life easier. 
Read more about bindings and Knockout [here](http://knockoutjs.com/documentation/introduction.html) and try the tutorial [here](http://learn.knockoutjs.com)

A basic example of use of a knockout binding:
```html
<li data-bind="text:company.name"></li> `
```

List of custom handlers:
*	__call:__ - _Tries to call the provided phone number_
*	__email:__ - _Tries to email the provided address_
*	__icon:__ - _Prepends the supplied font awesome icon to the html element_
*	__limeLink:__ - _Creates an LIME link from a provided relationship field, for example person.company_
*	__openURL:__ - _Opens the supplied URL in a external browser_
*	__showOnMap:__ - _Opens Google Maps with the supplied data as a search query_
*	__vba:__ - _Provide an string of an VBA function with it's parameters separated by commas_
*	__vbaVisible:__ - _Extends knockouts 'visible:' by executing the supplied Boolean VBA function_

### Translation: Handling multiple languages
All available translations from the Localization table are automatically available in the actionpad context. The same language as the logged in user uses is automatically used. The translations are cached in a dictionary to increase speed, but requires you to run `ThisApplication.Setup` to rebuild the dictionary if you add translations or make changes. 

```html
<li data-bind="text:localize.ActionPad_Todo.addTodo"></li>
```
Technical note
The translations are added to the global view model and thus available in your apps.

###Fetching data from fields in LIME Pro
All fields from the ActiveInspector are automagically available for you to use in your view. The syntax is `[Record class name].[field database name].[property]`.

The available properties are (in order of relevance):
*	__.text__ 
*	__.value__
*	__.key__  - __available for set and list fields_
*	__.class__ - _available for relation fields_ 

```html
<!-- Company Actionpad showing the name of the company-->
<li data-bind="text:company.name.text"></li>
<!-- Person Actionpad using the id of the company relation as a parameter to a VBA-function. Note the Javascript syntax in the Knockout bindning  -->
<li data-bind="vba:'SomeFunction,' + person.company.value"></li> 
<!-- Business Actionpad showing the optionKey from a set-list -->
<li data-bind="text:business.businesstatus.key"></li> 
```

####Loading additional data
It is common to use data from more than the ActiveInspector and the following syntax will NOT work `<li data-bind="text:person.company.phone.text"></li>`

Instead you can load additional data by using a knockout virtual element:


```html
<!-- ko dataSources: [
	{type:'record', source: 'ActionPadTools.GetPersonContactData' },
	{type:'record', source:'ActionPadTools.GetCompanyContactData'}] 
--><!-- /ko -->
```

Put the virtual element in the absolute beginning of your view. The dataSource binding takes an element with properties "type" and "source".
__type__: Specifies the datatype, can be "record", "records" or "xml"
__source__: The vba function witch supplies the data. Must be a public function. 

The loaded data can then be access by: 

```html
<!-- Loading person and company info on a helpdesk actionpad-->
<li data-bind="text:helpdesk.company.text, limeLink:helpdesk.company, icon:'icon-building'"></li>					
<li data-bind="text:person.phone.text, call:person.phone.text, icon:'icon-phone'"></li>
<li data-bind="text:person.mobilephone.text, call:person.phone.text, icon:'icon-mobile-phone'"></li>						
<li data-bind="text:company.phone.text, call:company.phone.text, icon:'icon-phone'"></li>	
```

### Data-visibility: Hiding or showing elements
It is common that some elements only should be visible for certain users or when specific conditions apply. The Data-visibility is used as follows:


A VBA function is called, handling the logic whether the element should be visible or not, returning an boolean.   
__true:__ Element is visible   
__false:__ Element hidden
In complex cases the VBA-function can take input parameters to reduce the number of VBA functions required. 

###Data-action: Executing VBA-functions and specific actions
Data-action is used to trigger VBA-functions and specific actions on click. To call a VBA function simply use:

```html
<li data-action="ActionPad_Helpdesk.Take"></li>
 ```
 
Input parameters are provided by simply separating them by commas.

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
