lbs.jotnar = {

	winterEgg : function(){
		
	    var n = moment();
	    var start = "2015-12-19";
	    var stop = "2016-01-05";
	    
	    var diffStart = moment(n).diff(moment(start,"YYYY-MM-DD")); 
	    var diffStop = moment(n).diff(moment(stop,"YYYY-MM-DD"));

	    if(diffStart > 0 && diffStop < 0 ){
	    	snowStorm.freezeOnBlur = false;
	    }
	    else{
	    	snowStorm.freeze();
	    }
		
	}
};