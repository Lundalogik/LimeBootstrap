# Data sources

A core concept in Lime Bootstrap is data sources. A data source is just what it sounds like, a source of data. The source can be many things, like a Lime Inspector, a REST web-service, a stored procedure or a VBA function. Data sources are used both while working with basic views and especially when working with custom components.

All data sources  takes a paramter `type` and then some other source specific params.

All source can also take a parameter __"alias"__, which lets you specify a name for the data source in ViewModel. This might be usefull if you have multiple sources on the same table wich may otherwise will cause naming collisions.

A data source can either be specified in `_config.js` or programtically created via `lbs.loader.createDataSource()` and for legacy data sources `lbs.loader.loadDataSource()`. An array of data sources can also be sent to `lbs.loader.loadDataSources()`

!!! Example
    Example of loading a few data sources in `_config.js`

        dataSources:
                [
                    {type: 'activeInspector'},
                    {type: 'localization'},
                    {type: 'relatedRecord', source: 'person', view: 'name;phone' , alias: 'contact'},
                    {type: 'storedProcedure', source: ''}
                ],



## Data sources

### limeObject
Fetch data from the Lime CRM api for a selected LimeObject

| Param              | Description                         | Default                    | Required |
|--------------------|-------------------------------------|------------------------    |----------|
| type               | Type of the data source             |                            | true     |
| embed              | Related objects to embed            | []                         | false    |
| alias              | Name of node in the ViewModel       | Name of active Lime Object | false    |
| protocol           | Protocol of fetch                   | https                      | false    |
| limetype           | type of object to fetch             |                            | true     |
Embed fetches data from related objects. It only works for `belongs_to` properties.

!!! Note
    The returned data is almost identical to the answer from the Lime CRM API with one important exception, embedded objects. To make embedded data easier to use directly in a View we push the data from the `_embeded`-node to a `[your object here]`-node.


```
{ type: 'limeObject', alias: 'personOne', limetype: 'person'}
```

For programtic use

```javascript
const dataSource =lbs.loader.createDataSource({ type: 'limeObject', alias: 'personOne', limetype: 'person'})
const data = await dataSource.fetch()
```

### limeObjects
Fetch data from the Lime CRM api for a selected LimeObject

| Param              | Description                                         | Default                    | Required |
|--------------------|-----------------------------------------------------|----------------------------|----------|
| type               | Type of the data source                             |                            | true     |
| embed              | Related objects to embed                            | []                         | false    |
| alias              | Name of node in the ViewModel                       | Name of active Lime Object | false    |
| fetchAll           | Fetches all related data instead of only first page | true                       | false    |
| protocol           | Protocol of fetch                                   | https                      | false    |
| sort               | Property to sort result on                          |                            | false    |
| sortOrder          | 'asc' or 'desc'                                     | desc                       | false    |
| embed              | Related objects to embed                            | []                         | false    |
| filter             | A filter string                                     | []                         | false    |
| size               | Number of items in fetch                            | 0                          | false    |
| limetype           | type of objects to fetch                            |                            | true     |
Embed fetches data from related objects. It only works for `belongs_to` properties.

!!! Note
    The returned data is almost identical to the answer from the Lime CRM API with one important exception, embedded objects. To make embedded data easier to use directly in a View we push the data from the `_embeded`-node to a `[your object here]`-node.


```
{ type: 'limeObjects', alias: 'personOne', limetype: 'person'}
```

For programtic use

```javascript
const dataSource =lbs.loader.createDataSource({ type: 'limeObjects', alias: 'personPlural', limetype: 'person'})
const data = await dataSource.fetch()
```

### activeLimeObject
Fetch data from the Lime CRM api for the currently active LimeObject


| Param              | Description                         | Default                    | Required |
|--------------------|-------------------------------------|------------------------    |----------|
| type               | Type of the data source             |                            | true     |
| embed              | Related objects to embed            | []                         | false    |
| alias              | Name of node in the ViewModel       | Name of active Lime Object | false    |
| protocol           | Protocol of fetch                   | https                      | false    |
Embed fetches data from related objects. It only works for `belongs_to` properties.

!!! Note
    The returned data is almost identical to the answer from the Lime CRM API with one important exception, embedded objects. To make embedded data easier to use directly in a View we push the data from the `_embeded`-node to a `[your object here]`-node.


```
{ type: 'activeLimeObject' , embed: ['coworker']}
```

For programtic use

```javascript
const dataSource =lbs.loader.createDataSource({ type: 'activeLimeObject' , embed: ['coworker']})
const data = await dataSource.fetch()
```

### relatedLimeObjects

Fetch data from the Lime CRM api for related objects to the currently active LimeObject


| Param              | Description                                               | Default  | Required |
|--------------------|-------------------------------------                      |----------|----------|
| type               | Type of the data source                                   |          | true     |
| alias              | Name of node in the ViewModel                             |          | true     |
| fetchAll           | Fetches all related data instead of only first page       | true     | false    |
| sort               | Property to sort result on                                |          | false    |
| sortOrder          | 'asc' or 'desc'                                           | desc     | false    |
| embed              | Related objects to embed                                  | []       | false    |
| filter             | A filter string                                           | []       | false    |
| size               | Number of items in fetch                                  | 0        | false    |
| protocol           | Protocol of fetch                                         | https    | false    |


