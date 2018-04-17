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

### lbs-button
#### Params
Param           | Explanation                     | Example value  | Default value
--------------- | ------------------------------- |--------------- | -------------
color           | One of LBS standard colors      | 'lime-green'   | 'lime-green'
bootstrapClass  | One of Bootstrap button classes | 'btn-success'  | ''
icon            | Font awesome icon of your choice| 'fa-calendar'  | null
text            | Text on your button             | 'My button'    | ''
centered        | Boolean for centering text      | true           | false

Note: You cannot combine the params _color_ and _bootstrapClass_.

#### Usage
```
<lime-button params="text: 'My button', color: 'magenta', icon: 'fa-money'"></lime-button>
```