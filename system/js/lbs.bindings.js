/**
Binding provider override
*/
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
        if (!data) {return;}
        if (!data.hasOwnProperty(val)) {return;}
        if (data[val]) { return; }
        if (data[val] === '' || data[val] === false || data[val] === 0) { return; }

        throw new ReferenceError('Unable to set binding \'{0}\'.\nBindings value: {1}\nMessage: Property is undefined'.format(val, $(node).attr('data-bind')));
    },

    //replace dependent bindings with another that can handle the isses
    processDependentBindings: function (bindings) {

        //no bindings, nothing to do
        if (!bindings) { return; }

        //text and icon in same binding
        if (bindings.hasOwnProperty('text') && bindings.hasOwnProperty('icon')) {
            //dont run if text is empty
            if (bindings['text'] !== '') {
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
        var match;

        //set text
        match = new RegExp('text\:[^\,\}]*').exec($(node).attr('data-bind'));
        if (match) {
            bindings['text'] = 'Binding: ' + match[0].split(':')[1].trim();
        }
           
        //set value
        match = new RegExp('value\:[^\,\}]*').exec($(node).attr('data-bind'));
        if (match) { 
            bindings['value'] = 'Binding: ' + match[0].split(':')[1].trim();
        }

        //icons
        match = new RegExp('icon\:[^\,\}]*').exec($(node).attr('data-bind'));
        if (match) { 
            bindings['icon'] = match[0].split(':')[1].trim().replace(/\'/g, '');
        }

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

        $(element).html(iconHtml + '<span></span>');
        ko.bindingHandlers.text.update($(element).find('span').get(0), function () { return value['text']; }, allBindingsAccessor, viewModel, bindingContext);
    }
};

/**
LimeLink    
*/
ko.bindingHandlers.limeLink = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var newValueAccessor = function() {
            return function() {
                 lbs.common.executeVba('shell,' + lbs.common.createLimeLink(ko.unwrap(valueAccessor().class), ko.unwrap(valueAccessor().value)));
            };
         };
        ko.bindingHandlers.click.init(element, newValueAccessor, allBindingsAccessor, viewModel, bindingContext);
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
        ko.bindingHandlers.click.init(element, newValueAccessor, allBindingsAccessor, viewModel, bindingContext);
    },
};

/**
Show on google map  
*/
ko.bindingHandlers.showOnMap = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var newValueAccessor = function() {
            return function() {
                lbs.common.executeVba('shell,https://www.google.com/maps?q=' + encodeURIComponent(ko.unwrap(valueAccessor()).replace(/\r?\n|\r/g, ' ')));
            };
         };
        ko.bindingHandlers.click.init(element, newValueAccessor, allBindingsAccessor, viewModel, bindingContext);
    },
};

/**
Call phone (simply drop to shell)
*/
ko.bindingHandlers.call = {
     init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var newValueAccessor = function() {
            return function() {
               lbs.common.executeVba('shell,tel:' + ko.unwrap(valueAccessor()));
            };
         };
        ko.bindingHandlers.click.init(element, newValueAccessor, allBindingsAccessor, viewModel, bindingContext);
    },
};

/**
Open URL (simply drop to shell)
*/
ko.bindingHandlers.openURL = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var newValueAccessor = function() {
            return function() {
                lbs.common.executeVba('shell,' + ko.unwrap(valueAccessor()));
            };
         };
        ko.bindingHandlers.click.init(element, newValueAccessor, allBindingsAccessor, viewModel, bindingContext);
    },
};

/**
Invoke old-style app
*/
ko.bindingHandlers.appInvoke = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        
        var newValueAccessor = function() {
            if(lbs.hasLimeConnection === true){
                return function() {
                    Invoker.invokeWebApplication(ko.unwrap(valueAccessor()));
                };
            }else{
                return function(){
                    alert('AppInvoker is not avalible outside of lime');
                };
            }
        };
        ko.bindingHandlers.click.init(element, newValueAccessor, allBindingsAccessor, viewModel, bindingContext);
    },
};

/**
Call VBA function to check if item should be visible 
THIS IS DEPRECATED AND WILL BE REMOVED IN A FUTURE VERSION.
*/
ko.bindingHandlers.vbaVisible = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var visible = lbs.common.executeVba(ko.unwrap(valueAccessor()));

        if (visible) {
            $(element).show();
            $(element).removeClass('hidden');
            $(element).removeClass('remainHidden');
        } else {
            $(element).hide();
            $(element).addClass('hidden');
            $(element).addClass('remainHidden');
        }
    }
};

// Override knockout visible binding to allow for cookies
ko.bindingHandlers.visible = {
    'update': function (element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());

        var isCurrentlyVisible = !(element.style.display == "none");
        if (value && !isCurrentlyVisible){
            element.style.display = "";
            $(element).removeClass("remainHidden");
        }
        else if ((!value) && isCurrentlyVisible){
            element.style.display = "none";
            $(element).addClass("remainHidden");
        }
    }
};

