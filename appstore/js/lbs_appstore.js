var lbsappstore = {
    init: function () {
        $.getJSON('http://api.lime-bootstrap.com/apps?page=1', function (data) {
            var vm = new viewModel();
            vm.populateFromRawData(data)
            vm.pages = ko.observableArray();
            for (i = data._self._current_page; i <= data._self._total_pages; i++) {
                vm.pages.push(new vm.pageFactory(i));
                vm.loadMoreData(i);
            }
            vm.setActiveApp();
            vm.setInitalFilter();
            
            ko.applyBindings(vm);
            $('pre code').each(function (i, e) { hljs.highlightBlock(e) });
        });
    }
};

/**
ViewModel for whole application
*/
var viewModel = function () {
    var self = this;

    self.apps = ko.observableArray();
    self.expandedApp = ko.observable();
    self.activeFilter = ko.observable();
    self.searchvalue = ko.observable();
    self.mergeMenu = ko.observable(false);
    self.activepage = ko.observable(1);
    self.loadedpages = [1];
    // self.hitcounter = ko.observable();

    self.runsinlime = ko.observable(false);

    if (window.external && window.external.database) {
        self.runsinlime(true);
    }

    self.loadMoreData = function(pagenumber){
        if (self.loadedpages.indexOf(pagenumber) == -1){
            //$.getJSON('http://api.lime-bootstrap.com/apps?page=' + pagenumber, function (data) {
            //    self.populateFromRawData(data);
            //});            
                $.ajax({
                    url: 'http://api.lime-bootstrap.com/apps?page=' + pagenumber,
                    type: 'get',
                    dataType: 'json',
                    cache: true,
                    async: false,
                    success: function(data){
                        self.populateFromRawData(data)
                    },
                    error: function () {
                        console.log("något sket sig");
                    }
                    
                });            
            self.loadedpages.push(pagenumber);    
        }
        
    }
    // utility for converting to grid
    self.listToMatrix = function (list, elementsPerSubArray) {
        var matrix = [], i, k;
        for (i = 0, k = -1; i < list.length; i++) {
            if (i % elementsPerSubArray === 0) {
                k++;
                matrix[k] = [];
            }
            matrix[k].push(list[i]);
        }
        return matrix;
    }

    // populate VM from JSON data
    self.populateFromRawData = function (rawData) {        
        var currentpage = rawData._self._current_page; 
        
        $(rawData.apps).each(function (index, app) {
            if (app.name) {
                self.apps.push(new appFactory(app, currentpage))
            }
        });
    }

    self.pageFactory = function(pagenumber){
        var page = this;
        page.pagenumber = pagenumber;
        page.nextpage = function(){
            self.activepage(this.pagenumber);
        }
        return page;
    }

    // post processing
    self.postProcessingLogic = function (elements) {
        $(elements).find("#expanded-" + self.expandedApp()).modal('show');
    };

    // computed grid view with filters
    self.appsGrid = ko.computed(function () {
        //filter apps in the correct status
        var apps = ko.utils.arrayFilter(this.apps(), function (item) {
            if (self.searchvalue()) {
                var scrollTop = $(window).scrollTop();
                if (scrollTop >= 200) {
                    $(window).scrollTop(0);
                    $('#navbar-search').focus();
                }
                if ((item.appName().toLowerCase().indexOf(self.searchvalue().toLowerCase()) >= 0)) {
                    return item;
                }
            }
            else {
                if (self.activeFilter()) {
                    if (self.activeFilter().text === 'All') {
                        return item.currentpage == self.activepage();
                    }
                    else if (self.activeFilter().text === 'New') {
                        if (Object.prototype.toString.call(item.info.versions()[0]) !== '[object Undefined]') {
                            return moment(item.info.versions()[0].date()).format('YYYY-MM-DD') > moment().subtract(90, 'days').format('YYYY-MM-DD') && (item.info.status() === 'Release' || item.info.status() === 'Beta');
                        }
                    }
                    else {
                        return item.info.status() == (self.activeFilter() ? self.activeFilter().text : '');
                    }
                }
            }
            
        });

        // sort
        apps.sort(function (l, r) { return l.name() > r.name() ? 1 : -1 });

        if (self.searchvalue()) {

        }

        // transform into grid
        return self.listToMatrix(apps, 3);
    }, this);

    // set active app
    self.setActiveApp = function () {
        // App show be shown from start

        var activeApp = ko.utils.arrayFirst(self.apps(), function (item) {
            return "#" + item.name() == location.hash;
        });

        if (activeApp) {
            activeApp.expandedApp(true);
            self.expandedApp(activeApp.name())
        }
    }

    // set initial filter
    self.setInitalFilter = function () {
        var filter = ko.utils.arrayFirst(self.avaliableStatuses(), function (item) {
            return item.text == 'All';
        });
        self.selectStatusFilter(filter);
    }

    // computed view of avaliable statuses
    self.avaliableStatuses = ko.computed(function () {
        // get the statuses
        var values = ko.utils.arrayMap(self.apps(), function (item) {
            return item.info.status();
        });
        values.push('All');
        values.push('New');
        // make them unique
        values = ko.utils.arrayGetDistinctValues(values).sort();
        // assign new meta data
        values = ko.utils.arrayMap(values, function (item) {
            var text = item;
            var style;
            var selected = false;
            switch (item) {
                case 'Release':
                    style = "btn-success"
                    break;
                case 'Beta':
                    style = "btn-warning"
                    break;
                case 'Development':
                    style = "btn-danger"
                    break;
            }

            // return an object with properties
            return {
                text: text,
                style: style,
                default_style: 'btn-default',
                selected: ko.observable(selected)
            }
        });

        return values;
    });


    // assign a status filter
    self.selectStatusFilter = function (item) {
        // disable old filter
        if (self.activeFilter()) {
            self.activeFilter().selected(false);
            $('.nav-appstore').find('a').removeClass('active-appstore');
            $('#' + item.text).addClass('active-appstore');
        }
        // set new filter
        self.activeFilter(item);

        // enable filter
        self.activeFilter().selected(true);
    }

    // assign a status filter
    self.showStartFilter = function (item) {
        self.activeFilter(item);
        self.activeFilter().selected(true);
    }
    $(window).scroll(function () {
        var scrollTop = $(window).scrollTop();
        if (scrollTop >= 200) {
            self.mergeMenu(true);
        }
        else {
            self.mergeMenu(false);
        }
    });
}