```javascript
{ type: 'relatedLimeObjects', limetype: 'person', alias: 'persons', protocol: 'http' }
```

For programtic use

```javascript
const dataSource =lbs.loader.createDataSource({ type: 'relatedLimeObjects', limetype: 'person', alias: 'persons', protocol: 'http' })
const data = await dataSource.fetch()
```



### translations

Fetch translations for the specified language for a specific key (owner)


| Param              | Description                               | Default                  | Required |
|--------------------|-------------------------------------      |----------                |----------|
| type               | Type of the data source                   |                          | true     |
| alias              | Name of node in the ViewModel             | txt                      | false    |
| locale             | A string to specified the wanted locale   | Users locale             | false    |
| owner              | Owner of the translation                  | Users locale             | false    |
| protocol           | Protocol of fetch                         | https                    | false    |

```javascript
{ type: 'translations', owner: 'company'}
```

For programtic use

```javascript
const dataSource =lbs.loader.createDataSource({ type: 'translations', owner: 'company'})
const data = await dataSource.fetch()
```

### customEndpoint

Can GET, PUT, POST and DELETE to a Lime CRM Custom Endpoint


| Param              | Description                                            | Default                  | Required |
|--------------------|-------------------------------------                   |----------                |----------|
| type               | Type of the data source                                |                          | true     |
| alias              | Name of node in the ViewModel                          | ''                       | true     |
| relativeUrl        | A url to the custom endpoint, relative the base URL    |                          | true     |
| protocol           | Protocol of fetch                                      | https                    | false    |

```javascript
{ type: 'customEndpoint', alias: 'myData', relativeUrl: 'my_endpoint/my_subfunc/'}
```

For programtic use

```javascript
const dataSource =lbs.loader.createDataSource({ type: 'customEndpoint', alias: 'myData', relativeUrl: 'my_endpoint/my_subfunc/'})

// GET and DELETE
const data = await dataSource.get()
const data2 = await dataSource.delete()

const payload = {prop: 'value'}

// PUT and POST
const data3 = await dataSource.post(payload)
const data4 = await dataSource.put(payload)

```

### runtimeConfig

GET the RuntimeConfig for a specific package or all configs


| Param              | Description                                            | Default                  | Required |
|--------------------|-------------------------------------                   |----------                |----------|
| type               | Type of the data source                                |                          | true     |
| alias              | Name of node in the ViewModel                          | ''                       | true     |
| packageName        | Name of the package                                    |                          | false    |
| protocol           | Protocol of fetch                                      | https                    | false    |

```javascript
{ type: 'runtimeConfig', alias: 'myConfig', packageName: 'limepkg_pizza' }
```

For programmatic use

```javascript
const dataSource = lbs.loader.createDataSource({ type: 'runtimeConfig', alias: 'myConfig', packageName: 'limepkg_pizza'})

// To get all configs, skip the optinal packageName
const dataSource = lbs.loader.createDataSource({ type: 'runtimeConfig', alias: 'allConfigs'})

// GET
const data = await dataSource.get()

```

## Legacy data sources

The legacy datasources fetches data through the use of VBA or directly through the COM-bridge. These datasources are slower, blocking and less compatible with future directions. Avoyd using them or limit your use as much as possible

### activeInspector
Fetch data from the ActiveInspector

The datasource takes no additional params.


### record
Execute specified VBA-function which must return a Record object.

| Param              | Description                         | Default |
|--------------------|-------------------------------------|---------|
| source             | Name of VBA-function                |         |
| PassInspectorParam | Pass activeInspector id for lookups | false   |

### records
Execute specified VBA-function which must return a Records set object.

| Param              | Description                         | Default |
|--------------------|-------------------------------------|---------|
| source             | Name of VBA-function                |         |
| PassInspectorParam | Pass activeInspector id for lookups | false   |

### relatedRecord
Loads additonal fields from a record connected to the active inspector.

| Param  | Description                                 |
|--------|---------------------------------------------|
| source | relationfield on activeinspector            |
| view   | semicolon separeted list of fields to fetch |

### xml
Execute specified VBA-function which must return a XML as string

| Param              | Description                         | Default |
|--------------------|-------------------------------------|---------|
| source             | Name of VBA-function                |         |
| PassInspectorParam | Pass activeInspector id for lookups | false   |

### localization
Execute specified VBA-function which must return a Records set object.

The datasource takes no additional params.

### storedProcedure
Execute specified stored procedure. The procedure must return xml.

| Param  | Description              |
|--------|--------------------------|
| source | Name of stored procedure |

### HTTPGetXml
Calls a web-service and expects a xml response.

| Param  | Description |
|--------|-------------|
| source | URL         |

### SOAPGetXml
Calls a SOAP web-service.

| Param  | Description  |
|--------|--------------|
| source | URL          |
| action | SOAP action  |
| xml    | SOAP request |