ko.bindingHandlers.email = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var newValueAccessor = function() {
            return function() {
                lbs.common.executeVba('shell,mailto:' + ko.unwrap(valueAccessor()));
            };
        };
        ko.bindingHandlers.click.init(element, newValueAccessor, allBindingsAccessor, viewModel, bindingContext);
    },
};

/**
Prepend icon
*/
ko.bindingHandlers.icon = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var content = lbs.common.iconTemplate.format(ko.unwrap(valueAccessor()));
        if (
            $(element).text() !== '' && $(element).text().substring(0, content.length) != content) {
            $(element).prepend(content);
            element = $(element).get(0);
        }
    }
};

/**
Safe text binding, failes to empty string
*/
ko.bindingHandlers.safeText = {
  update: function(element, valueAccessor, allBindingsAccessor) {
    var options = ko.utils.unwrapObservable(valueAccessor()),
    value = ko.utils.unwrapObservable(options.value),
    property = ko.utils.unwrapObservable(options.property),
    fallback = ko.utils.unwrapObservable(options.default) || '',
    text;

    text = value ? (options.property ? value[property] : value) : fallback;

    ko.bindingHandlers.text.update(element, function() { return text; });
    }
};

ko.bindingHandlers.href = {
    update: function (element, valueAccessor) {
        ko.bindingHandlers.attr.update(element, function () {
            return { href: valueAccessor()};
        });
    }
};

ko.bindingHandlers.src = {
    update: function (element, valueAccessor) {
        ko.bindingHandlers.attr.update(element, function () {
            return { src: valueAccessor()};
        });
    }
};

ko.bindingHandlers.instantValue = {
    init: function (element, valueAccessor, allBindings) {
        var newAllBindings = function(){
            // for backwards compatibility w/ knockout  < 3.0
            return ko.utils.extend(allBindings(), { valueUpdate: 'afterkeydown' });
        };
        newAllBindings.get = function(a){
            return a === 'valueupdate' ? 'afterkeydown' : allBindings.get(a);
        };
        newAllBindings.has = function(a){
            return a === 'valueupdate' || allBindings.has(a);
        };
        ko.bindingHandlers.value.init(element, valueAccessor, newAllBindings);
    },
    update: ko.bindingHandlers.value.update
};

ko.bindingHandlers.toggle = {
    init: function (element, valueAccessor) {
        var value = valueAccessor();
        ko.applyBindingsToNode(element, {
            click: function () {
                value(!value());
            }
        });
    }
};

ko.bindingHandlers.stopBinding = {
    init: function () {
        return { controlsDescendantBindings: true };
    }
};
ko.virtualElements.allowedBindings.stopBinding = true;

