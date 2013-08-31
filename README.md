#LIME-bootstrap

Welcome to the LIME Pro Actionpad framework called LIME-bootstrap. 
The LIME-bootstrap is made to make it easier, better and faster working with Actionpads in LIME pro. The framework relies heavily on Twitter 
bootstrap but with custom styling and a simple, yet powerful script called limejs.js. The framework contains several built in functions and third 
party libraries, but is also expandable through plugin in custom apps. 


##HTML Elements
LIME bootstrap supports all Twitter boostrap elements but has also a few special elements
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

-------------------------------

### Data-field: Fetching data from fields in LIME Pro
The data-field attribute fetches data from the specified field from the ActiveInspector.

`<li data-field="name"></li> `


-


##Technical
### The core: limejs.js
Bla bla bla

### Building apps
bla bla bka
