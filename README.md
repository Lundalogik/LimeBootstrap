#LIME-bootstrap

Welcome to the LIME Pro Actionpad framework called LIME-bootstrap. 
The LIME-bootstrap is made to make it easier, better and faster working with Actionpads in LIME pro. The framework relies heavily on Twitter 
bootstrap but with custom styling and a simple, yet powerful script called limejs.js. The framework contains several built in functions and third 
party libraries, but is also expandable through plugin in custom apps. 

The bundled library contains:

*	[jQuery](http://jquery.com)
*	[Underscore.js](http://underscorejs.org)
*	[Moment.js](http://momentjs.com)
*	[Handelbars.js](http://handlebarsjs.com)
*	[Bootstrap.js](http://getbootstrap.com)

The actual actionpads used in 

##HTML Elements
LIME bootstrap supports all Twitter boostrap elements but has also a few special elements. Please see the [Twitter bootstrap](http://getbootstrap.com/components/) documentation for additional info

###The header section
The header section is the colorfull header of each actionpad.
```html
<ul class="menu">
	<li class="nav-header"> Commands</li>
    <li class="divider"></li>
	...
</ul>
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


##Components
All Twitter bootstrao

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

### Data-visibility: Hiding or showing elements depending
It is common that some elements only should be visible for certain users or when specific conditions apply. The Data-visibility is used as follows:

```html
<li data-visibility="ActionPad_Helpdesk.HideLinks, take" sv="Ta ärende" fi="Ota tehtäväksi" title-fi="Ota tehtäväksi" en-us="Take case" no="Ta saken" title-no"Ta saken" title-sv="Ta ärende" title-en-us="Take Case" data-action="ActionPad_Helpdesk.Take" > <i class="icon-rocket"></i></li>
```

A VBA function is called, handeling the logic wether the elemet should be visible or not, returing an boolean.   
__true:__ Element is visible   
__false:__ Element hidden
In complex cases the VBA-function can take input parameters to reduce the number of VBA functions required. 

###Data-action: Executing VBA-functions and specific actions
Data-action is used to trigger VBA-functions and specific actions on click.
 

##Technical
### The core: limejs.js
Bla bla bla

### Building apps
bla bla bka
