Basic usage
======================

##A Lime Bootstrap Actionpad

An Actionpad built with Lime Bootstrap has the following structure:

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
Lime bootstrap supports all Twitter bootstrap elements but has also a few special elements. Please see the [Twitter bootstrap](http://getbootstrap.com/components/) documentation for all cool stuff you have access to.

We also supply the following components:

*   __Menu:__ - _A menu to hold actions_
*   __Dropdown button:__ - _A dropdown button styled for Lime CRM_
*   __Header section:__ - _The top section of every actionpad_
*   __Data carousel:__ - _A rotating object to hold more objects_

See all our components [here](/en/latest/components)

##Functions and Apps
All Twitter bootstrap functions are included, please see the [Twitter bootstrap documentation](http://getbootstrap.com/javascript/)
Lime Bootstraps allows you to load small components we call apps, as a compliment to Twitter Bootstraps components. Apps can be found [here](http://limebootstrap.lundalogik.com/web/appstore/index.html)

To start an app add this HTML to your view:
```html

<div data-app="{app:'[Name of app]',
                config:{
                  [App config]
            }}">
</div>

```

Each app has it's own instructions how to start and install them. Some apps require VBA and/or stored procedures to be added.

##Bindings and filters
As we relay heavily on knockout their `data-bind=""` syntax is used through out the framework. The `data-bind=""` syntax is a used as a property on an html element. In a `data-bind` you add `bindings`, actions or triggers, to perform actions. All Knockout bindings are available, but also a few custom bindings to make your life easier.
Read more about bindings and Knockout [here](http://knockoutjs.com/documentation/introduction.html) and try the tutorial [here](http://learn.knockoutjs.com)

A basic example of use of a knockout binding:
```html
<li data-bind="text:company.name"></li>
```
You can also use a short hand for bindnings, using brackets. The above example can also be written as

```html
<li>{{company.name}}</li>
```

You can read more about this short hand syntax [here](https://mbest.github.io/knockout.punches/)

As default you only have access to the data of the ActiveInspector!

### Knockout bindings
Knockout supplies a large set of bindings, which all can be found [here](http://knockoutjs.com/documentation/introduction.html)
Our full documentation can be found [here](/en/latest/bindingsAndFilters/)

Some of the more common and useful bindings

*   __visible:__ - _hides or shows a html element based on an boolean expression_
*   __text:__ - _Displays a variable as text_
*   __html:__ - _Prepends the supplied font awesome icon to the html element_
*   __css:__ - _Add or remove CSS classes_
*   __style:__ - _Add styling attributes_
*   __attr__ - _Set value of any html attribute_
*   __foreach:__ - _Loop through an array_

###Custom bindings
To make your life easier we have implemented a few custom bindnings.
List of custom handlers:

*   __call:__ - _Tries to call the provided phone number_
*   __email:__ - _Tries to email the provided address_
*   __icon:__ - _Prepends the supplied font awesome icon to the html element_
*   __limeLink:__ - _Creates an Lime link from a provided relationship field, for example person.company_
*   __openURL:__ - _Opens the supplied URL in a external browser_
*   __showOnMap:__ - _Opens Google Maps with the supplied data as a search query_
*   __vba:__ - _Provide an string of an VBA function with it's parameters separated by commas_
*   __vbaVisible:__ - _Extends knockouts 'visible:' by executing the supplied Boolean VBA function_
*   __appInvoke:__ - _Invokes an old-style actionpad app like textfileimport or duplicatemerge_
*   __popover:__ - _Displays a popover_
*   __tooltip:__ - _Displays a bootstrap tooltip_


###Filters
Filters are a smart and easy way to format your data in a binding
A filter is a function transforming your binding data and outputting a formated version of it.

```html
<li data-bind="text:deal.value | currency: SEK"></li>
<li>{{deal.value | currency: SEK}}</li>
```

This will produce a nicely formated value of a deal, example: "10 000SEK"

List of filters:

*   __default:<defaultValue>__ - If the value is blank, null, or an empty array, replace it with the given default value.
*   __fit:<length>[:<replacement>][:<where>]__ - Trim the value if it’s longer than the given length. The trimmed portion is replaced with ... or the replacement value, if given. By default, the value is trimmed on the right but can be changed to left or middle through the where option. For example: name | fit:10::'middle' will convert Shakespeare to Shak...are.
*   __json[:space]__ - Convert the value to a JSON string using ko.toJSON. You can give a space value to format the JSON output.
*   __lowercase__ - Convert the value to lowercase.
*   __number:<numberOfDecimals>__ - Rounds a number of desired number of decimals
*   __replace:<search>:<replace>__ - Perform a search and replace on the value using String#replace.
*   __uppercase__ - Convert the value to uppercase.
*   __currency:<currencyName>:<divider>__ - Formats a number with to a currency with a space a separate every <divider> number. Default 1000
*   __percent:__ - Formats a decimal number as percent 0,01 > 1%
*   __fromNow:__ - Formats a date as a human readable text as for how long ago the date was. Example 2000-01-01 > "Over ten years ago"


## Translation: Handling multiple languages
All available translations from the Localization table are automatically available in the actionpad context. The same language as the logged in user uses is automatically used. The translations are cached in a dictionary to increase speed, but requires you to run `ThisApplication.Setup` to rebuild the dictionary if you add translations or make changes.

```html
<li data-bind="text:localize.ActionPad_Todo.addTodo"></li>
```

The example below uses the versatile knockout binding `attr` to add a tooltip with localization support. It also uses the custom Lime Bootstrap bindings `vba` and `icon`.

```html
<li data-bind="vba:'Actionpad_Person.newComment', text:localize.Actionpad_Person.t_newcomment, icon:'fa-comment', attr: { title: localize.Actionpad_Person.tooltip_newcomment }"></li>
```

###Technical notes
The translations are added to the global view model and are thus available in your apps.

Note that it is not possible to use localization in the standard way, e.g., `localize.Actionpad_Person.t_newcomment` within a block where you are using the knockout binding `with`.

##Fetching data from fields in Lime CRM
All fields from the ActiveInspector are automagically available for you to use in your view. The syntax is `[Record class name].[field database name].[property]`.

The available properties are (in order of relevance):
*   __.text__
*   __.value__
*   __.key__  - __available for set and list fields_
*   __.class__ - _available for relation fields_

```html
<!-- Company Actionpad showing the name of the company-->
<li data-bind="text:company.name.text"></li>
<!-- Shorthand--><li>{{company.name.text}}</li>
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

##Working with time and dates
Dates are a hassle, except when you have the awesome library [Moment.js](http://momentjs.com).

To create a iso-date:
`moment()`

To parse almost any date format:
`moment([CRAZY DATE FORMAT])`

Moment even makes time and dates readable to people.
`moment().timeAgo(2011-01-01)` will give you, "A few years ago"

Moment is automagically setup to use the same language and date-format as the language of the Lime CRM desktop client.
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
