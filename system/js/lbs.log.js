lbs.log = {

    /**
    active viewModel instance
    */
    vm: null,

    verboseLevelEnum: {
        debug: 3,
        info: 2,
        warn: 1,
        error: 0
    },

    /**
    Setup the lof and create view model
    */
    setup: function (enabled) {        
        //loadViewScript
        lbs.loader.loadView('system/view/debug',$("#debug"));
        //create viewModel
        this.vm = new lbs.log.vmFactory(enabled);
        ko.applyBindings(this.vm, $("#debug").get(0));
    },

    /**
    Log to the custom view in the actionpad

    TODO: implement limitation depending on theshold
    */
    logToDom: function (type, msg) {        
        //if (!lbs.debug) { return; };
        if (lbs.log.vm) {
            lbs.log.vm.addEntry(type.toUpperCase(), msg);
        }
    },



    /**
    Log to the console if in chrome
    
    TODO: implement limitation depending on theshold
    */
    logToConsole: {
        debug: function (msg) {            
            try { console.debug(msg); } catch (e) { }
        },
        info: function (msg) {
            try { console.info(msg); } catch (e) { }
        },
        warn: function (msg) {
            try { console.warn(msg); } catch (e) { }
        },
        error: function (msg) {            
            lbs.error = true;
            lbs.log.vm.errorFound(true);
            lbs.SetTouchEnabled(true);
            try { console.error(msg) ;} catch (e) { }
        },
    },    
    /**
    Log entry function for app printing
    */
    "log": function () {
        lbs.log.logToConsole.debug(arguments);
        for (var i = 0; i < arguments.length; i++) {
            if (Array.isArray(arguments[i])) {
                arguments[i] = ko.toJSON(arguments[i], null, 0);
            }
            else if (typeof arguments[i] === 'object') {
                arguments[i] = ko.toJSON(arguments[i], undefined, 4);
            }
            else {
                arguments[i] = arguments[i].toString();
            }
            lbs.log.logToDom('LOG', lbs.common.nl2brIndent(arguments[i]));
        }

    },

    "debug": function (msg) {                
        if (lbs.verboseLevel >= lbs.log.verboseLevelEnum.debug) {
            lbs.log.logToDom('DEBUG', lbs.common.nl2brIndent(msg));
            lbs.log.logToConsole.debug((msg));
        }
    },

    /**
    Log entry function for info
    */
    "info": function (msg) {        
        if (lbs.verboseLevel >= lbs.log.verboseLevelEnum.info) {
            lbs.log.logToDom('INFO', lbs.common.nl2brIndent(msg));
            lbs.log.logToConsole.info((msg));
        }
    },

    /**
    Log entry function for warn
    */
    "warn": function (msg, e) {        
        if (lbs.verboseLevel >= lbs.log.verboseLevelEnum.warn) {
            if (e) { lbs.log.exception(e, 'WARN'); }
            lbs.log.logToDom('WARN', lbs.common.nl2brIndent(msg));
            lbs.log.logToConsole.warn((msg));
        }
    },

    /**
    Log entry function for error
    */
    "error": function (msg, e) {
        if(e){lbs.log.exception(e);}
        lbs.log.logToDom('ERROR', lbs.common.nl2brIndent(msg));
        lbs.log.logToConsole.error((msg));
    },
    /**
    Log entry function for exception
    */
    "exception": function (e, level) {        
        if (lbs.verboseLevel >= lbs.log.verboseLevelEnum.error) {
            lbs.log.logToDom('ERROR', lbs.common.nl2brIndent(e.toString()));
            lbs.log.logToConsole.error(e.toString());
        }
    },

    /**
    Log to LIME Pro infolog tab.
    type should be either 'info', 'warning' or 'error'.
    */
    logToInfolog: function (type, msg) {
        try{
            if (type !== 'info' && type !== 'warning' && type !== 'error') {
                type = 'info';
            }
            if(typeof msg === 'object'){
                msg = JSON.stringify(msg);
            }
            else if(typeof msg !== 'string'){
                msg = msg.toString();
            }
            lbs.common.executeVba('LBSHelper.logToInfolog,' + type + ',' + msg.replace(/,/g, '!@!').replace(/'/g, '%&%'));
        }
        catch(err) {
            lbs.common.executeVba('LBSHelper.logToInfolog,' + "error" + ',' + err.toString().replace(/,/g, '!@!').replace(/'/g, '%&%'));
        }

    }
};

/**
ViewModel factory 
*/
lbs.log.vmFactory = function (enabled) {
    //Number of items to show in log
    var self = this;
    this.maxNbrOfItems = 30;
    this.logItems = ko.observableArray([]);
    this.enabled = ko.observable(enabled);
    this.delayedLogItems = [];
    this.delayedLoggingEnabled = true;
    this.showUpgrade = ko.observable(false);
    this.appUpdates = ko.observableArray();
    this.showLBSVersion = ko.observable(false);
    this.remoteVersion = ko.observable();
    this.errorFound = ko.observable(false);

    this.addAppUpdate = function(appName){
        self.showUpgrade(true);
        self.appUpdates.push(appName);
    };

    this.enableConsole = function () {
        this.delayedLoggingEnabled = false;
        this.pushDelayedLogItems();
    };
    // different types of logs
    this.addEntry = function (lev, item) {        
        ico = 'icon-exclamation';
        rowclass = 'alert alert-info';
        switch (lev) {
            case 'DEBUG':
                ico = 'fa fa-cog';
                rowclass = 'alert alert-info';
                break;
            case 'INFO':
                ico = 'fa fa-info-circle';
                rowclass = 'alert alert-info';
                break;
            case 'WARN':
                ico = 'fa fa-warning';
                rowclass = 'alert alert-warning';
                break;            
            case 'LOG':
                ico = 'fa fa-paw';
                rowclass = 'alert alert-success';
                break;
            case 'ERROR':
                ico = 'fa fa-times-circle';
                rowclass = 'alert alert-danger';
                this.enabled(true);
                break;
        }


        //log to delayed list
        if (this.delayedLoggingEnabled) {
            this.delayedLogItems.push({ level: lev, text: item, icon: ico, liclass: rowclass });
        }
        //log to real log
        else
        {
            //remove first item if to meny in log
            if (this.logItems().length >= this.maxNbrOfItems) {
                this.logItems.shift();
            }
            this.logItems.push({ level: lev, text: item, icon: ico, liclass: rowclass });
        }
    },

    /*
    push delayed items into log
    */
    this.pushDelayedLogItems = function(){
        var key;
        for (key in this.delayedLogItems) {
            this.logItems.push(this.delayedLogItems[key]);
        }
    };
};



lbs.log.watch = {

    show : function(state){
        var wvm = new lbs.log.watch.vmFactory();
        if(state !== ''){wvm.initState = state;}
        var dialog = showModalDialog("lbs.html?sv=watch&&type=tab",wvm,"status:false;dialogWidth:900px;dialogHeight:820px;resizable:Yes");
    },

    setup : function(){
        //only applicable for watch view
        if(lbs.activeClass != 'system/view/watch'){
            return;
        }

        if(window.dialogArguments){

            lbs.log.vm.enabled(false);
            lbs.SetTouchEnabled(true);

            //fetch vm from args
            var args = window.dialogArguments;

            //recrate vm in new scope. Some properties and knockout stuff
            //may not survive the modal reference
            var wvm = new lbs.log.watch.vmFactory();
            wvm.vms = args.vms;
            wvm.logItems = args.logItems;
            wvm.initState = args.initState;
            wvm.dom = args.dom;

            //load to global vm
            vm = lbs.common.mergeOptions(lbs.vm, wvm || {}, true);

            //set active vm
            wvm.selectState(wvm.initState);
            wvm.selectVm(wvm.vms[0]);

            //add trigger tot close watch 27 = enter. Ctrl+f will focus the search input
            var map = { 70: false, 27: false, 17: false };
            $('body').keydown(function (e) {
                if (e.keyCode in map) {
                    map[e.keyCode] = true;
                    if (map[70] && map[17]) {
                        $('#searchValue').focus();                        
                        map[70] = false;
                        map[17] = false;
                    }
                    if (map[27]) {
                        window.close();
                        map[27] = false;
                    }
                }
            }).keyup(function (e) {                
                if (e.keyCode in map) {
                    map[e.keyCode] = false;
                }
            });
        }
    },

    //syntax highligt
    sh : function(){
        $('pre code').each(function(i, e) {hljs.highlightBlock(e);});
    },

    vmFactory : function(){
        var self = this;

        //data holders
        self.selectedVm = ko.observable({'name':'',vm:{}});
        self.vms = [];
        self.logItems = [];
        self.selectedState = ko.observable("LOG");
        self.states = ['LOG','WATCH','DOM'];
        self.initState = 'LOG';
        self.searchValue = ko.observable().extend({ throttle: 50 });
        self.logView = ko.observable("SHOW ALL");
        self.logStatus = ['LOG'];
        self.watchSelected = ko.observable(false);
        
    
        //var html is used to save main html
        var html = "";
        self.counter = ko.observable(0);
        self.order = ko.observable(0);

        //format vm as string. clears var html
        self.prettyVm = ko.computed(function () {
            html = "";
            self.searchValue("");
            return JSON.stringify(self.selectedVm().vm, null, 2);            
        });

        $('body').keypress(function (e) {            
            if (e.which == 13) {
                self.goToNext();                
            }
        });

        self.select = function(){
            self.watchSelected(true);
            $('#vmDataText').height($('#vmDataText').prop('scrollHeight'));
            
        }
        self.deSelect = function(){
            self.watchSelected(false);
        }
        self.copyWatch = function(){
            window.clipboardData.setData('Text', $('#vmDataText').text());
        }
        //search a VM        
        self.searchValue.subscribe(function (searchString) {            
            var lowerString = searchString.toLowerCase();
            var newPrettyVm = null;
            self.order(0);
            //checks if the lowerString is bigger than 1 to make the search less demanding
            if (lowerString.length > 1) {
                var re = new RegExp(lowerString, "g");
                var tempHtml = $('#vmData').html();                
                if (html === "") {
                    html = tempHtml;
                }
                else {
                    $('#vmData').html(html);
                }                               
                self.counter(self.replaceText($('#vmData'), re, lowerString, searchString));
                self.goToNext();
            }
            else {
                self.counter(0);
                if (html == "") {
                    $('#vmData').html($('#vmData').html());
                }
                else {
                    $('#vmData').html(html);
                }
            }
        });

        //used for the scroll
        self.goToNext = function () {
            //checks in which order scroll will work
            if ((self.order() < self.counter() && self.counter() > 0)) {  
                
                var target = '#' + self.order();
                if ($(target).length > 0) {
                    $('#watchContainer').animate({
                        scrollTop: $(target).offset().top + $('#watchContainer').scrollTop() - 200
                    }, 200);

                    var old = '#' + (self.order() - 1).toString(16);
                    if ($(old).hasClass("highlight-grey")) {
                        $(old).removeClass('highlight-grey').addClass('highlight-yellow');
                    }

                    $(target).addClass('highlight-grey');
                    self.order(self.order() + 1);
                }
            }
            else {
                self.order(0);
                self.goToNext();
            }
        }        
        //insert highlight on search string
        self.replaceText = function (html, reg, lowString, orgString) {            
            var i = 0;            
            $(html).find('span').each(function () {
                if (($(this).hasClass("hljs-string") || $(this).hasClass("hljs-number")) ||$(this).hasClass("hljs-attribute") ) {                                                            
                    if ($(this).text().toLowerCase().indexOf(lowString) > -1) {
                        var text = $(this).text().toLowerCase().replace(reg, '<span id=' + i + ' class="highlight-yellow">' + orgString + '</span>');
                        i = i +1;
                        $(this).html(text);
                    }
                }                
            });
            return i;
        }

     
        //select vm to show
        self.selectVm = function(vm){
            self.selectedVm(vm);
            lbs.log.watch.sh();
        };

        self.selectState = function(state){
            self.selectedState(state);
        };

        self.copyWatch = function(){
            window.clipboardData.setData('Text', $('#vmDataText').text());
        }

        // selected log status
        self.selectedLogStatus = function (view) {            
            self.logView(view);
        };

        //get vm from apps
        var map = $.map(lbs.apps,function(v,i){
            return {name : v.name, vm : v.vm || {}};
        });

        //add AP VM
        self.vms.push({name : 'Actionpad', vm : lbs.vm});
        self.vms = self.vms.concat(map);

        //get logposts        
        self.logItems = ko.toJS(lbs.log.vm.logItems);        
        self.dom = $('#wrapper').get()[0].outerHTML;
    }
};