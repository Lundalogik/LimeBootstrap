## lbs-local-time
Tries to parse a time-input and display it in the local time format

### Params
Param           | Explanation                     | Example value      | Default value
--------------- | ------------------------------- | ------------------ | --------------
time            | A datetime like string or object| '2010-10-20'       |
format          | A Moment.js formating string    | 'll'               | 'LLLL'

!!! info
    Please see Moment.js formating strings [here](https://momentjs.com/docs/#/displaying/format/)

### Usage
```
<lbs-local-time params="time: '2018-06-07'"></lbs-local-time>

```

Outputs `torsdag 7 juni 2018 kl. 23:30` if locale is `se`

-------------------


## lbs-relative-time
Tries to parse a time-input and display it in a relative mannor

### Params
Param           | Explanation                     | Example value      | Default value
--------------- | ------------------------------- | ------------------ | --------------
time            | A datetime like string or object| '2010-10-20'       |

!!! info
    Please see Moment.js [docs](https://momentjs.com/docs/#/displaying/fromnow/)

### Usage
```
<lbs-relative-time params="time: '2016-06-07'"></lbs-relative-time>

```

Outputs `två år sedan` if locale is `se`