# Bindings and Filters

## Bindings
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

Some of the more common and useful bindings

*   __visible:__ - _hides or shows a html element based on an boolean expression_
*   __text:__ - _Displays a variable as text_
*   __html:__ - _Prepends the supplied font awesome icon to the html element_
*   __css:__ - _Add or remove CSS classes_
*   __style:__ - _Add styling attributes_
*   __attr__ - _Set value of any html attribute_
*   __foreach:__ - _Loop through an array_

### vbaVisible
Hiding or showing elements.

It is common that some elements only should be visible for certain users or when specific conditions apply. It can be done in two different ways. Either use the Lime Bootstrap data-binding `vbaVisible:` or use the knockout binding `visible:`.

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

The binding `vbaVisible` is only able to execute a given VBA function that returns true or false. If you need to add some kind of code on top of that VBA function, use the original knockout binding `visible:` instead. This example uses the opposite of the function result, but any other javascript code would also work fine.

```html
<div data-bind="visible:!lbs.common.executeVba('App_MoveDate.moveDaysPossible')">
...
</div>
```

### vba
 Executing VBA-functions and specific actions

`vba` is used to trigger VBA-functions and specific actions on click. To call a VBA function simply use:

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

### showOnMap
Showing an address on a map

Searches Google Maps for the provided address.

```html
<li data-bind="text:company.postalcity.text, showOnMap: company.fullpostaladdress.text, icon: 'fa-map-marker'"></li>
```

### Call
Call a phone number

Ads an tel: link to the HTML wich triggers an built in softphone software.

```html
<li data-bind="text: company.phone.text, call: company.phone.text, icon: 'fa-phone'"></li>
```

### openURL
Go to a website

Opens the suplied URL in an external browser

```html
<li data-bind="text:company.www.text, openURL: company.www.text, icon: 'fa-globe'"></li>
```

### limeLink
Go to another Lime Record

Tries to create an Lime link to the object provided, please note that the root node of the object is used and not a specific property.

```html
<li data-bind="text:todo.company.text, limeLink:todo.company, icon:'fa-flag'"></li>
```

### email
Send an email

Creates an email. TODO: Should use Lime's built in email factory.

```html
<li data-bind="text:person.email.text, email:person.email.text, icon:'fa-envelope'"></li>
```

### appInvoke
Start an app

* __appInvoke__

```html
<li data-bind="appInvoke: 'textfileimport"></li>
```

### popover
Show additional info in a popover

Gives you a small overlayer of context that you can design as you like. In its simplest form, it can be used to display informative texts. It can also be initialized as an object with one or several adjustable attributes, allowing for styling both header icon and title. There are also a few pre-defined types with their own set designs.

```html
<li data-bind="popover: 'This is a popover'"></li>
```
If the popover is initialized as an object, the following attributes can be configured:

| Param       | Description                                                     | Default   |
|-------------|-------------------------------------                            |---------- |
| icon        | Any of the icons available from Font Awesome.                   |           |
| text        | Text you want to be displayed.                                  |           |
| title       | Title to be displayed in the header section of the popover.     |           |
| color       | Background color of the header section.                         |           |
| trigger     | What event will trigger the event, `hover` or `click`           | `hover`   |
| placement   | `top`, `right`, `button` or `left`                              | `top`     |
| template    |  `success` `info` `error` `warning` or `custom`                 | `custom`  |



!!! info
    Template is a convenient way of getting the styling set up. The default value is 'custom'. The top four alternatives will override all values for 'color', 'title' and 'icon'. These will be replaced by template ones for the specific types.

#### Example without template

```html
<li data-bind= "popover:{
            text:'This is a popover',
            title: 'LBS rules',
            type: 'custom',
            color:'magenta',
            trigger: 'click',
            icon: 'fa-check',
            placement: 'top'
        }, text: 'Popoverclick' ">
</li>
```
#### Example with template

```html
<li data-bind="popover:{text:'This is a popover.',type:'info'}"></li>
```


### tooltip
Show a helping tooltip

Gives you a good looking tooltip. [Bootstrap](http://getbootstrap.com/javascript/#tooltips). You can design where you like the tooltip to show by sending a object with a placement.

```html
<a data-bind="text:'Andreas', tooltip: 'Konsult'"></a>
<a data-bind="text:'Andreas', tooltip: {text:'Konsult',placement:'right'}"></a>
```

## Filters
A filter in knockout is a way of 'piping' a text binding through a pre-defined filter to format the value in a desired way. The filter is initiated using the | sign followed by the name of the filter and any necessary parameter inputs to the filter.

Filters are a smart and easy way to format your data in a binding
A filter is a function transforming your binding data and outputting a formated version of it.

```html
<li data-bind="text:deal.value | currency: SEK"></li>
<li>{{deal.value | currency: SEK}}</li>
```

This will produce a nicely formated value of a deal, example: "10 000SEK"

### default
If the value is blank, null, or an empty array, replace it with the given default value.

`default:<defaultValue>`

```html
<li data-bind="text:deal.name | default: 'Deal has no name"></li>
```

### fit
Trim the value if it’s longer than the given length. The trimmed portion is replaced with ... or the replacement
 value, if given. By default, the value is trimmed on the right but can be changed to left or middle through the where option.

 `fit:<length>[:<replacement>][:<where>]`

 ```html
<li data-bind="text:person.name | fit::middle"></li>
```
will convert "Shakespeare" to "Shak...are".

### json
Convert the value to a JSON string using ko.toJSON. You can give a space value to format the JSON output.

`json[:whitespace]`

 ```html
<li data-bind="text:person | json"></li>
```

### lowercase
Convert the value to lowercase.

 ```html
<li data-bind="text:person.name | lowercase"></li>
```
Will turn "Kalle" to "kalle"

### number
Rounds a number of desired number of decimals

`number:<numberOfDecimals>`

 ```html
<li data-bind="text:deal.value | number: 0"></li>
```

Will turn "1000.00" to "1000"

### replace
Perform a search and replace on the value using String#replace.

`replace:<search>:<replace>`

 ```html
<li data-bind="text:deal.name | replace: 'Big':'Small'"></li>
```
Will turn "A Big Deal" into "A Small Deal"

### uppercase
Convert the value to uppercase.

 ```html
<li data-bind="text:person.name | uppercase"></li>
```

### currency
Formats a number with to a currency with a space a separate every <divider> number. Default 1000

The currency filter can be combined with a text data-bind to format a number as a currency. The filter takes two optional parameters - currency and divider. The currency is the unit in which you want to present the formatted number, e.g. $ or GBP or SEK. The divider lets you decide what delimiter to use for formatting the number.

`currency:<currencyName>:<divider>`

```html
<div data-bind="text: 100000 | currency:'$':','"></div>
```

This filter will format the number 100000 as $100,000. The following code

```html
<div data-bind="text: 100000 | currency:'SEK'"></div>
```

will result in the formatted value 100 000 SEK.

### percent
Formats a decimal number as percent 0,01 > 1%

```html
<div data-bind="text: deal.probability | percent"></div>
```

### fromNow
Formats a date as a human readable text as for how long ago the date was.

```html
<div data-bind="text: ticket.closed | percent"></div>
```
Will turn 2000-01-01 > "Over ten years ago"


