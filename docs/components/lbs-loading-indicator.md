## lbs-loading-indicator
Hides the content inside the component and shows a spinner until load is complete

![A loading indicator](../assets/images/loading-indicator.gif)

### Params
Param           | Explanation                     | Example value      | Default value
--------------- | ------------------------------- | ------------------ | --------------
loading         | Should be a observable          | `true` or `false`  |
size            | Must be one of 'sm', 'md', 'lg', 'xl' | 'sm'         | 'md'


### Usage
```
<lbs-loading-indicator params="loading: loading(), size: 'lg'">
    <span>{{msg}}</span>
</lbs-loading-indicator>
```