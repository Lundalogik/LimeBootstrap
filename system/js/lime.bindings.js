
ko.bindingHandlers.limeLink = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
       
            $(element).click(function () {
                limejs.executeVba("shell," + limejs.common.createLimeLink(valueAccessor().limeLink.class, valueAccessor().limeLink.value));
            });
        
    },
};

ko.bindingHandlers.vba = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            $(element).click(function () {
                limejs.common.executeVba(valueAccessor().VBA);
            });
    },
};

ko.bindingHandlers.showOnMap = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        try {
            $(element).click(function () {
                limejs.executeVba("shell,https://www.google.com/maps?q=" + valueAccessor().showOnMap.replace(/\r?\n|\r/g, ' '));
            });
        } catch (e) {
            limejs.log.exception(e);
            limejs.log.error("ShowOnMap failed");
        }
    },
};

ko.bindingHandlers.call = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        $(element).click(function () {
            limejs.executeVba("shell,tel:" + valueAccessor());
        });
    },
};

ko.bindingHandlers.openURL = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            $(element).click(function () {
                limejs.executeVba("shell," + valueAccessor());
            });
        
    },
};

//limeVisibility
ko.bindingHandlers.vbaVisibility = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        $(element).click(function () {
            var visible = limejs.executeVba(valueAccessor);
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

//icon
ko.bindingHandlers.icon = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        $(element).html("<i class='" + valueAccessor() + "'></i>");
    }
};