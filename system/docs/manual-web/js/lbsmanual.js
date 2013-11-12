var lbsmanual = {
	init : function(){
		data = lbsmanual.fixData(manualcontent)
		var vm = new viewModel(data);

		

		chapter = vm.getSelectedPage();
		console.log(chapter)
		vm.selectChapter(chapter);
		ko.applyBindings(vm);
		vm.scrollspy.init();
		vm.scrollspy.refresh();
	},

	setSystemParams : function(){

	},

	fixData : function(data){
		$.each(data,function(i){
			data[i].selected = false;
			data[i].uri = ko.computed(function(){
				return '?p='+data[i].name;
			})
		})
		return data;
	}
};

var linkObject = function(anchor,text,level){
	var self = this;
	this.anchor = anchor;
	this.text = text;
	this.level = ko.observable(level);
	this.indent = ko.computed(function(){
		return ((self.level()-1) * 15)+'px';
	})
}



/**
ViewModel
*/
var viewModel = function(rawData){
	var self = this;
	this.data = ko.mapping.fromJS(rawData);

	this.chapter = ko.observable();
	this.sidebar = ko.observableArray();

	/**
	Refresh scrollspy
	*/


	/**
	Create scrollspy holder
	*/
	this.scrollspy = {};

	/**
	Refresh scrollspy
	*/
	this.scrollspy.refresh = function(){
		$("body").scrollspy('refresh');
	}

	/**
	Create scrollspy
	*/
	this.scrollspy.init = function(){
		$("body").scrollspy({
	      target: '#lbs-sidebar',
	      offset: 0
	    })
	}

	/**
    Fetch the url parameters from the GET-URL
    */
    this.getURLParameter = function(name) {
        return decodeURI(
            (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search) || [, null])[1]
        );
    }

    /**
    Generate menu
    */
    this.generateSidebar = function() {
        $("h2, h3, h4, h5").each(function () {
			var l = $(this).find("a.anchor");
			var hIndex = parseInt(this.nodeName.substring(1)) - 1;
        	$(this).attr("id",l.attr("name"))
            link = new linkObject(
            	l.attr("href"),
            	$(this).text().replace(/(\r\n|\n|\r)/gm,""),
            	hIndex
            	);
            self.sidebar.push(link);
         });
    }

    /**
    getSelectedPage
    */
    this.getSelectedPage = function() {
       p = self.getURLParameter("p");
       filtered = ko.utils.arrayFilter(self.data(), function(item) {
            return p == item.name();
        });
       	return filtered.length > 0 ? filtered[0] : self.data()[0];
    }
    

    /**
    Select Chapter
    */
    this.selectChapter = function(item){
    	item.selected(true);
    	$("#content").html(item.html())
    	self.chapter(item);
    	self.generateSidebar();
    	self.scrollspy.refresh();
    }
}


/**
Lets get this party on the road
*/
$(function(){
	lbsmanual.init();
});





