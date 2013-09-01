
function hepp(hej){
	alert(hej);
	return true;
}


    var dummyXML = '<checklist><businesstypeactivity order="10" name="Lead" required="0" multiplecheck="0" validatemandatoryfields="0" activitytype="173101" autocreatehistory="1" historytext="Lead avprickat" vbacode="ActionPad_Business.FormUploadFile, Lead" visibilitycondition=""/> <businesstypeactivity order="20" name="BesÃ¶k" required="0" multiplecheck="0" validatemandatoryfields="0" activitytype="159601" autocreatehistory="0" historytext="Kundbesök genomfört." vbacode="" visibilitycondition="" checked="1" /></checklist>';



var checklist = {
	"data":{},
	"main":function(){

    // Load the XML
    if (window.external) {
        try {
            var xml = lime.run("Checklist.CreateChecklist");
        } catch (err) {
            var xml = dummyXML;
        }
    } else {
        var xml = dummyXML;
    }
    var checklist = $($.parseXML(xml)); // parse the XML and make it to a magic jQuery object

    //Create the Checklist DOM
    checklist.find("businesstypeactivity").each(function () {
        var id = $(this).attr("order");
        $(".checklist").append("<div class='task' id=" + id + "><div>");
        $(".checklist").find("#" + id).append("<input type='checkbox' value='None' id='inp_" + id + "' name='check' />");
        $(".checklist").find("#" + id).append("<label for=inp_'" + id + "'></label> " + $(this).attr("name"));
        if ($(this).attr("checked") == 1) {
            $(".checklist").find("#" + id).find("input").attr('checked', true);
        }
    });

    //Onclick
    $(".checklist").find(".task").click(function () {
        var task = findNodeOnOrder($(this).attr("id"));
        if (task.attr("checked") != 1) {
            //Check if action succeded
            if (performAction(task.attr("id"))) {
                //only checked once
                if (task.attr("canBeUnchecked") != 1) {
                    $(this).find("input").attr("disabled", true);
                }
                $(this).find("input").attr("checked", true);
                task.attr("checked", 1);
            }

        }
    });

    // Export the XML back to Pro!
    a = $('<div>').append(checklist.find("businesstypeactivity").clone()).html();
    console.log(a);
    //Helper functions

    function findNodeOnOrder(order) {
        var retval = null;
        checklist.find("businesstypeactivity").each(function () {
            if ($(this).attr("order") == order) {
                retval = $(this);
            }
        });
        return retval;
    }
    function performAction(id) {
        try {
            return lime.run("Checklist.PerfromAction");
        } catch (err) {
            return true; // should be false in prod
        }
    }
		
	},
	"initalize":function(inputData, element){
		if(inputData == null){
			
		}	
	}
}