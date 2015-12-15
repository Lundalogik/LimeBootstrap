# Data sources

A core concept in LIME Bootstrap is data sources. A data source is just what it sounds like, a source of data. The source can be many things, like a LIME Inspector, a REST web-service, a stored procedure or a VBA function. Data sources are used both while working with basic views and especially when working with apps.

The datasource configuration takes a paramter `type` and then other source specific params.

A data source can also take a parameter __"alias"__, which lets you specify a name for the data source in viewModel. This might be usefull if you have multiple sources on the same table wich may couse collisions.

### Example:

```javascript
 dataSources:
        [
            {type: 'activeInspector'},
            {type: 'localization'},
            {type: 'relatedRecord', source: 'person', view: 'name;phone' , alias: 'contact'},
            {type: 'storedProcedure', source: ''}
        ],
        autorefresh : false
```

__Note that autorefresh isn't implemented yet!__

The available data sources are:

## __activeInspector__
Fetch data from the ActiveInspector

The datasource takes no additional params.


## __record__
Execute specified VBA-function which must return a Record object.

| Param              | Description                         | Default |
|--------------------|-------------------------------------|---------|
| source             | Name of VBA-function                |         |
| PassInspectorParam | Pass activeInspector id for lookups | false   |

## __records__
Execute specified VBA-function which must return a Records set object.

| Param              | Description                         | Default |
|--------------------|-------------------------------------|---------|
| source             | Name of VBA-function                |         |
| PassInspectorParam | Pass activeInspector id for lookups | false   |

## __relatedRecord__
Loads additonal fields from a record connected to the active inspector.

| Param  | Description                                 |
|--------|---------------------------------------------|
| source | relationfield on activeinspector            |
| view   | semicolon separeted list of fields to fetch |

## __xml__
Execute specified VBA-function which must return a XML as string

| Param              | Description                         | Default |
|--------------------|-------------------------------------|---------|
| source             | Name of VBA-function                |         |
| PassInspectorParam | Pass activeInspector id for lookups | false   |

## __localization__
Execute specified VBA-function which must return a Records set object.

The datasource takes no additional params.

## __storedProcedure__
Execute specified stored procedure. The procedure must return xml.

| Param  | Description              |
|--------|--------------------------|
| source | Name of stored procedure |

## __HTTPGetXml__
Calls a web-service and expects a xml response.

| Param  | Description |
|--------|-------------|
| source | URL         |

## __SOAPGetXml__
Calls a SOAP web-service.

| Param  | Description  |
|--------|--------------|
| source | URL          |
| action | SOAP action  |
| xml    | SOAP request |

## __activeuser__
Gets the currently logged in users record (Only available in 1.10 and above)
