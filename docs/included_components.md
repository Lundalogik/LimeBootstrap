# LBS Components

The old style way of styling elements using a mix of LBS-specific and Twitter Bootstrap classes in actionpads and apps are being replaced by components. By using these new components as custom elements in your markup, all classes and intended styling will be included.

__Important__
* You can't use self closing elements when using custom elements such as the LBS components.
* The old way of styling your elements can still be used, but should be considered deprecated.
* You can use data-binds combined with custom elements, but not any data-binds that would change the DOM in any way. Examples that do not work: _icon_, _text_. Examples that do work: _vba_, _click_, _visible_. Visible is not obvious, because it seemingly changes the DOM, but only changes the styling of the element.

## lbs-hero
Component for adding a hero (banner like header) for an actionpad.

![The LBS Hero](assets/images/lbs-hero.png)


### Params
Param           | Explanation                                   | Example value                 | Default value
--------------- | -------------------------------               |-------------------            | -------------
color           | One of LBS standard colors                    | 'lime-green'                  | 'turquoise'
header          | Header text for the hero                      | 'Lime Technologies'           | ''
img             | Name of the header image                      | 'fa-calendar'                 |
menuItems       | Array with objects defining a context menu.   | [See below](#context-menu)    | []

<img src="https://raw.githubusercontent.com/Lundalogik/LimeBootstrapServices/master/web/assets/img/Bootstrap_colors.png">

### Context menu
The context menu is automatically added to the lbs-hero component if the array `menuItems` is supplied and has more than 0 elements. Each element in the array has the following options:

Param           | Explanation                     | Example value      | Default value
--------------- | ------------------------------- | ------------------ | --------------
label           | Text shown in the list item     | 'Postpone'         | ''
icon            | Optional icon to the left of the text | 'fa-user'    | ''
click           | Javascript function to run on click | () => { alert('Hi') } | null
vba             | VBA sub to run on click. Can be combined with click. | 'Module.Sub' | null
type            | _item_ or _divider_             | 'item'             | 'item'

__Note__: All other parameters will be disregarded if type is set to _divider_.

__Note__: You need to supply the image to the dist/resource/ folder if the name of the image is anything else than _dist/resource/classname.png_.

### Usage
```
<lbs-hero params="header: company.name, menuItems: [{ label: 'My hero item', icon: 'fa-bowling-ball' }]">
    <lbs-list-item params="text: company.visitingcity, icon: 'fa-map-marker'" data-bind="openMap: company.fullvisitingaddress"></lbs-list-item>
    <lbs-list-item params="text: company.phone, call: company.phone, icon: 'fa-phone'" data-bind="call: company.phone"></lbs-list-item>
    <lbs-list-item params="text: company.www, openURL: company.www, icon: 'fa-globe'" data-bind="openURL: company.www"></lbs-list-item>
</lbs-hero>
```

--------------

## lbs-menu
Expandable menu component.
### Params
Param           | Explanation                     | Example value      | Default value
--------------- | ------------------------------- |------------------- | -------------
title           | Title text for the menu         | 'Links'            | ''
expanded        | Boolean if expanded when first loaded | false        | true

### Child elements
The component `lbs-menu` should be used with one type of child element:
* LBS List item (`<lbs-list-item>`)

### Usage
```
<lbs-menu params="title: 'Links', expanded: true">
    <lbs-list-item params="text: 'Do funny stuff', icon: 'fa-calendar'" data-bind="click: runMyFunction"></li>
</lbs-menu>
```

__Note__: The component will save the expanded state in a cookie.

## lbs-list-item
Component for list items in various LBS components that implement these.

### Params
Param           | Explanation                     | Example value      | Default value
--------------- | ------------------------------- |------------------- | -------------
text            | Text for the list item          | 'Call mom'         | ''
icon            | Optional Font Awesome icon      | 'fa-phone'         |

### Usage

```
...
<lbs-list-item params="text: 'Postpone todo', icon: 'fa-calendar'"></lbs-list-item>
...
```


## lbs-list-divider
Component for creating a list divider in various LBS components that implement these

### Params
None

### Usage
```
...
<lbs-list-divider></lbs-list-divider>
...
```

## lbs-icon
Component for adding a font awesome icon

### Params
Param           | Explanation                     | Example value  | Default value
--------------- | ------------------------------- |--------------- | -------------
icon            | Font awesome icon               | 'fa-calendar'  | null
options         | Additional options to Font Awesome | 'fa-lg'     | ''

### Usage
```
<lbs-icon params="icon: 'fa-user', options: 'fa-5x'"></lbs-icon>
```


## lbs-alert
Component for showing messages

Param           | Explanation                     | Example value  | Default value
--------------- | ------------------------------- |--------------- | -------------
text            | Text to be displayed            | 'Call this customer!'   | ''
icon            | Optional Font Awesome icon      | 'fa-exclamation-triangle'  | null
alertType       | Type of alert                   | 'warning'      | 'info'

List of alert types:
* warning
* info
* danger
* success

### Child elements
If you want to add custom content to your alert, you can add this as child elements to the component.

### Usage
```
<lbs-alert params="text: 'This customer is satisfied', alertType: 'success'"></lbs-alert>
```
Or
```
<lbs-alert params="alertType: 'danger'">
	<lbs-icon params="icon: 'fa-exclamation'"></lbs-icon>
	<span>Customer is maaad!</span>
</lbs-alert>
```

## lbs-button
Lime specific button which can be styled using the official colors of Lime Bootstrap. These buttons will always have width 100% but will otherwise follow the Twitter Bootstrap styling.
#### Params
Param           | Explanation                     | Example value  | Default value
--------------- | ------------------------------- |--------------- | -------------
color           | One of LBS standard colors      | 'lime-green'   | 'turquoise'
bootstrapClass  | One of Bootstrap button classes | 'btn-success'  | ''
icon            | Font awesome icon of your choice| 'fa-calendar'  | null
text            | Text on your button             | 'My button'    | ''
centered        | Boolean for centering text      | true           | false
fullWidth       | Boolean if button should be full width | false   | true
alternative     | Boolean if button should be styled alternatively | true | false
borderless      | Boolean if button border should be excluded | true | false


__Note__: You cannot combine the params _color_ and _bootstrapClass_.

### Usage
```
<lbs-button params="text: 'My button', color: 'magenta', icon: 'fa-money'"></lbs-button>
```

## lbs-button-group
A component to group buttons together. Removes margins and border radius for edges between buttons.
#### Params
No params available

### Child elements
The component `lbs-button-group` can be used with two different child elements:
* Twitter Bootstrap buttons (using class `.btn`)
* LBS buttons (using component `lbs-button`)

### Usage
Using lbs-buttons:
```
<lbs-button-group>
    <lbs-button params="text: 'My button', color: 'magenta', icon: 'fa-money'"></lbs-button>
    <lbs-button params="text: 'My button 2', color: 'orange', icon: 'fa-calendar'"></lbs-button>
</lbs-button-group>
```
Using Twitter Bootstrap buttons:
```
<lbs-button-group>
    <button class="btn btn-default" data-bind="icon: 'fa-money', text: 'My button'"></button>
    <button class="btn btn-success" data-bind="icon: 'fa-calendar', text: 'My button 2'"></button>
</lbs-button-group>
```

## lbs-split-button
A component to group two buttons together. The first button will take 80% of the width of the component and the second one 20%.

### Params
No params available

### Child elements
The component `lbs-split-button` can be used with two different child elements:
* Twitter Bootstrap buttons (using class `.btn`)
* LBS buttons (using component `lbs-button`)

### Usage
Using lbs-buttons:
```
<lbs-split-button>
    <lbs-button params="text: 'My button', color: 'magenta', icon: 'fa-money'"></lbs-button>
    <lbs-button params="text: 'My button 2', color: 'orange', icon: 'fa-calendar'"></lbs-button>
</lbs-split-button>
```
Using Twitter Bootstrap buttons:
```
<lbs-split-button>
    <button class="btn btn-default" data-bind="icon: 'fa-money', text: 'My button'"></button>
    <button class="btn btn-success" data-bind="icon: 'fa-calendar', text: 'My button 2'"></button>
</lbs-split-button>
```

## lbs-dropdown-menu
Component for listing items with optional actions.

### Params
Param           | Explanation                     | Example value      | Default value
--------------- | ------------------------------- | ------------------ | --------------
color           | Button color                    | 'magenta'          | 'turquoise'
title            | Optional button text            | 'Check this out!'  | ''
icon            | Optional Font Awesome icon      | 'fa-ellipsis-v'    | 'fa-chevron-down'
fullWidth       | Boolean if full width button    | true | false
heroMenu        | Used by lbs-hero. Should probably not be used outside of that | false | false
borderless      | Boolean if button border should be excluded | true | false
items           | Array with objects in the dropdown menu. | See below | []

### Item configuration
Param           | Explanation                     | Example value      | Default value
--------------- | ------------------------------- | ------------------ | --------------
label           | Text shown in the list item     | 'Postpone'         | ''
icon            | Optional icon to the left of the text | 'fa-user'    | ''
click           | Javascript function to run on click | () => { alert('Hi') } | null
vba             | VBA sub to run on click. Can be combined with click. | 'Module.Sub' | null
type            | _item_ or _divider_             | 'item'             | 'item'

__Note__: All other parameters will be disregarded if type is set to _divider_.

### Usage
```
<lbs-dropdown-menu params="title: 'Check this out!', items: [{ label: 'My menu item', icon: 'fa-bowling-ball' }]">
    <lbs-list-item params="text: 'Additional item!', icon: 'fa-calendar'"></lbs-list-item>
</lbs-dropdown-menu>
```
