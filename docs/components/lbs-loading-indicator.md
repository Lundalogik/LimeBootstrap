## lbs-loading-indicator
Hides the content inside the component and shows a spinner until load is complete

![A loading indicator](../assets/images/loading-indicator.gif)

### Params
Param           | Explanation                     | Example value      | Default value
--------------- | ------------------------------- | ------------------ | --------------
loading         | Should be a observable          | `true` or `false`  |


### Usage
```
<lbs-loading-indicator params="loading: loading()">
    <span>{{msg}}</span>
</lbs-loading-indicator>
```