ko.bindingHandlers.popover = {
    init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        var dom;          
        var color;
        var title;
        var icon;
        var placement;
        var trigger;
        if (typeof(valueAccessor()) =="object"){  

            if(typeof(valueAccessor().color) == "undefined"){
                color = "blue";
            }else{
                color = valueAccessor().color;
            }

            if(typeof(valueAccessor().title) == "undefined"){
                title = "Titel saknas";
            }else{
                title = valueAccessor().title;
            }

            if(typeof(valueAccessor().placement) == "undefined"){
                placement = "top";
            }else{
                placement = valueAccessor().placement;
                if("left,right,top,bottom".indexOf(valueAccessor().placement) == -1){
                    placement = "top";
                }
            }

            if(typeof(valueAccessor().trigger) == "undefined"){
                trigger = "hover";
            }else{
                trigger = valueAccessor().trigger;
                if("hover,click".indexOf(valueAccessor().trigger) == -1){
                    trigger = "hover";
                }
            }

            if(typeof(valueAccessor().icon) == "undefined"){

                icon = "";
            }else{
                icon = '<i class="fa ' + valueAccessor().icon + '"></i>';
            }
            
            switch(valueAccessor().type){                     
                case 'error':
                    color = 'red';
                    icon = '<i class="fa fa-times"></i> ';
                    title = 'Error';
                    break;
                case 'info':
                    color = "blue";
                    icon = '<i class="fa fa-info-circle"></i> ';
                    title = 'Information';
                    break;
                case 'warning':
                    color = "orange";
                    icon = '<i class="fa fa-warning"></i> ';
                    title = 'Warning';
                    break;
                case 'success':
                    color = "green";
                    icon = '<i class="fa fa-check"></i> ';
                    title = 'Success';
                    break;
                case 'custom':
                    break;
                default:
                    title = '';
                    dom = valueAccessor().text;                                    
            }
            title = '<span>' + title + '</span>';
            dom = '<div><div class="message-header ' + color +'">' + icon + title + '</div>'+valueAccessor().text+'</div>';
        }
        else{            
           dom = valueAccessor();
           placement = "top";
           trigger = "hover";
        }        
        
        $(element).attr({'data-toggle':'popover','data-container':'body','data-content':dom,'data-placement':placement});   
        $(element).popover({ trigger: trigger, html:'true' });

    },
    update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
         var dom;          
        var color;
        var title;
        var icon;
        var placement;
        var trigger;
        if (typeof(valueAccessor()) =="object"){  

            if(typeof(valueAccessor().color) == "undefined"){
                color = "blue";
            }else{
                color = valueAccessor().color;
            }

            if(typeof(valueAccessor().title) == "undefined"){
                title = "Titel saknas";
            }else{
                title = valueAccessor().title;
            }

            if(typeof(valueAccessor().placement) == "undefined"){
                placement = "top";
            }else{
                placement = valueAccessor().placement;
                if("left,right,top,bottom".indexOf(valueAccessor().placement) == -1){
                    placement = "top";
                }
            }

            if(typeof(valueAccessor().trigger) == "undefined"){
                trigger = "hover";
            }else{
                trigger = valueAccessor().trigger;
                if("hover,click".indexOf(valueAccessor().trigger) == -1){
                    trigger = "hover";
                }
            }

            if(typeof(valueAccessor().icon) == "undefined"){

                icon = "";
            }else{
                icon = '<i class="fa ' + valueAccessor().icon + '"></i>';
            }
            
            switch(valueAccessor().type){                     
                case 'error':
                    color = 'red';
                    icon = '<i class="fa fa-times"></i> ';
                    title = 'Error';
                    break;
                case 'info':
                    color = "blue";
                    icon = '<i class="fa fa-info-circle"></i> ';
                    title = 'Information';
                    break;
                case 'warning':
                    color = "orange";
                    icon = '<i class="fa fa-warning"></i> ';
                    title = 'Warning';
                    break;
                case 'success':
                    color = "green";
                    icon = '<i class="fa fa-check"></i> ';
                    title = 'Success';
                    break;
                case 'custom':
                    break;
                default:
                    title = '';
                    dom = valueAccessor().text;                                    
            }
            
            dom = '<div><div class="message-header ' + color +'">' + icon + title + '</div>'+valueAccessor().text+'</div>';
        }
        else{            
           dom = valueAccessor();
           placement = "top";
           trigger = "hover";
        }        
        
        $(element).attr({'data-toggle':'popover','data-container':'body','data-content':dom,'data-placement':placement});   
    }
};

 ko.bindingHandlers.tooltip = {   
    init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        if (typeof valueAccessor() ==='object'){
            $(element).attr({'data-toggle':'tooltip','white-space':'nowrap','data-original-title':valueAccessor().text,'data-placement':valueAccessor().placement});        
            $(element).tooltip();    
        }
        else
        {
            //,'white-space':'nowrap'
            $(element).attr({'data-toggle':'tooltip','white-space':'pre-wrap','data-original-title':valueAccessor(),'data-placement':'top'});        
            $(element).tooltip();    
        }        
    },
    update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {    
        if (typeof valueAccessor() ==='object'){
            $(element).attr({'data-toggle':'tooltip','white-space':'pre-wrap','data-original-title':valueAccessor().text,'data-placement':valueAccessor().placement});        
        }
        else
        {
            $(element).attr({'data-toggle':'tooltip','white-space':'pre-wrap','data-original-title':valueAccessor(),'data-placement':'top'});                    
        }
    }
};

ko.filters.number = function(value,nbrOfDecimals) {
    if (nbrOfDecimals === undefined) nbrOfDecimals = 2;
    value = Number(Math.round(value+'e'+nbrOfDecimals)+'e-'+nbrOfDecimals);
    return value.toLocaleString();
};

ko.filters.currency = function(value, currency, divider) {
    var retval;
    var currencyfirst = ["$", "£", "¥", "₱", "₭", "₦", "₩", "₮", "฿", "₹", "₡", "৳"];
    if (typeof value !== "string") value = value.toString();
    if (currency === undefined) currency = 'kr';
    if (divider === undefined) divider = ' ';

    if (currencyfirst.indexOf(currency) > -1) {
        retval = currency + ' ' + value.replace(/\B(?=(\d{3})+(?!\d))/g, divider);
    }
    else {
        retval = value.replace(/\B(?=(\d{3})+(?!\d))/g, divider) + ' ' + currency;
    }
    return retval;
};

ko.filters.percent = function(value, arg1) {
    return (value * 100) + '%';
};


ko.filters.fromNow = function(date, arg1) {
    date = date.slice(0,19);
    //console.log(date)
    return moment(date).fromNow(true);
};

ko.bindingHandlers.rotate = {
    update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        // This will be called once when the binding is first applied to an element,
        // and again whenever the associated observable changes value.
        // Update the DOM element based on the supplied values here.
        
        var deg = valueAccessor();
        console.log(deg);
        $(element).css({
            '-webkit-transform':'rotate(' + deg + 'deg)',
            '-moz-transform-transform':'rotate(' + deg + 'deg)',
            '-ms-transform-transform':'rotate(' + deg + 'deg)',
            '-o-transform:':'rotate(' + deg + 'deg)',
            'transform:':'rotate(' + deg + 'deg)'
        });
    }
};

