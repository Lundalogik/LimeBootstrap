#How does it work?
The new Actionpads are inspired of how a single page application work. Views (basically html-templates) and data(usually JSON) are loaded via AJAX (an asyncrounous javacript call) by the the web application. The template is then rendered by applying the data and the result is shown to the user.

In LIME-bootstraps case lbs.html and lbs.js constitute the main application and all Actionpads set to show `lbs.html`. For simplification we'll call the framework just __LBS__ (LIME Bootstrap). `lbs.html` contians all included CSS, JS and meta tags. The Actionpads (for example company.html) are now just views, containing no included CSS or JS.
lbs.html will detemine which view to load either by a supplied query string (the thing after the questionmark), `../lbs.html?ap=company` or if nothing is supplied, by trying to load a view with the same name as the class of the LIME inspector.

The active inspectors record is then loaded as data and converted to JSON.

Basic flow in LBS:
1.	LBS starts and includes all base CSS, Javascript and sets a lot of environment variables, such as skin color, language.
2.	LBS then checks where you want your display your HTML-view. In LIME you can show HTML in the Actionpad, in a field, in a tab or in a web dialog. If you don't specify anything lbs will assume your building an Actionpad.
3.	The specified view, html-file, is loaded
4.	Data is loaded. LBS will first check `_config.js` for datasources, specified with the name of the view. If no datasources are found LBS will try to load the data from the `ActiveInspector`. A dictionary of local languages translations is loaded. All data is supplied as a JSON-object and then converted to a knockout viewmodel-
5.	Apps are discovered, started and their data is loaded into the main viewmodel. A app can specify depencies on other libraries or styles. These are dynamically loaded and checked for duplicates.
6.	The viewmodel is applied to the now complete view and rendered.

#Loading views
As metioned lbs.html is the real engine and all HTML things should be loaded trough lbs.html. This is achieved by supplying a querystring

`[URL to Actionpad folder]/lbs.html?ap=[path to your view/view name]`

The path is relative the lbs.html file and you should not include the file extension (.html).

Loading the company Actionpad (company.html):

`lbs.html?ap=company`

#The console and debugging your applications
The framework has been blessed with a virtual console, to use for debugging. It is activated through changing `setDebug(true)` in `_config.html`. The console will allways automagically appeare if a critical error is logged. If you make syntacic errors in the wrong place, even the viritual console will crash. You can easily use the console when building apps, read more abot this in the app readme. The console is limited to 30 messages by default.

When working with more advanced stuff you might like to have access to a real console. Modern browsers won't allow dynamically loadings scripts from the local file system, due to security concerns. Dynamically loading scripts and html views are core concepts in LBS. In LIME a small VBA function acts as the loader. However in `system/bin/` you will find a `.bat-file` which will restart Google Chrome in a debug mode, allowing you to inspect the CSS and JS. If you dislike this approach a small HTTP-server will do the trick. With Python3 just go to the actionpad folder and write this in your terminal:

```bash
$python -m http.server
```

#Different wrappers
In LIME HTML can be displayed in the actionpad, in a HTML-field, in a HTML-tab and in a HTML-dialog. Theses places are quite different and requires some basic setup to work well. Your view can thus be loaded into three different wrappers for helping you with the different conditions.

The three basic wrappers of content:
*	Actionpad-wrapper. A thin and long wrapper with a slightly lighter background images with a sharp edge to teh rest of the content:
*	Inline-wrapper. Used for HTML-fields. Completely plain, with the same color as the Inspector and no padding or margin. Built to seamlessly look as a part of the inspector.
*	Tab-wrapper. Used for wider layouts, such as a tab or a dialog. Uses default Twitter Bootstrap margins and is fully responsive.

The Actionpad wrapper is allways used unless anything else is stated. Pick your wrapper by suppling a querystring to lbs.html

__Inline:___ `lbs.html?type=inline`

__Tab:__ `lbs.html?type=tab`

When working with tabs, fields or dialogs it is easiest to use VBA to set the URL. Example:

```VBA
    ActiveInspector.Controls.SetValue("htmlfield", WebFolder & "lbs.html?ap=foo&type=inline")
```

#Data sources

A core concept in LIME Bootstrap is data sources. A data source is just what it sounds like, a source of data. The source can be many things, like a LIME Inspector, a REST web-service, a stored procedure or a VBA function. Data sources are used both while working with basic views and especially when working with apps. The available data sources are:

*   __activeInspector:__ Fetch data from the ActiveInspector. `{type:'activeInspector'}`
*   __xml:__ Execute specified VBA-function which must return a XML as string. `{type:'xml',source:'[Name of VBA-function]' }`
*   __record:__ Execute specified VBA-function which must return a Record object. `{type:'record',source:'[Name of VBA-function]' }`
*   __records:__ Execute specified VBA-function which must return a Records object. `{type:'records',source:'[Name of VBA-function]' }`
*   __localization:__ Loads all translations in the current LIME language. `{localization:'records' }`
*   __storedProcedure:__ Execute specified stored procedure which must be set to "as xml". `{type:'storedProcedure',source:'[Name of stored procedure]' }`
*   __HTTPGetXml:__ Calls a web-service and expects a xml response.   `{type:'HTTPGetXml',source:'[URL]' }`
*   __SOAPGetXml:__ Calls a SOAP web-service.  `{type:'SOAPGetXml',source:{url:[URL], action:[SOAP action as xml string], xml:[SOAP request xml]} }`
*   __relatedRecord:__ Loads a record based on id and class. Used to load related data to an inspector. `{type:'relatedRecord',class:[name of class], idrecord:[Id of record] }`

A data source can also take a parameter "alias", which lets you specify a name for the data source in viewModel.

Examples:

```javascript

 dataSources: 
        [
            {type: 'activeInspector'}, 
            {type: 'localization'},
            {type: 'record', source: 'ActionPadTools.GetCompanyContactData'}, 
            {type: 'storedProcedure', source: ''}
        ],
        autorefresh : false

```

__Note that autorefresh isn't implemented yet!__

#Settings and loading more data - _config.js
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

#Logic in bindnings
Knockout lets you write JavaScript expressions directly in the bindnings. This is a really simple and powerful way of doing cool stuff. Word of advice: Too much logic in the view isn't nice at all. If you need to do a little more advanced stuff, build an app!

Example:

```html

<div class="alert alert-warning fullwidth" data-bind="
    visible: todo.endtime.value !== null && (moment(todo.endtime.value) < moment() && todo.done.value != 1),
    text: 'Uppgiften är ' + (todo.endtime.value != null ? moment(todo.endtime.value).fromNow(true) : '' )+ ' försenad!', 
    icon:'fa-bell'" >
</div>

```

Please note that you can but the bindings on separate rows to increase readability 



