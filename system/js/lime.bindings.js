ko.bindingHandlers.limeLink = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        $(element).click(function () {
            limejs.common.executeVba("shell," + limejs.common.createLimeLink(ko.unwrap(valueAccessor().class),ko.unwrap(valueAccessor().value)));
        });

    },
};

ko.bindingHandlers.vba = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        $(element).click(function () {
            limejs.common.executeVba(valueAccessor());
        });
    },
};

ko.bindingHandlers.showOnMap = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        try {
            $(element).click(function () {
                limejs.common.executeVba("shell,https://www.google.com/maps?q=" + ko.unwrap(valueAccessor()).replace(/\r?\n|\r/g, ' '));
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
            limejs.common.executeVba("shell,tel:" + ko.unwrap(valueAccessor()));
        });
    },
};

ko.bindingHandlers.openURL = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        $(element).click(function () {
            limejs.common.executeVba("shell," + ko.unwrap(valueAccessor()));
        });

    },
};

//limeVisibility
ko.bindingHandlers.vbaVisibility = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        $(element).click(function () {
            var visible = limejs.common.executeVba(ko.unwrap(valueAccessor()));
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
    update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        $(element).prepend("<i class='" + ko.unwrap(valueAccessor()) + "'></i>");
    }
};