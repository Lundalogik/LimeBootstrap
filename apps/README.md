#LIME-bootstrap apps
Apps are small standalone tools, used for customer customisations. They are loaded dynamically and added only through a single line of HTML in the Actionpad. The business logic and dataconnection is allways performed by the VBA. This functionallity should be inside a single module. 

The general idea of an app is to implement:

1. A function or procedure to deliver data. VBA or SQL, can deliver data as xml, record or records.
2. A view - An html template with the structure of your app.
3. A view-model - the viewmodel holds a rednering and frontend logic

An app is initilaized as:

1. Data is loaded from LIME Pro
2. The data is converted to a view-model (In this case the view model is just a JSON represenation of the data)
3. The view-model is supplied to the app and cam be modified
4. The app view is loaded
5. The view and view-model is rendered and injected to the actionpad 

Initiation of an app is executed by the `lbs.apploader.js` module and triggered by an `data-app:`-attribute.

The data can be provided as XML, record or records and limebootstrap will then supply the app with an View-model based on the data, free for you to work with. In the view model you will also find all translations and avilable data from the current actionpad viewmodel.   

```html
<div data-app="name:'checklist',config:{canBeUnchecked:true,allowRemove:true, canAddTask:true}} " ></div>
```

##App.json
In the App.json file you provide the js files, css files and library files needed by your app.   




##The javascript app structure
	
```javascript
window.[insert_app_name_here] = {

	"data":{}, // Holds the LIME Data in JSON format

	"main":function(){ //Called when the rest of the actionpad is loaded
		//The main app
	},
	"initalize":function(inputData){ //Called 
		// Recive and modify data
		app.data = inputData
	}
}

```
