# lbs-guard
Guards its content from being rendered. Used to protect against null values and/or active users group membership


## Params
Param                           | Explanation                       | Example value                 | Default value
---------------                 | -------------------------------   |-------------------            | -------------
activeUserIsMemberInOneOfGroups | Checks if active user belongs to group | ['Administrators', 'CIA']| undefined
exists                          | Checks if value is null or undefined | company.undefinedOrNullProp   | undefined

`lbs-guard` can be used with both or either of the input params.

## Usage
```
<lbs-guard params="activeUserIsMemberInOneOfGroups: ['Administrators']">
    ...
</lbs-menu>

<lbs-guard params="exists: company.undefinedOrNullProp ">
    ...
</lbs-menu>
```

!!! info
    Most properties on LimeObjects that doesn't currently hold any value will default to empty string `""`.
    `exists` will only check for `null` or `undefined`, passing other "falsey" values will not cause the guard to be applied