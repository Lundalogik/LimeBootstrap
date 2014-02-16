#Basics
Apps are small standalone tools, used for customer customisations. They are loaded dynamically and added only through a single line of HTML in the Actionpad. The business logic and dataconnection is allways performed by the VBA. This functionallity should be inside a single module. 

The general idea of an app is to implement:

1. A function or procedure to deliver data. VBA or SQL, can deliver data as xml, record or records.
2. A view - An html template with the structure of your app.
3. A view-model - the viewmodel holds a rednering and frontend logic

An app is initilaized as:
1. The app is loaded and the config of the app is parsed
2. Data is loaded from LIME Pro, from your supplied function
3. The data is converted to a view-model (In this case the view model is just a JSON represenation of the data)
4. Additional resources are loaded to the app
5. The view-model is supplied to the app and cam be modified
6. The app view is loaded from app.html.
7. The view and view-model is rendered and injected to the actionpad 

Initiation of an app is executed by the `lbs.apploader.js` module and triggered by an `data-app:`-attribute.

The data can be provided as XML, record or records and limebootstrap will then supply the app with an View-model based on the data, free for you to work with. In the view model you will also find all translations and avilable data from the current actionpad viewmodel.   

```html
<div data-app="app:'checklist',config:{canBeUnchecked:true,allowRemove:true, canAddTask:true}} " ></div>
```

**Please note that you can not have a `data-app` and `data-bind` attribute in the same element**

##The javascript app structure
	
```javascript
lbs.apploader.register('template', function () { //Insert name of app here
    var self = this;

    //config
    this.config = {
        dataSources: [ //Either provide your data source here, or let the user of your app supplie it

        ],
        resources: { //Add any extra resources that should be loadad. The paths are realtive your app folder, exept libs which are loaded from system/js/
            scripts: [],
            styles: ['app.css'],
            libs: ['json2xml.js']
        }
    },

    //initialize
    this.initialize = function (node, viewModel) {

        //Use this method to setup you app. 
        //
        //The data you requested along with activeInspector are delivered in the variable viewModel.
        //You may make any modifications you please to it or replace is with a entirely new one before returning it.
        //The returned viewmodel will be used to build your app.


        return viewModel;
    }

```

##Object definitions

#### DataSouce
 `{type: '', source: '', alias:''}`

#### LimeVersion
|Parameter|Type|Comment|
|---|---|---|
|comparable|int||
|full|string||
|major|int||
|minor|int||
|build|int||


##Library attributes
|Parameter|Type|Comment|
|---|---|---|
|lbs.debug|int|if debug modes has been triggered|
|lbs.limeVersion|LimeVersion||
|lbs.limeDataConnection|object|reference to window.external|
|lbs.hasLimeConnection|boolean|has reference to lime?|
|lbs.activeClass|string||
|lbs.activeDatabase|string||
|lbs.activeServer|string||
|lbs.common.iconTemplate|string|template for icon html|


##Library helper functions 

#### lbs.heper.loadDataSorces()
Loads multiple datasources into a JSON objekt
##### Syntax
`lbs.heper.loadDataSorces(viewModel, DataSources, [override])`
##### Parameters
|Parameters|Type|Comment|
|---|---|---|
|viewModel|array|object to assign values to|
|DataSources|Array|sources|
|Override|boolean|if duplicate values should be overriden or thrown away|

#### lbs.heper.loadDataSorce()
Loads a datasources into a JSON objekt
##### Syntax
`lbs.heper.loadDataSorce(viewModel, DataSource, [override])`
##### Parameters
|Parameters|Type|Comment|
|---|---|---|
|viewModel|array|object to assign values to|
|DataSource|DataSouce|source|
|Override|boolean|if duplicate values should be overriden or thrown away|

####lbs.common.getErrorText()
Returnes a funny error adjective :)
#####Syntax
`lbs.common.getErrorText()`
##### Return
string

####lbs.common.escapeHtml()
Escape html
##### Syntax
`lbs.common.escapeHtml(html)`
##### Parameters
|Parameters|Type|
|---|---|
|html|string|
##### Return
string

####lbs.common.createLimeLink()
Create limelink
##### Syntax
`lbs.common.createLimeLink(class,id)`
##### Parameters
|Parameters|Type|
|---|---|
|class|string|
|id|int|
##### Return
string

####lbs.common.getURLParameter()
Extract URL parameter from GET variable
##### Syntax
`lbs.common.getURLParameter(name)`
##### Parameters
|Parameters|Type|
|---|---|
|name|string|
##### Return
string

####lbs.common.executeVba()
Execute VBA code, same as old VBA.run()
##### Syntax
`lbs.common.executeVba(proc,params)`
##### Parameters
|Parameters|Type|
|---|---|
|proc|string|
|params|string|
##### Return
string

####lbs.common.nl2br
replace nl chars with html rowbreaks
##### Syntax
`lbs.common.nl2br(data)`
##### Parameters
|Parameters|Type
|---|---|
|data|string|
##### Return
string

####string.format()
Implementation of c# String.Format()
##### Syntax
`string.format(format,var1,[var2])`
##### Parameters
|Parameters|Type|
|---|---|
|format|string|
|var|replacement varibles|
##### Return
string

####lbs.log.debug
Log message at debug level
##### Syntax
`lbs.log.debug(msg)`
##### Parameters
|Parameters|Type|
|---|---|
|msg|message|

####lbs.log.debug
Log message at info level
##### Syntax
`lbs.log.info(msg)`
##### Parameters
|Parameters|Type|
|---|---|
|msg|message|

####lbs.log.warn
Log message at warn level
##### Syntax
`lbs.log.warn(msg, [e])`
##### Parameters
|Parameters|Type|
|---|---|
|msg|message|
|e|Execption (optional)|

####lbs.log.error
Log message at error level
##### Syntax
`lbs.log.error(msg, [e])`
##### Parameters
|Parameters|Type|
|---|---|---|
|msg|message|
|e|Execption (optional)|