# LBS Components

The old style way of styling elements using a mix of LBS-specific and Twitter Bootstrap classes in actionpads and apps are being replaced by components. By using these new components as custom elements in your markup, all classes and intended styling will be included.

**Please see the component tab for all availabe components**

__Important__
* You can't use self closing elements when using custom elements such as the LBS components.
* The old way of styling your elements can still be used, but should be considered deprecated.
* You can use data-binds combined with custom elements, but not any data-binds that would change the DOM in any way. Examples that do not work: _icon_, _text_. Examples that do work: _vba_, _click_, _visible_. Visible is not obvious, because it seemingly changes the DOM, but only changes the styling of the element.

