## The header section
The header section is the colorful header of each actionpad. The following colors are provided:

<img src="https://raw.githubusercontent.com/Lundalogik/LimeBootstrapServices/master/web/assets/img/Bootstrap_colors.png">

Usage:

```html
<div class="header-container [insert color here]">
```
## The menu
A menu can be created by the following HTML:

```html
 <ul class="expandable collapsed">
        <li class="menu-header">Text</li>
       ...
</ul>
```

A menu has two properties, __Expandable__ and __collapsed__. The are added in the `<ul>`  class:
`<ul class="menu expandable collapsed">`

__Expandable:__ The menu can be collapsed by clicking the header
__Collapsed:__ The menu is collapsed when the actionpad is loaded. Stupid to use without using Expandable...

## Dropdown button:

A dropdown button can contain many options, while taking up very little space.

```html
<div class="btn-group btn-group-lime"  data-bind="visible:todo.done.value != 1">
    <button class="btn btn-lime btn-default dropdown-toggle" data-toggle="dropdown" data-bind=" text:localize.Actionpad_Todo.headermoveforward, icon: 'fa-caret-down'">
    </button>
    <ul class="dropdown-menu">
        <li data-bind="vba:'ActionPad_todo.Postpone, d, 1', text:localize.Actionpad_Todo.mf1d"></li>
        <li class="divider"></li>
        <li data-bind="vba:'ActionPad_todo.Postpone, ww, 1', text:localize.Actionpad_Todo.mf1w"></li>
        <li data-bind="vba:'ActionPad_todo.Postpone, ww, 2', text:localize.Actionpad_Todo.mf2w"></li>
        <li class="divider"></li>
        <li data-bind="vba:'ActionPad_todo.Postpone, m, 1', text:localize.Actionpad_Todo.mf1m"></li>
        <li data-bind="vba:'ActionPad_todo.Postpone, m, 6', text:localize.Actionpad_Todo.mf6m"></li>
        <li class="divider"></li>
        <li data-bind="vba:'ActionPad_todo.Postpone, yyyy, 1', text:localize.Actionpad_Todo.mf1y"></li>
    </ul>
</div>
```

## Data carousel
Creates a data carousel that can be used when your actionpad is full of stuff. The carousel will build a pages for every first level child regardless of type. OBS! You always need to set height.

   * __Examples__

```html
        <div data-carousel="{height:'25%'}">
            <div data-app="{app:'Fulltextsearch',config:{}}"></div>
            <div>This is your second div</div>
            <ul>
                <li>LBS rules</li>
            </ul>
        </div>
```
