#LIME-bootstrap

Welcome to the LIME Pro Actionpad framework called LIME-bootstrap. 
The LIME-bootstrap is made to make it easier, better and faster working with Actionpads in LIME pro. The framework relies heavily on Knockout.js and Twitter Bootstrap but with custom styling and a simple, yet powerful script called lbs.js. The framework contains several built in functions and third 
party libraries, but is also expandable through custom apps. Some actual actionpads used in the LIME basic database are also included.  

The framework is "convention over configuration", meaning there should be one and only one way to do things. If you find yourself writing lots of code to do something, or god forbid, needing to modify ANY file in the systems folder, you're propably doing it wrong. Take a deep breath and ask for assistance.

If you want to use the framework I solemnly swear to the following conditions:

1. The systems folder should never, ever be modified. I can achieve cool and smart functions without ever touching it. 
2. lbs.html should neither be modified, exept from toggeling debug on and off  
3. I must unlearn what you have learned! The framework offers a completely different methology of working with ActionPads, I will embrase it. 
4. I won't ever copy and paste code from old actionpads. A rabbit will die if I even think of coping VBScript...
5. I wan't to contribute to a better framework, any improvements, errors or bugfixes will be commited to this git repository. 
6. I will follow the design guidlines:
	1. The design should be flat, free from gradients and focused on content.
	2. The actionpad is very narrow (~250px), use the height and not the width of the actionpad.
	3. Font should be dark blue on the deafult blue background. In any other case, white should be used. It white cannot be used, use a darker variant of the background color i.e dark green on green background
	4. Font awesome is used for all icons exept for the header icons, here we use Icon Experience's new M-icon set.
	5. Stick to default colors, don't "brand" the solution with customers logo and colors.
7. I will use `lbs.common.executeVBA()` to run any LIME function and `lbs.limeDataConnection` to access any LIME object when building apps
8. I won't include any scripts and styles in my views.  

LIME-bootstrap is only meant to be used inside LIME Pro, but for debugging reasons all functionality (except the data connections) should work in any browser. In LIME Pro the supporter browser versions are:

*	Internet Explorer 9
*	Internet Explorer 10
*	Internet Explorer 11

Older versions of IE _may_ work, but the ActionPads will surely not look so great. 

### Upgrade instructions
These are  the changes that you will have to do to upgrade to a specifik version

#### 0.0.3
*	Change to font awesome 4.0. All icon bindings must be changed to handel the new "fa-" naming convention

#### 0.0.2
*	Replace header tag `<div class="header-fa-container helpdesk">` with `<div class="header-icon"></div>`. The image to show will sort itself out.
*	Place any images you may need in the root folder "resources" or a subdirectory of it
*	Invoke old-school apps with the binding "appInvoke"
*	Remove div with id #header-info and add class .info-links to the list of info links in the header
*	Remove div with id #content-container

###How does it work?
The new actionpads are inspired of how a single page applcation work. Views (basically html-templates) and data(usually JSON) are loaded via AJAX (an asyncrounous javacript call) by the the web application. The template is then rendered by applying the data and the result is shown to the user.

In LIME-bootstraps case lbs.html is the main application and all actionpads are pointed to lbs.html. lbs.html contians all included css, js amd meta tags. The actionpads (for example company.html) are now just views, containing no includes or javacript.
lbs.html will detemine which view to load either by a supplied query string (the thing after the questionmark), `../lbs.html?ap=company` or if nothing is supplied, by trying to load a view with the same name as the class of the LIME inspector.

The active inspectors record is then loaded as data and converted to JSON.    

###The console
The framework has been blessed with a virtual console, to use for debugging. It is activated through changing `debug="true"` in lbs.html. The console will automagically appeare if an error is logged. You can easily use the console when building apps, read more abot this in the app readme.

