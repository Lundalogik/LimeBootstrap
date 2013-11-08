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
<div data-app="name:'checklist',config:{canBeUnchecked:true,allowRemove:true, canAddTask:true}} " ></div>
```

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

debug
#### limeVersion

limeDataConnection
hasLimeConnection
activeClass
activeDatabase
activeServer

##Library helper functions 

#### lbs.heper.loadDataSorces


#### lbs.heper.loadDataSorce

##### Description
Loads a datasources into a JSON objekt
viewModel, sourceArray, [override]

##### Syntax
`lbs.heper.loadDataSorce(viewModel, DataSource, [override])`

##### Parameters
|Parameters|Type|Comment|
|---|---|---|
|viewModel|array|object to assign values to|
|DataSource|||
|Override|||

##### Return
String

####lbs.common.getErrorText
##### Syntax
`lbs.common.getErrorText()`

####lbs.common.iconTemplate

####lbs.common.escapeHtml
html

####lbs.common.createLimeLink
class id

####lbs.common.getURLParameter
name

####lbs.common.executeVba

####lbs.common.executeVba

####lbs.common.nl2br
####lbs.common.generateGuid

####string.format

####lbs.log.debug

#### lbs.log.info

#### lbs.log.warn
msg exep

#### lbs.log.error
msg exep