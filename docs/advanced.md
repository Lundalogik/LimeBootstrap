Advanced
======================

## How does it work?

The new Actionpads are inspired of how a single page application work. Views (basically html-templates) and data(usually JSON) are loaded via AJAX (an asyncrounous javacript call) by the the web application. The template is then rendered by applying the data and the result is shown to the user.

In Lime Boostraps case lbs.html and lbs.js constitute the main application and all Actionpads set to show `lbs.html`. For simplification we'll call the framework just __LBS__ (Lime Bootstrap). `lbs.html` contians all included CSS, JS and meta tags. The Actionpads (for example company.html) are now just views, containing no included CSS or JS.

lbs.html will detemine which view to load either by a supplied query string (the thing after the questionmark), `../lbs.html?ap=company` or if nothing is supplied, by trying to load a view with the same name as the class of the Lime CRM inspector.

The active inspectors record is then loaded as data and converted to JSON.

Basic flow in LBS:

1.	LBS starts and includes all base CSS, Javascript and sets a lot of environment variables, such as skin color, language.

2.	LBS then checks where you want your display your HTML-view. In Lime CRM you can show HTML in the Actionpad, in a field, in a tab or in a web dialog. If you don't specify anything lbs will assume your building an Actionpad.

3.	The specified view, html-file, is loaded

4.	Data is loaded. LBS will first check `_config.js` for datasources, specified with the name of the view. If no datasources are found LBS will try to load the data from the `ActiveInspector`. A dictionary of local languages translations is loaded. All data is supplied as a JSON-object and then converted to a knockout viewmodel-

5.	Apps are discovered, started and their data is loaded into the main viewmodel. A app can specify depencies on other libraries or styles. These are dynamically loaded and checked for duplicates.

6.	The viewmodel is applied to the now complete view and rendered.

## Loading views
As metioned lbs.html is the real engine and all HTML things should be loaded trough lbs.html. This is achieved by supplying a query string

`[URL to Actionpad folder]/lbs.html?ap=[path to your view/view name]`

The path is relative the lbs.html file and you should not include the file extension (.html).

Loading the company Actionpad (company.html):

`lbs.html?ap=company`

# The console and debugging your applications
The framework has been blessed with a virtual console, to use for debugging. It is activated through changing `debug: true,` in `_config.js`. The console will allways automagically appeare if a critical error is logged. If you make syntacic errors in the wrong place, even the viritual console will crash. You can easily use the console when building apps, read more abot this in the app readme. The console is limited to 30 messages by default.

When working with more advanced stuff you might like to have access to a real console. Modern browsers won't allow dynamically loadings scripts from the local file system, due to security concerns. Dynamically loading scripts and html views are core concepts in LBS. In Lime CRM a small VBA function acts as the loader. However in `system/bin/` you will find a `.bat-file` which will restart Google Chrome in a debug mode, allowing you to inspect the CSS and JS. If you dislike this approach a small HTTP-server will do the trick. With Python3 just go to the actionpad folder and write this in your terminal:

```bash
$python -m http.server
```

##Different wrappers
In Lime CRM HTML can be displayed in the actionpad, in a HTML-field, in a HTML-tab and in a HTML-dialog. Theses places are quite different and requires some basic setup to work well. Your view can thus be loaded into three different wrappers for helping you with the different conditions.

The three basic wrappers of content:

*	__Actionpad-wrapper__. A thin and long wrapper with a slightly lighter background images with a sharp edge to teh rest of the content:
*	__Inline-wrapper__. Used for HTML-fields. Completely plain, with the same color as the Inspector and no padding or margin. Built to seamlessly look as a part of the inspector.
*	__Tab-wrapper__. Used for wider layouts, such as a tab or a dialog. Uses default Twitter Bootstrap margins and is fully responsive.

The Actionpad wrapper is allways used unless anything else is stated. Pick your wrapper by suppling a querystring to lbs.html

__Inline:___ `lbs.html?type=inline`
__Tab:__ `lbs.html?type=tab`

When working with tabs, fields or dialogs it is easiest to use VBA to set the URL. Example:

```VBA
    ActiveInspector.Controls.SetValue("htmlfield", WebFolder & "lbs.html?ap=foo&type=inline")
```

## Settings and loading more data - _config.js

For loading additional data or enabling the debug mode you have a file called `_config.js`.

Example:

```javascript
/**
Enable or disable the debug console 
for the whole application
**/
lbs.setDebug(true);

/**
Configure special use cases,
mainly when requiring additional data sources
**/

lbs.configure({
    'index' : { // <-- name of view
        dataSources: [
             { type: 'localization', source: '' },
        ],
        autorefresh : false
    }
})
```

## Logic in bindnings
Knockout lets you write JavaScript expressions directly in the bindnings. This is a really simple and powerful way of doing cool stuff. Word of advice: Too much logic in the view isn't nice at all. If you need to do a little more advanced stuff, build an app!

Example:

```html

<div class="alert alert-warning fullwidth" data-bind="
    visible: todo.endtime.value !== null && (moment(todo.endtime.value) < moment() && todo.done.value != 1),
    text: 'Uppgiften är ' + (todo.endtime.value != null ? moment(todo.endtime.value).fromNow(true) : '' )+ ' försenad!',
    icon:'fa-bell'" >
</div>

```

Please note that you can put the bindings on separate rows to increase readability

## Cookies
Cookies are used to store values from the actionpads and apps. Every cookie is locally stored in the actionpad folder and is unique for every computer and database (not user). There are two methods that you can use to handle a cookie: 

### Get cookie
To get the value in a cookie use the method lbs.bakery.getCookie(name)

```javascript
var mycookievalue = lbs.bakery.getCookie(“gingerbread”)
```
### Set Cookie
To set a cookie just call the function lbs.bakery.setCookie(name,value,days). See example below. 

```javascript
lbs.bakery.setCookie(“gingerbread”,mycookievalue,3)
```
