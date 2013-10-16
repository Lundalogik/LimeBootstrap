/**
Binding provider override
*/
ko.bindingProvider.parseBindingsString
ko.defaultBindingProvider = ko.bindingProvider.instance;
ko.bindingProvider.instance = {
    nodeHasBindings: ko.defaultBindingProvider.nodeHasBindings,
    getBindings: function (node, bindingContext) {
        var bindings;
        try {
            bindings = ko.defaultBindingProvider.getBindings(node, bindingContext);
            
            //check validity
            this.checkValue(bindings, 'text', node);
            this.checkValue(bindings, 'value', node);

            bindings = this.processDependentBindings(bindings);
        }
        catch (ex) {
            lbs.log.error(ex.message);
            bindings = this.getDummyBindings(node);
            bindings = this.processDependentBindings(bindings);
        }

        return bindings;
    },

    //is value ok to bind to view, empty string is ok, undefined is not
    checkValue: function (data, val, node) {
        if (!data) {return}
        if (!data.hasOwnProperty(val)) {return}
        if (data[val]) { return }
        if (data[val] === "" || data[val] === false || data[val] === 0) { return }

        throw new ReferenceError("Unable to set binding '{0}'.\nBindings value: {1}\nMessage: Property is undefined".format(val, $(node).attr('data-bind')));
    },

    //replace dependent bindings with another that can handle the isses
    processDependentBindings: function (bindings) {

        //no bindings, nothing to do
        if (!bindings) { return }

        //text and icon in same binding
        if (bindings.hasOwnProperty('text') && bindings.hasOwnProperty('icon')) {
            //dont run if text is empty
            if (bindings['text'] !== "") {
                bindings['textWithIcon'] = { icon: bindings['icon'], text: bindings['text'] };
                delete bindings['text'];
                delete bindings['icon'];
            }
        }
        return bindings;
    },

   
    //set visible bindings to the binding values. Used if bindings failed to display helper data.
    getDummyBindings: function (node) {
        var bindings = {};

        //set text
        var match = new RegExp("text\:[^\,\}]*").exec($(node).attr('data-bind'))
        if (match) {bindings['text'] = 'Binding: ' + match[0].split(":")[1].trim()}
           
        //set value
        var match = new RegExp("value\:[^\,\}]*").exec($(node).attr('data-bind'))
        if (match) { bindings['value'] = 'Binding: ' + match[0].split(":")[1].trim() }

        //icons
        var match = new RegExp("icon\:[^\,\}]*").exec($(node).attr('data-bind'))
        if (match) { bindings['icon'] = match[0].split(":")[1].trim().replace(/\'/g, "") }

        return bindings;
    },

};

/**
Text with icon
*/
ko.bindingHandlers.textWithIcon = {
    update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var value = ko.unwrap(valueAccessor());
        var iconHtml = lbs.common.iconTemplate.format(value['icon']);

        $(element).html(iconHtml + '<span></span>')
        ko.bindingHandlers.text.update($(element).find('span').get(0), function () { return value['text'] }, allBindingsAccessor, viewModel, bindingContext)
    }
};

/**
LimeLink    
*/
ko.bindingHandlers.limeLink = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var newValueAccessor = function() {
            return function() {
                 lbs.common.executeVba("shell," + lbs.common.createLimeLink(ko.unwrap(valueAccessor().class), ko.unwrap(valueAccessor().value)));
            };
         };
        ko.bindingHandlers.click.init(element, newValueAccessor, allBindingsAccessor, bindingContext);
    },
};

/**
VBA call  
*/
ko.bindingHandlers.vba = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var newValueAccessor = function() {
            return function() {
                 lbs.common.executeVba(valueAccessor());
            };
         };
        ko.bindingHandlers.click.init(element, newValueAccessor, allBindingsAccessor, bindingContext);
    },
};

/**
Show on google map  
*/
ko.bindingHandlers.showOnMap = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var newValueAccessor = function() {
            return function() {
                lbs.common.executeVba("shell,https://www.google.com/maps?q=" + ko.unwrap(valueAccessor()).replace(/\r?\n|\r/g, ' '));
            };
         };
        ko.bindingHandlers.click.init(element, newValueAccessor, allBindingsAccessor, bindingContext);
    },
};

/**
Call phone (simply drop to shell)
*/
ko.bindingHandlers.call = {
     init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var newValueAccessor = function() {
            return function() {
               lbs.common.executeVba("shell,tel:" + ko.unwrap(valueAccessor()));
            };
         };
        ko.bindingHandlers.click.init(element, newValueAccessor, allBindingsAccessor, bindingContext);
    },
};

/**
Open URL (simply drop to shell)
*/
ko.bindingHandlers.openURL = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var newValueAccessor = function() {
            return function() {
                lbs.common.executeVba("shell," + ko.unwrap(valueAccessor()));
            };
         };
        ko.bindingHandlers.click.init(element, newValueAccessor, allBindingsAccessor, bindingContext);
    },
};

/**
Invoke old-style app
*/
ko.bindingHandlers.appInvoke = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        
        var newValueAccessor = function() {
            if(lbs.hasLimeConnection == true){
                return function() {
                    Invoker.invokeWebApplication(ko.unwrap(valueAccessor()));
                };
            }else{
                return function(){
                    alert("AppInvoker is not avalible outside of lime");
                }
            }
        };
        ko.bindingHandlers.click.init(element, newValueAccessor, allBindingsAccessor, bindingContext);
    },
};

/**
Call VBA function to check if item should be visible 
*/
ko.bindingHandlers.vbaVisibility = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var visible = lbs.common.executeVba(ko.unwrap(valueAccessor()));

        if (visible) {
            $(element).show()
            $(element).removeClass("hidden")
        } else {
            $(element).hide();
            $(element).addClass("hidden")
        }
    }
};

ko.bindingHandlers.email = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var newValueAccessor = function() {
            return function() {
                lbs.common.executeVba("shell,mailto:" + ko.unwrap(valueAccessor()));
            };
        };
        ko.bindingHandlers.click.init(element, newValueAccessor, allBindingsAccessor, bindingContext);
    },
};

/**
Prepend icon
*/
ko.bindingHandlers.icon = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var content = lbs.common.iconTemplate.format(ko.unwrap(valueAccessor()));
        if (
            $(element).text() != '' && $(element).text().substring(0, content.length) != content) {
            $(element).prepend(content);
            element = $(element).get(0);
        }
    }
};

/**
Load datasources by annotation from actionpad view. Not applicable in apps.
*/
ko.bindingHandlers.dataSources = {
    init: function (elem, valueAccessor) {
        var sources = ko.unwrap(valueAccessor());
        lbs.loader.loadDataSources(lbs.vm, sources);
    }
};
ko.virtualElements.allowedBindings.dataSources = true;




