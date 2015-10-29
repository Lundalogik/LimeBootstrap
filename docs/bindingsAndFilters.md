#Bindings
##vbaVisible: Hiding or showing elements

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

##vba: Executing VBA-functions and specific actions
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


##showOnMap: Showing an address on a map

*   __showOnMap:__ - Searches Google Maps for the provided address.

```html
    <li data-bind="text:company.postalcity.text, showOnMap: company.fullpostaladdress.text, icon: 'fa-map-marker'"></li>
```

##Call: Call a phone number
*   __call:__ - Ads an tel: link to the HTML wich triggers an built in softphone software.

```html
    <li data-bind="text: company.phone.text, call: company.phone.text, icon: 'fa-phone'"></li>
```

##openURL: Go to a website
*   __openURL:__ - Opens the suplied URL in an external browser

```html
     <li data-bind="text:company.www.text, openURL: company.www.text, icon: 'fa-globe'"></li>
```

##limeLink: Go to another LIME Record
*   __limeLink__ - Tries to create an LIME link to the object provided, please note that the root node of the object is used and not a specific property.

```html
    <li data-bind="text:todo.company.text, limeLink:todo.company, icon:'fa-flag'"></li>
```

##email: Send an email
*   __email__ - Creates an email. TODO: Should use LIME's built in email factory.

```html
    <li data-bind="text:person.email.text, email:person.email.text, icon:'fa-envelope'"></li>
```

##appInvoke: Start an app
* __appInvoke__

```html
    <li data-bind="appInvoke: 'textfileimport"></li>
```

## popover: Show additional info
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


##tooltip: Show a helping tooltip
* __tooltip__ - Gives you a good looking tooltip. [Bootstrap](http://getbootstrap.com/javascript/#tooltips). You can design where you like the tooltip to show by sending a object with a placement.

```html
        <a data-bind="text:'Andreas', tooltip: 'Konsult'"></a>
        <a data-bind="text:'Andreas', tooltip: {text:'Konsult',placement:'right'}"></a>
```


#Filters
##Currency
The currency filter can be combined with a text data-bind to format a number as a currency. The filter takes two optional parameters - currency and divider. The currency is the unit in which you want to present the formatted number, e.g. $ or GBP or SEK. The divider lets you decide what delimiter to use for formatting the number.

```html
<div data-bind="text: 100000 | currency:'$':','"></div>
```

This filter will format the number 100000 as $100,000. The following code

```html
<div data-bind="text: 100000 | currency:'SEK'"></div>
```

will result in the formatted value 100 000 SEK.