/**
ViewModel for an app
*/
var appFactory = function (app, currentpage) {
    var self = this;
    self.images = [];
    self.currentpage = currentpage;

    /**
	Sets default picture if app images is missing.
	*/
    self.runswithlip = ko.observable(false);
    if (window.external && window.external.database) {
        self.runswithlip(true);
    }
    if (app.images.indexOf(',') > -1) {
        self.images = app.images.split(',');
    }
    else {
        self.images.push(app.images)
    }

    self.smallImage = "";
    //$.each(self.images, function (index, image) {

        $.each(app.images, function (imageindex, imagedata) {
            
            //if (image == imagedata.file_name) {
            if (imagedata.file_name.indexOf("small") > -1) {
                self.smallImage = "data:image/" + imagedata.file_type + ";base64," + imagedata.blob.replace("b'", "").replace("'", "");
            }
            else {
                var img = "data:image/" + imagedata.file_type + ";base64," + imagedata.blob.replace("b'", "").replace("'", "");
                self.smallImage = img
                self.bigImage = img
                //}
                //else {
                //    self.bigImage = ["../assets/img/_default.png"];
                //    self.smallImage = ["../assets/img/_default.png"];
                //}
            }

            //}
        });

    //})
    if (self.smallImage === "") {
        self.bigImage = ["http://limebootstrap.lundalogik.com/web/appstore/img/_default.png"];
        self.smallImage = ["http://limebootstrap.lundalogik.com/web/appstore/img/_default.png"];
    }

    self.changeAppInfo = function (app, item) {
        console.log(item.currentTarget.id);
        console.log(app);
    }
    //Downloads app
    self.password = ko.observable('');
    self.wrongpassword = ko.observable(false);
    self.logintext = ko.observable('You need to be authenticated to download this application.')

    //self.name = ko.observable(app.name.charAt(0).toUpperCase() + app.name.slice(1))
    self.name = ko.observable(app.name);
    self.readme = marked(app.readme);
    self.expandedApp = ko.observable(false);
    self.info = ko.mapping.fromJS(app);
    self.displayName = app.displayName;
    self.license = ko.observable(app.license);
    self.statusColor = ko.computed(function () {
        if (self.info.status) {
            switch (app.status) {
                case 'Release':
                    return "label-success"
                case 'Beta':
                    return "label-warning"
                case 'Development':
                    return "label-danger"
                case 'N/A':
                    return "label-danger"
            }
        }
    });

    self.expandApp = function (app) {
        app.expandedApp(true);
        location.hash = app.name()
        $("#expanded-" + app.name()).modal('show');
    };

    self.closeApp = function (app) {
        app.expandedApp(false);
        location.hash = '';
        $("#expanded-" + app.name()).modal('hide');
        $(".download-without-password").show();
        $(".download-with-password").hide();
        
    };
    self.download = function () {
        if (self.license()) {
            location.href = 'http://api.lime-bootstrap.com/apps/' + self.name() + '/download'
        }
        else{
            $(".download-without-password").hide();
            $(".download-with-password").fadeIn();
            $("#passwordinput").focus();  
            self.wrongpassword(false);
        }
    };
    self.closeLogIn = function () {
        $("#sign_in").modal('hide');
        self.passwordOk(false);
        self.password123('');
        self.logintext('You need to be authenticated to download this application.');
    }

    self.downloadApp = function () {
        if (self.password()!="") {
            if(self.password() ==="LLAB"){
                console.log("downloaing app");
                location.href = 'http://api.lime-bootstrap.com/apps/' + self.name() + '/download'
                self.password('');
                self.wrongpassword(false);
            }
            else{
                self.password('');
                self.wrongpassword(true);
            }
        }
    }

    self.installappwithlip = function () {
        if (self.name()) {
            window.external.run('LBSHelper.RunLip', self.name());
        }
    }


    self.appName = ko.computed(function () {
        if (self.displayName){
            return self.displayName;
        }
        else if (self.info) {
            //return self.info.name().charAt(0).toUpperCase() + self.info.name().slice(1);
            return self.info.name();
        } else {
            //return self.name().charAt(0).toUpperCase() + self.name().slice(1);
            return self.name();
        }
    });

    self.githubAddress = function () {
        location.href = 'https://github.com/Lundalogik/LimeBootstrapAppStore/tree/master/' + self.name()
    };
}


/**
Lets get this party on the road
*/
$(function () {
    $(document).ready(function () {
        lbsappstore.init();
        if ($(location.hash).length > 0) {
            $("#expanded-checklist").modal('show');
        }
    });
});


ko.bindingHandlers.icon = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var content = "<i class='glyphicon " + ko.unwrap(valueAccessor()) + "'></i>"
        if (
            $(element).text() !== '' && $(element).text().substring(0, content.length) != content) {
            $(element).prepend(content);
            element = $(element).get(0);
        }
    }
};