##HTML Elements
LIME bootstrap supports all Twitter bootstrap elements but has also a few special elements. Please see the [Twitter bootstrap](http://getbootstrap.com/components/) documentation for additional info

### Structure of an actionpad view
An Actionpad built with LIME-bootstrap has the following structure:

```html
    <!-- Header section, The colorfull thing at the top  -->
        <div class="header-container red"> <!-- Specify the color of the header. Please see color section for available colors  -->
            <div class="header-fa-container helpdesk"> <!-- Specify the icon of the header. Please see icon section for available special icons  -->
  
            </div>
            <div id="header-info"> 
                <h2 data-bind="text: helpdesk.helpdeskno.text"></h2>
					<ul>
						<li data-bind="text:helpdesk.person.text, limeLink:helpdesk.person, icon='fa-user'"></li>						
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
        <li class="nav-header"data-bind=" text:localize.Actionpad_Business.command"></li> 
        <li class="divider"></li>
	...
</ul>
```

A menu has two properties, __Expandable__ and __Hidden__. The are added in the `<ul>`  class:
`<ul class="menu expandable hidden">`	

__Expandable:__ The menu can be collapsed by clicking the header   
__Hidden:__ The menu is collapsed when the actionpad is loaded. Stupid to use without using Expandable...

###Dropdown button

A dropdown button can contain many options, while taking up very little space. 

```html
 <div class="btn-group">
    	<a class="btn dropdown-toggle" data-toggle="dropdown" href="#" data-bind=" text:localize.Actionpad_Todo.headermoveforward, icon: 'fa-caret-down'"></a>
    	<ul class="dropdown-menu">
    		<li data-bind="vba:'ActionPad_todo.Postpone, d, 1', text:localize.Actionpad_Todo.mf1d"></li>
    	    <li class="divider"></li>
            <li data-bind="vba:'ActionPad_todo.Postpone, ww, 1', text:localize.Actionpad_Todo.mf1w"></li>
    		<li data-bind="vba:'ActionPad_todo.Postpone, ww, 2', text:localize.Actionpad_Todo.mf2w"></li>
            <li class="divider"></li>
            <li data-bind="vba:'ActionPad_todo.Postpone, m, 1', text:localize.Actionpad_Todo.mf1m"></li>
    		<li data-bind="vba:'ActionPad_todo.Postpone, m, 6', text:localize.Actionpad_Todo.mf6m"></li>
    		<li class="divider"></li>
            <li data-bind="vba:'ActionPad_todo.Postpone, yyyy, 1', text:localize.Actionpad_Todo.mf1y"></li>
    	</ul>
    </div>
```

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
<li data-bind="text:helpdesk.company.text"></li>					
<li data-bind="text:person.phone.text"></li>
<li data-bind="text:person.mobilephone.text"></li>						
<li data-bind="text:company.phone.text"></li>	
```

###Hiding or showing elements

It is common that some elements only should be visible for certain users or when specific conditions apply. The Data-visibility is used as follows:

```html
<li data-bind="vbaVisible:'ActionPad_Helpdesk.HideLinks, take'"></li>
```

You can also use knockouts built in handler `visible:` to hide or show elements, any valid Javascript will be evaluated. Example:

```html
<!-- Shows an bootstrap alert if the todo is late. Moment.js is used to parse and handle dates.-->
<div class="alert alert-error" data-bind="
   visible: todo.endtime.value !== null && (moment(todo.endtime.value) < moment() && todo.done.value != 1),
   text: 'The task is ' + (todo.endtime.value != null ? moment(todo.endtime.value).fromNow(true) : '' )+ ' late!',
   icon:'fa-bell'" >
</div>
```


A VBA function is called, handling the logic whether the element should be visible or not, returning an boolean.   
__true:__ Element is visible   
__false:__ Element hidden
In complex cases the VBA-function can take input parameters to reduce the number of VBA functions required. 

###Executing VBA-functions and specific actions
`vba:` is used to trigger VBA-functions and specific actions on click. To call a VBA function simply use:

```html
<li data-bind="vba:'ActionPad_Helpdesk.Take'"></li>
 ```
 
Input parameters are provided by simply separating them by commas.

```html
<li data-bind="vba:'ActionPad_Helpdesk.Park, 1, t_park_1_hour'"></li>
 ```

 You can also use any available data in the actionpad as an input to the function through concatenating a string  

```html
<li data-bind="vba:'ActionPad_Helpdesk.DoSomethingWithTheRecord,' + helpdesk.idhelpdesk.value"></li>
 ```
 
 ###The built in handlers and how to use them

 
*	__showOnMap:__ - Searches Google Maps for the provided address.
 
 	```html
 	<li data-bind="text:company.postalcity.text, showOnMap: company.fullpostaladdress.text, icon: 'fa-map-marker'"></li>
	```
	
*	__call:__ - Ads an tel: link to the HTML wich triggers an built in softphone software.
	
	```html
	<li data-bind="text: company.phone.text, call: company.phone.text, icon: 'fa-phone'"></li>
	```
	
*	__openURL:__ - Opens the suplied URL in an external browser
	
	```html
	 <li data-bind="text:company.www.text, openURL: company.www.text, icon: 'fa-globe'"></li>
	```
*	__limeLink__ - Tries to create an LIME link to the object provided, please note that the root node of the object is used and not a specific property.
	
	```html
	<li data-bind="text:todo.company.text, limeLink:todo.company, icon:'fa-flag'"></li>
	```
*	__email__ - Creates an email. TODO: Should use LIMES built in email factory
	
	```html
	<li data-bind="text:person.email.text, email:person.email.text, icon:'fa-mail'"></li>
	```

 
##Technical

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
		

### The core: lbs.js and it's modules
lbs.js is the main file of the framework is mainly in charge of setup and delegating tasks. It uses the following modules to accually do stuff:
*	__lbs.apploader.js__ - Handels the loading of the apps and their initiation 
*	__lbs.bindings.js__ - The custom knockout bindnings are defined here
*	__lbs.loader.js__  - Handels loading of scripts, views and styles. 
*	__lbs.log.js__ - Handels logging to the custom console. 

### Building apps
Please see the readme file in the apps folder 
