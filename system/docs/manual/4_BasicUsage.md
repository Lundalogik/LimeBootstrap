#A LIME Bootstrap Actionpad

An Actionpad built with LIME Bootstrap has the following structure:

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

#Components
LIME bootstrap supports all Twitter bootstrap elements but has also a few special elements. Please see the [Twitter bootstrap](http://getbootstrap.com/components/) documentation for all cool stuff you have access to.

##The header section
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
##The menu
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

##Dropdown button:

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

#Functions and Apps
All Twitter bootstrap functions are included, please see the [Twitter bootstrap documentation](http://getbootstrap.com/javascript/) 
LIME Bootstraps allows you to load small components we call apps, as a compliment to Twitter Bootstraps components. Apps can be found [here](http://limebootstrap.lundalogik.com/web/appstore/index.html)

To start an app add this HTML to your view:
```html

<div data-app="{app:'[Name of app]', 
                config:{
                  [App config]
            }}">
</div>

```

Each app has it's own instructions how to start and install them. Some apps require VBA and/or stored procedures to be added.

#Bindings
As we relay heavily on knockout their `data-bind=""` syntax is used through out the framework. The `data-bind=""` syntax is a used as a property on an html element. In a `data-bind` you add `bindings`, actions or triggers, to perform actions. All Knockout bindings are available, but also a few custom bindings to make your life easier. 
Read more about bindings and Knockout [here](http://knockoutjs.com/documentation/introduction.html) and try the tutorial [here](http://learn.knockoutjs.com)

A basic example of use of a knockout binding:
```html
<li data-bind="text:company.name"></li> `
```

As default you only have access to the data of the ActiveInspector!

##Custom bindings
To make your life easier we have implemented a few custom bindnings.
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

The example below uses the versatile knockout binding `attr` to add a tooltip with localization support. It also uses the custom LIME Bootstrap bindings `vba` and `icon`.

```html
<li data-bind="vba:'Actionpad_Person.newComment', text:localize.Actionpad_Person.t_newcomment, icon:'fa-comment', attr: { title: localize.Actionpad_Person.tooltip_newcomment }"></li>
```

####Technical note
The translations are added to the global view model and are thus available in your apps.

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

##Going beyond the ActiveInspector - Loading additional data
It is common to use data from more than the ActiveInspector and the following syntax will NOT work `<li data-bind="text:person.company.phone.text"></li>`

Instead you can load additional data by requesting data sources in `_config.js`. You'll find more information about this in the advanced section

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
 

##Showing an adress on a map
 
*   __showOnMap:__ - Searches Google Maps for the provided address.
 
 	```html
 	<li data-bind="text:company.postalcity.text, showOnMap: company.fullpostaladdress.text, icon: 'fa-map-marker'"></li>
	```

## Call a phone number
*	__call:__ - Ads an tel: link to the HTML wich triggers an built in softphone software.
	
	```html
	<li data-bind="text: company.phone.text, call: company.phone.text, icon: 'fa-phone'"></li>
	```

## Go to a website
*	__openURL:__ - Opens the suplied URL in an external browser
	
	```html
	 <li data-bind="text:company.www.text, openURL: company.www.text, icon: 'fa-globe'"></li>
	```

## Go to another LIME Record
*	__limeLink__ - Tries to create an LIME link to the object provided, please note that the root node of the object is used and not a specific property.
	
	```html
	<li data-bind="text:todo.company.text, limeLink:todo.company, icon:'fa-flag'"></li>
	```

##Send an email
*	__email__ - Creates an email. TODO: Should use LIME's built in email factory.
	
	```html
	<li data-bind="text:person.email.text, email:person.email.text, icon:'fa-mail'"></li>
    ```

##Working with time and dates
Dates are a hazel, except when you have the awesome library [Moment.js](http://momentjs.com).

To create a iso-date:
`moment()`

To parse almost any date format:
´moment([CRAZY DATE FORMAT])´

Moment even makes time and dates readable to people.
´moment().timeAgo(2011-01-01)´ will give you, "A few years ago"

Moment is automagically setup to use the same language and date-format as the language of the LIME Client. 
Remember to use it and check out it further!


