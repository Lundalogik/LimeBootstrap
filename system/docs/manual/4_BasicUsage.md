#How does it work?
The new actionpads are inspired of how a single page applcation work. Views (basically html-templates) and data(usually JSON) are loaded via AJAX (an asyncrounous javacript call) by the the web application. The template is then rendered by applying the data and the result is shown to the user.

In LIME-bootstraps case lbs.html and lbs.js constitute the main application and all actionpads set to show lbs.html. For simplification we'll call the framework just `LBS` (LIME Bootstrap). lbs.html contians all included CSS, JS and meta tags. The actionpads (for example company.html) are now just views, containing no included CSS or JS.
lbs.html will detemine which view to load either by a supplied query string (the thing after the questionmark), `../lbs.html?ap=company` or if nothing is supplied, by trying to load a view with the same name as the class of the LIME inspector.

The active inspectors record is then loaded as data and converted to JSON.

Basic flow in LBS:
1	LBS starts and includes all base CSS, Javascript and sets a lot of enviroment variables, such as skin color, language.
2	LBS then checks where you want your display your HTML-view. In LIME you can show HTML in the actionpad, in a field, in a tab or in a web dialog. If you don't specify anyting lbs will asume your buildning an actionpad.
3	The specified view, html-file, is loaded
4	Data is loaded. LBS will first check `_config.js` for datasources, specified with the name of the view. If no datasources are found LBS will try to load the data from the `activeinspector`. A dictonary of local languages translations is loaded. All data is suplied as a JSON-object and then converted to a knockout viewmodel-
5	Apps are discovered, started and their data is loaded into the main viewmodel. A app can specify depencies on other libraries or styles. These are dynamically loaded and checked for duplicates.
6	The viewmodel is applied to the now complete view and rendred.

#Loading views
As metioned lbs.html is the real engine and all HTML things should be loaded trough lbs.html. This is achived by supplying a querystring

`[URL to actionpad folder]/lbs.html?ap=[path to your view/view name]`

The path is relative the lbs.html file and you should not include the file extension (.html).

Loading the company actionpad (company.html):

`lbs.html?ap=company`

#The console and debugging your applications
The framework has been blessed with a virtual console, to use for debugging. It is activated through changing `setDebug(true)` in `_config.html`. The console will allways automagically appeare if a critical error is logged. If you make syntacic errors in the wrong place, even the viritual console will crash. You can easily use the console when building apps, read more abot this in the app readme. The console is limited to 30 messages by default.

When working with more advanced stuff you might like to have access to a real console. Modern browsers won't allow dynamically loadings scripts from the local file system, due to security concerns. Dynamically loading scripts and html views are core concepts in LBS. In LIME a small VBA function acts as the loader. However in `system/bin/` you will find a `.bat-file` which will restart Google Chrome in a debug mode, allowing you to inspect the CSS and JS. If you dislike this approach a small HTTP-server will do the trick. With Python3 just go to the actionpad folder and write this in your terminal:

```bash
$python -m http.server
```

#Different wrappers
In LIME HTML can be displayed in the actionpad, in a HTML-field, in a HTML-tab and in a HTML-dialog. Theses places are quite different and requires some basic setup to work well. Your view can thus be loaded into three different wrappers for helping you with the different conditions.

The three basic wrappers of content:
*	Actionpad-wrapper. A thin and long wrapper with a slightly lighter backround images with a sharp edge to teh rest of the content:
*	Inline-wrapper. Used for HTML-fields. Completely plain, with the same color as the inspecor and no padding or margin. Built to seamlesly look as a part of the inspector.
*	Tab-wrapper. Used for wider layouts, such as a tab or a dialog. Uses default Twitter Bootstrap margins and is fully responsive.

The Actionpad wrapper is allways used unless anything else is stated. Pick your wrapper by suppling a querystring to lbs.html

__Inline:___ `lbs.html?type=inline`

__Tab:__ `lbs.html?type=tab`

#HTML Elements
LIME bootstrap supports all Twitter bootstrap elements but has also a few special elements. Please see the [Twitter bootstrap](http://getbootstrap.com/components/) documentation for additional info

## Structure of an actionpad view
An Actionpad built with LIME-bootstrap has the following structure:

```html
<!-- Header section, The colorfull thing at the top  -->
<div class="header-container [color]"> <!-- Specify the color of the header. Please see color section for available colors  -->
    <div class="header-icon"></div>  <!-- Specify the icon of the header. Please see icon section for available special icons  -->
    <h2 data-bind=""></h2>
        <ul class="info-links">         
            <li data-bind=""> </li>
            ...
        </ul> 
    </div>
</div>      
    
 
<!-- /Header section  -->
<!-- Body section  -->

<div class="menu"> <!-- Menu  -->

        
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
 <ul class="expandable collapsed">
        <li class="menu-header">Text</li> 
	   ...
</ul>
```

A menu has two properties, __Expandable__ and __collapsed__. The are added in the `<ul>`  class:
`<ul class="menu expandable collapsed">`	

__Expandable:__ The menu can be collapsed by clicking the header   
__Collapsed:__ The menu is collapsed when the actionpad is loaded. Stupid to use without using Expandable...

###Dropdown button

A dropdown button can contain many options, while taking up very little space. 

```html
<div class="btn-group btn-group-lime"  data-bind="visible:todo.done.value != 1">
    <button class="btn btn-lime btn-default dropdown-toggle" data-toggle="dropdown" data-bind=" text:localize.Actionpad_Todo.headermoveforward, icon: 'fa-caret-down'">
    </button>
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

#Functions
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

## Translation: Handling multiple languages
All available translations from the Localization table are automatically available in the actionpad context. The same language as the logged in user uses is automatically used. The translations are cached in a dictionary to increase speed, but requires you to run `ThisApplication.Setup` to rebuild the dictionary if you add translations or make changes. 

```html
<li data-bind="text:localize.ActionPad_Todo.addTodo"></li>
```
Technical note
The translations are added to the global view model and thus available in your apps.

##Fetching data from fields in LIME Pro
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

###Loading additional data
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

##Hiding or showing elements

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

##Executing VBA-functions and specific actions
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
