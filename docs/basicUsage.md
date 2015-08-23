Basic usage
======================

##A LIME Bootstrap Actionpad

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

##Components
LIME bootstrap supports all Twitter bootstrap elements but has also a few special elements. Please see the [Twitter bootstrap](http://getbootstrap.com/components/) documentation for all cool stuff you have access to.

###The header section
The header section is the colorful header of each actionpad. The following colors are provided:

<img src="https://raw.githubusercontent.com/Lundalogik/LimeBootstrapServices/master/web/assets/img/Bootstrap_colors.png">

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

###Dropdown button:

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

##Functions and Apps
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

##Bindings
As we relay heavily on knockout their `data-bind=""` syntax is used through out the framework. The `data-bind=""` syntax is a used as a property on an html element. In a `data-bind` you add `bindings`, actions or triggers, to perform actions. All Knockout bindings are available, but also a few custom bindings to make your life easier. 
Read more about bindings and Knockout [here](http://knockoutjs.com/documentation/introduction.html) and try the tutorial [here](http://learn.knockoutjs.com)

A basic example of use of a knockout binding:
```html
<li data-bind="text:company.name"></li> `
```

As default you only have access to the data of the ActiveInspector!

###Custom bindings
To make your life easier we have implemented a few custom bindnings.
List of custom handlers:

*   __call:__ - _Tries to call the provided phone number_
*   __email:__ - _Tries to email the provided address_
*   __icon:__ - _Prepends the supplied font awesome icon to the html element_
*   __limeLink:__ - _Creates an LIME link from a provided relationship field, for example person.company_
*   __openURL:__ - _Opens the supplied URL in a external browser_
*   __showOnMap:__ - _Opens Google Maps with the supplied data as a search query_
*   __vba:__ - _Provide an string of an VBA function with it's parameters separated by commas_
*   __vbaVisible:__ - _Extends knockouts 'visible:' by executing the supplied Boolean VBA function_
*   __appInvoke:__ - _Invokes an old-style actionpad app like textfileimport or duplicatemerge_
*   __popover:__ - _Displays a popover_
*   __tooltip:__ - _Displays a bootstrap tooltip_

### Translation: Handling multiple languages
All available translations from the Localization table are automatically available in the actionpad context. The same language as the logged in user uses is automatically used. The translations are cached in a dictionary to increase speed, but requires you to run `ThisApplication.Setup` to rebuild the dictionary if you add translations or make changes. 

```html
<li data-bind="text:localize.ActionPad_Todo.addTodo"></li>
```

The example below uses the versatile knockout binding `attr` to add a tooltip with localization support. It also uses the custom LIME Bootstrap bindings `vba` and `icon`.

```html
<li data-bind="vba:'Actionpad_Person.newComment', text:localize.Actionpad_Person.t_newcomment, icon:'fa-comment', attr: { title: localize.Actionpad_Person.tooltip_newcomment }"></li>
```

#####Technical notes
The translations are added to the global view model and are thus available in your apps.

Note that it is not possible to use localization in the standard way, e.g., `localize.Actionpad_Person.t_newcomment` within a block where you are using the knockout binding `with`.

###Fetching data from fields in LIME Pro
All fields from the ActiveInspector are automagically available for you to use in your view. The syntax is `[Record class name].[field database name].[property]`.

The available properties are (in order of relevance):
*   __.text__ 
*   __.value__
*   __.key__  - __available for set and list fields_
*   __.class__ - _available for relation fields_ 

```html
<!-- Company Actionpad showing the name of the company-->
<li data-bind="text:company.name.text"></li>
<!-- Person Actionpad using the id of the company relation as a parameter to a VBA-function. Note the Javascript syntax in the Knockout bindning  -->
<li data-bind="vba:'SomeFunction,' + person.company.value"></li> 
<!-- Business Actionpad showing the optionKey from a set-list -->
<li data-bind="text:business.businesstatus.key"></li> 
```

###Going beyond the ActiveInspector - Loading additional data
It is common to use data from more than the ActiveInspector and the following syntax will NOT work `<li data-bind="text:person.company.phone.text"></li>`

Instead you can load additional data by requesting data sources in `_config.js`. You'll find more information about this in the advanced section.

The loaded data can then be access by: 

```html
<!-- Loading person and company info on a helpdesk actionpad-->
<li data-bind="text:helpdesk.company.text"></li>                    
<li data-bind="text:person.phone.text"></li>
<li data-bind="text:person.mobilephone.text"></li>                      
<li data-bind="text:company.phone.text"></li>   
```

###Hiding or showing elements

It is common that some elements only should be visible for certain users or when specific conditions apply. It can be done in two different ways. Either use the LIME Bootstrap data-binding `vbaVisible:` or use the knockout binding `visible:`.

The `vbaVisible:` is used as follows. A VBA function is called, handling the logic whether the element should be visible or not, returning a boolean.   
__true:__ Element is visible   
__false:__ Element hidden

In complex cases the VBA-function can take input parameters to reduce the number of VBA functions required.

```html
<li data-bind="vbaVisible:'ActionPad_Helpdesk.HideLinks, take'"></li>
```

You can also use knockout's built in handler `visible:` to hide or show elements. Any valid Javascript will be evaluated. Example:

```html
<!-- Shows an bootstrap alert if the todo is late. Moment.js is used to parse and handle dates.-->
<div class="alert alert-error" data-bind="
   visible: todo.endtime.value !== null && (moment(todo.endtime.value) < moment() && todo.done.value != 1),
   text: 'The task is ' + (todo.endtime.value != null ? moment(todo.endtime.value).fromNow(true) : '' )+ ' late!',
   icon:'fa-bell'" >
</div>
```

The binding `vbaVisible:` is only able to execute a given VBA function that returns true or false. If you need to add some kind of code on top of that VBA function, use the original knockout binding `visible:` instead. This example uses the opposite of the function result, but any other javascript code would also work fine.

```html
<div data-bind="visible:!lbs.common.executeVba('App_MoveDate.moveDaysPossible')">
...
</div>
```

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
 

###Showing an adress on a map
 
*   __showOnMap:__ - Searches Google Maps for the provided address.
 
    ```html
    <li data-bind="text:company.postalcity.text, showOnMap: company.fullpostaladdress.text, icon: 'fa-map-marker'"></li>
    ```

### Call a phone number
*   __call:__ - Ads an tel: link to the HTML wich triggers an built in softphone software.
    
    ```html
    <li data-bind="text: company.phone.text, call: company.phone.text, icon: 'fa-phone'"></li>
    ```

### Go to a website
*   __openURL:__ - Opens the suplied URL in an external browser
    
    ```html
     <li data-bind="text:company.www.text, openURL: company.www.text, icon: 'fa-globe'"></li>
    ```

### Go to another LIME Record
*   __limeLink__ - Tries to create an LIME link to the object provided, please note that the root node of the object is used and not a specific property.
    
    ```html
    <li data-bind="text:todo.company.text, limeLink:todo.company, icon:'fa-flag'"></li>
    ```

### Send an email
*   __email__ - Creates an email. TODO: Should use LIME's built in email factory.
    
    ```html
    <li data-bind="text:person.email.text, email:person.email.text, icon:'fa-envelope'"></li>
    ```
    
### Start textfileimport
* __appInvoke__

    ```html
        <li data-bind="appInvoke: 'textfileimport"></li>
    ```

### Popover
* __popover__ - Gives you a small overlayer of context that you can design as you like. In its simplest form, it can be used to display informative texts. It can also be initialized as an object with one or several adjustable attributes, allowing for styling both header icon and title. There are also a few pre-defined types with their own set designs.

    ```html
        <li data-bind="popover: 'This is a popover'"></li>
    ```
    If the popover is initialized as an object, the following attributes can be configured:

    * __icon__

    Any of the icons available from Font Awesome.

    * __text__

    Text you want to be displayed.

    * __title__

    Title to be displayed in the header section of the popover.

    * __color__

    Background color of the header section. All header-colors are avalible.

    * __trigger__

    What event will trigger the event. Only two values are valid here:
    *   hover
    *   click

    where the default value is 'hover'.

    * __placement__

    Where the popover will be displayed in relation to its parent element. The following values are valid here:
    *   top
    *   right
    *   bottom
    *   left
    
    where the default value is 'top'.
    
    * __type__
    
    What template (if any) should be used. Only the following values are valid:
    *   success
    *   info
    *   error
    *   warning
    *   custom
    
    where the default value is 'custom'. The top four alternatives will override all values for 'color', 'title' and 'icon'. These will be replaced by template ones for the specific types.
    
    * __Example without template__
    
        ```html
            <li data-bind= popover:{
                        text:'This is a popover', 
                        title: 'LBS rules', 
                        type: 'custom', 
                        color:'magenta',
                        trigger: 'click',
                        icon: 'fa-check',
                        placement: 'top'
                    }, text: 'Popoverclick'">"></li>
        ```
    * __Example with template__
    
        ```html
            <li data-bind="popover:{text:'This is a popover.',type:'info'}"></li>
        ```
        
    
### Tooltip
* __tooltip__ - Gives you a good looking tooltip. [Bootstrap](http://getbootstrap.com/javascript/#tooltips). You can design where you like the tooltip to show by sending a object with a placement.

    ```html
        <a data-bind="text:'Andreas', tooltip: 'Konsult'"></a>
        <a data-bind="text:'Andreas', tooltip: {text:'Konsult',placement:'right'}"></a>
    ```
###Working with time and dates
Dates are a hassle, except when you have the awesome library [Moment.js](http://momentjs.com).

To create a iso-date:
`moment()`

To parse almost any date format:
`moment([CRAZY DATE FORMAT])`

Moment even makes time and dates readable to people.
`moment().timeAgo(2011-01-01)` will give you, "A few years ago"

Moment is automagically setup to use the same language and date-format as the language of the LIME Client. 
Remember to use it and check out it further!

## The log/watch

Bootstap will give you some debug- and log views to help you out.

## Keyboard shortcuts
The different view can be opened with shortcuts provided the actionpad is in focus.

|   Function  |   Command   |
|   ---    | ---       |
|   Reload actionpad | ctrl + shift + r |
|   Open log | ctrl + shift + l |
|   Open watch | ctrl + shift + w |
|   Close log/watch window | q |

##Data carousel
Creates a data carousel that can be used when your actionpad is full of stuff. The carousel will build a pages for every first level child regardless of type. OBS! You always need to set height.

   * __Examples__
    
    ```html
        <div data-carousel="{height:'25%'}">
            <div data-app="{app:'Fulltextsearch',config:{}}"></div>
            <div>This is your second div</div>
            <ul>
                <li>LBS rules</li>
            </ul>
        </div>
    ```
