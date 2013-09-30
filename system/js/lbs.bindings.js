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
            if (this.checkBindingValidityFailure(bindings)) {
                bindings = undefined
                throw new ReferenceError("Unable to parse binding.\nBindings value: " + $(node).att('data-bind') + "\nProperty is undefined");
            }
        }
        catch (ex) {
            console.log(ex.message);
            lbs.loader.setFallBackDummyData(node);
        }

        return bindings;
    },
    //Check binding validity
    checkBindingValidityFailure: function (bindings) {
        return (!this.checkValue(bindings, 'content') || !this.checkValue(bindings, 'text') || !this.checkValue(bindings, 'value'))
    },
    //is value ok to bind to view, empty string is ok, undefined is not
    checkValue: function (data, val) {
        if (!data) {return true}
        if(!data.hasOwnProperty(val)){ return true}
        return data[val] ? true : (data[val ]=== "")
    },

};

/**
LimeLink    
*/
ko.bindingHandlers.limeLink = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        $(element).click(function () {
            lbs.common.executeVba("shell," + lbs.common.createLimeLink(ko.unwrap(valueAccessor().class), ko.unwrap(valueAccessor().value)));
        });

    },
};

/**
VBA call  
*/
ko.bindingHandlers.vba = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        $(element).click(function () {
            lbs.common.executeVba(valueAccessor());
        });
    },
};

/**
Show on google map  
*/
ko.bindingHandlers.showOnMap = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        $(element).click(function () {
            lbs.common.executeVba("shell,https://www.google.com/maps?q=" + ko.unwrap(valueAccessor()).replace(/\r?\n|\r/g, ' '));
        });
    },
};

/**
Call phone (simply drop to shell)
*/
ko.bindingHandlers.call = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        $(element).click(function () {
            lbs.common.executeVba("shell,tel:" + ko.unwrap(valueAccessor()));
        });
    },
};

/**
Open URL (simply drop to shell)
*/
ko.bindingHandlers.openURL = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        $(element).click(function () {
            lbs.common.executeVba("shell," + ko.unwrap(valueAccessor()));
        });

    },
};

/**
Call VBA function to check if item should be visible 
*/
ko.bindingHandlers.vbaVisibility = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var visible = lbs.common.executeVba(ko.unwrap(valueAccessor()));

        var visible = true;

        ko.unwrap(valueAccessor());
        if (visible) {
            $(element).show()
            $(element).removeClass("hidden")
        } else {
            $(element).hide();
            $(element).addClass("hidden")
        }
    }
};

/**
Prepend icon
*/
ko.bindingHandlers.icon = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var content = "<i class='" + ko.unwrap(valueAccessor()) + "'></i>";
        if (
            $(element).text() != '' && $(element).text().substring(0, content.length) != content) {
            $(element).prepend(content);
            element = $(element).get(0);
        }
    }
};

/**
Static text
*/
ko.bindingHandlers.content = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        ko.bindingHandlers.text.update(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext)
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




