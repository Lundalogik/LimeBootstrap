# lbs-search
A input element for searching


## Params
Param           | Explanation                     | Example value      | Default value
--------------- | ------------------------------- |------------------- | -------------
title           | Title text for the menu         | 'Links'            | ''
filter          | Title text for the menu         | 'Links'            | ''
clear           | Title text for the menu         | 'Links'            | ''
icon            | Title text for the menu         | 'Links'            | ''
placeholder     | Boolean                         | false           | true

## Child elements
The component `lbs-search` should be used with one type of child element:
* LBS List item (`<lbs-list-item>`)

## Usage
```
<lbs-menu params="title: 'Links', expanded: true">
    <lbs-list-item params="text: 'Do funny stuff', icon: 'fa-calendar'" data-bind="click: runMyFunction"></li>
</lbs-menu>
```
