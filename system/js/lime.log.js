limejs = limejs || {};
limejs.log = {

    "vm": null,

    "setup" : function(){
        if (limejs.debug) {
            function logVm() {
                this.logItems = ko.observableArray([]);
                this.maxNbrOfItems = 25;

                this.addEntry = function (lev, item) {
                    ico = 'icon-exclamation';
                    rowclass = 'alert-info';
                    switch (lev) {
                        case 'DEBUG':
                            ico = 'icon-comment-alt';
                            rowclass = 'alert-warning';
                            break;
                        case 'INFO':
                            ico = 'icon-info-sign';
                            rowclass = 'alert-info';
                            break;
                        case 'WARN':
                            ico = 'icon-warning-sign';
                            rowclass = 'alert-danger';
                            break;
                        case 'ERROR':
                            icon = 'icon-remove';
                            rowclass = 'alert-error';
                            item[1].stack = item[1].stack.replace(/\n/g, "<br />");
                            break;
                    }

                    //remove first item if to meny in log
                    if (this.logItems().length >= this.maxNbrOfItems) {
                        this.logItems.shift();
                    }
                    
                    this.logItems.push({ level: lev, text: item, icon: ico, liclass: rowclass });

                };

            };

            limejs.loader.loadView('debug',$("#debug"))
            this.vm = new logVm();
            ko.applyBindings(this.vm, $("#debugConsole").get(0));
        }
    },

    "logToDom": function (type, msg) {
        arguments = $.makeArray(msg);

        if (limejs.debug == true) {
           
            if (limejs.log.vm) {
                limejs.log.vm.addEntry(type.toUpperCase(),arguments);
            }
            
        }
    },

    logToConsole : {
        debug : function(msg){
            try { console.debug(msg[0]) } catch (e) { };
        },
        info: function (msg) {
            try { console.info(msg[0]) } catch (e) { };
        },
        warn: function (msg) {
            try { console.warn(msg[0]) } catch (e) { };
        },
        error: function (msg) {
            limejs.error = true;
            try { console.error(msg[0], msg[1]) } catch (e) { };
        },
    },

    //TODO: implement limitation depending on theshold
    "debug" : function(){
        limejs.log.logToDom('DEBUG', arguments);
        limejs.log.logToConsole.debug(arguments);  
    },
    "info" : function(){
        limejs.log.logToDom('INFO', arguments);
        limejs.log.logToConsole.info(arguments);
    },
    "warn" : function(){
        limejs.log.logToDom('WARN', arguments);
        limejs.log.logToConsole.warn(arguments);
    },
    "error" : function(){
        limejs.log.logToDom('ERROR', arguments);
        limejs.log.logToConsole.error(arguments);
    },
}


