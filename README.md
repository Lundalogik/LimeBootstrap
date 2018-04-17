# Brunch + Babel/ES6

This is a modern JS skeleton for [Brunch](http://brunch.io).

## Installation

Clone this repo manually or use `brunch new dir -s es6`

## Getting started

* Install (if you don't have them):
    * [Node.js](http://nodejs.org): `brew install node` on OS X
    * [Brunch](http://brunch.io): `npm install -g brunch`
    * Brunch plugins and app dependencies: `npm install`
* Run:
    * `npm start` — watches the project with continuous rebuild. This will also launch HTTP server with [pushState](https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Manipulating_the_browser_history).
    * `npm run build` — builds minified project for production
* Learn:
    * `public/` dir is fully auto-generated and served by HTTP server.  Write your code in `app/` dir.
    * Place static files you want to be copied from `app/assets/` to `public/`.
    * [Brunch site](http://brunch.io), [Getting started guide](https://github.com/brunch/brunch-guide#readme)

## ES-next

To use proposed JS features not included into ES6, do this:

* `npm install --save-dev babel-preset-stage-0`
* in `brunch-config.js`, add the preset: `presets: ['latest', 'stage-0']`

## LBS Components

The old style way of styling elements using a mix of LBS-specific and Twitter Bootstrap classes in actionpads and apps are being replaced by components. By using these new components as custom elements in your markup, all classes and intended styling will be included.

__Important__
* You can't use self closing elements when using custom elements such as the LBS components.
* The old way of styling your elements can still be used, but should be considered deprecated.
* You can use data-binds combined with custom elements, but not any data-binds that would change the DOM in any way. Examples that do not work: _icon_, _text_. Examples that do work: _vba_, _click_, _visible_. Visible is not obvious, because it seemingly changes the DOM, but only changes the styling of the element.

### lbs-hero
Component for adding a hero (banner like header) for an actionpad.
#### Params
Param           | Explanation                     | Example value      | Default value
--------------- | ------------------------------- |------------------- | -------------
color           | One of LBS standard colors      | 'lime-green'       | 'turquoise'
header          | Header text for the hero        | 'Lime Technologies'| ''
img             | Name of the header image        | 'fa-calendar'      |

__Note__: You need to supply the image to the dist/resource/ folder.

#### Usage
```
<lbs-button params="text: 'My button', color: 'magenta', icon: 'fa-money'"></lbs-button>
```

### lbs-menu
Component for adding a hero (banner like header) for an actionpad.
#### Params
Param           | Explanation                     | Example value      | Default value
--------------- | ------------------------------- |------------------- | -------------
title           | Title text for the menu         | 'Links'            | ''
expanded        | Boolean if expanded when loaded | true               | false

#### Child elements
The component `lbs-menu` can be used with one type of child element:
* List item (`<li>`)

#### Usage
```
<lbs-menu params="title: 'Links', expanded: true">
    <li data-bind="click: runMyFunction, text: 'Do funny stuff', icon: 'fa-calendar'"></li>
</lbs-menu>
```

### lbs-button
Lime specific button which can be styled using the official colors of Lime Bootstrap. These buttons will always have width 100% but will otherwise follow the Twitter Bootstrap styling.
#### Params
Param           | Explanation                     | Example value  | Default value
--------------- | ------------------------------- |--------------- | -------------
color           | One of LBS standard colors      | 'lime-green'   | 'turquoise'
bootstrapClass  | One of Bootstrap button classes | 'btn-success'  | ''
icon            | Font awesome icon of your choice| 'fa-calendar'  | null
text            | Text on your button             | 'My button'    | ''
centered        | Boolean for centering text      | true           | false

__Note__: You cannot combine the params _color_ and _bootstrapClass_.

#### Usage
```
<lbs-button params="text: 'My button', color: 'magenta', icon: 'fa-money'"></lbs-button>
```

### lbs-button-group
A component to group buttons together. Removes margins and border radius for edges between buttons.
#### Params
No params available

#### Child elements
The component `lbs-button-group` can be used with two different child elements:
* Twitter Bootstrap buttons (using class `.btn`)
* LBS buttons (using component `lbs-button`)

#### Usage
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

### lbs-split-button
A component to group two buttons together. The first button will take 80% of the width of the component and the second one 20%.

#### Params
No params available

#### Child elements
The component `lbs-split-button` can be used with two different child elements:
* Twitter Bootstrap buttons (using class `.btn`)
* LBS buttons (using component `lbs-button`)

#### Usage
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

