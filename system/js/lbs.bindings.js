/**
LimeLink    
*/
ko.bindingHandlers.limeLink = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        $(element).click(function () {
            lbs.common.executeVba("shell," + lbs.common.createLimeLink(ko.unwrap(valueAccessor().class),ko.unwrap(valueAccessor().value)));
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
        try {
            $(element).click(function () {
                lbs.common.executeVba("shell,https://www.google.com/maps?q=" + ko.unwrap(valueAccessor()).replace(/\r?\n|\r/g, ' '));
            });
        } catch (e) {
            lbs.log.exception(e);
            lbs.log.error("ShowOnMap failed");
        }
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
        $(element).click(function () {
            var visible = lbs.common.executeVba(ko.unwrap(valueAccessor()));
            if (visible == true) {
                $(this).show();
                $(this).removeClass("hidden")
            } else {
                $(this).hide();
                $(this).addClass("hidden")
            }
        });
    }
};

/**
Prepend icon
*/
ko.bindingHandlers.icon = {
    update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        $(element).prepend("<i class='" + ko.unwrap(valueAccessor()) + "'></i>");
    }
};

/**
Load datasources by annotation from actionpad view. Not applicable in apps.
*/
ko.bindingHandlers.dataSources = {
    init: function (elem, valueAccessor) {
        var sources = ko.unwrap(valueAccessor());
        lbs.loader.loadDataSources(lbs.vm,sources);
    }
};
ko.virtualElements.allowedBindings.dataSources = true;