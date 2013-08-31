#LIME-bootstrap apps
Apps are small standalone tools, used for customer customisations. They are loaded dynamically and added only through a single line of HTML in the Actionpad. The business logic and dataconnection is allways performed by the VBA. This functionallity should be inside a single module. 

Initiation of an app is executed by the `limejs.loadApp()` function and triggered by an Data-app attribute. The Data-object provides a link VBA function suppling the data needed by the app. The data is provided in a XML format and limejs.js will then supply the app with an JSON representaion of the data.   

```html
<div data-app="checklist" data-object="Checklist.ProvideChecklist" class="checklist"></div>
```

##App.json
In the App.json file you provide the js files, css files and library files needed by your app.   

```json
app(
	{
	    "scripts": [
	    	"checklist.js"
	    ],
	    "styles": [
	    	"checklist.css"
	    ],
	    "libs": [
	        "json2xml.js",
	        "handlebars.js"
	    ]
	}
 );
```

Actually the format is JSONP to avoid cross scripting errors when fetching local files.

##The javascript app structure


##The VBA app structure
