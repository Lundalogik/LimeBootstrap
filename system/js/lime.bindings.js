//limeData
//ko.bindingHandlers.limeData = {
//    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
//        $(element).append(valueAccessor);
//    }
//};

//limeActions
ko.bindingHandlers.limeAction = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        //LimeLink
        if (valueAccessor().limeLink) {
            $(element).click(function () {
                limejs.executeVba("shell," + limejs.common.createLimeLink(valueAccessor().limeLink.class, valueAccessor().limeLink.value));
            });
        }
        //VBA
        if (valueAccessor().VBA) {
            $(element).click(function () {
                limejs.common.executeVba(valueAccessor().VBA);
            });
        }
        //showOnMap
        if (valueAccessor().showOnMap) {
            try {
                $(element).click(function () {
                    limejs.executeVba("shell,https://www.google.com/maps?q=" + valueAccessor().showOnMap.replace(/\r?\n|\r/g, ' '));
                });
            } catch (e) {
                limejs.log.error("ShowOnMap", e);
            }
        }
        //call
        if (valueAccessor().call) {
            $(element).click(function () {
                limejs.executeVba("shell,tel:" + valueAccessor().call);
            });
        }
        //openURL
        if (valueAccessor().openURL) {
            $(element).click(function () {
                limejs.executeVba("shell," + valueAccessor().openURL);
            });
        }
    }
};

//limeVisibility
ko.bindingHandlers.limeVisibility = {
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