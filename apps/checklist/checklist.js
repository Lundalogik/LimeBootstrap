

checklist =  {
        "data": {},
        "element":{},
        "main": function (data, element) {
		//console.log(this.data.checklist.businesstypeactivity[1].order)
            // Load the XML


			var a = "{{#each businesstypeactivity}} \
			 <div class='task' id={{order}}> \
				<input type='checkbox' value='None' id='inp_{{order}}' name='check' /> \
				<label for=inp_'{{order}}'></label> {{name}} \
			<div> \
			{{/each}}"
			
			var template = Handlebars.compile(a);
			
			var b = template(this.data.checklist);
			this.element.append(b)
			//alert(b)
            //Create the Checklist DOM
/*
            $.each(this.data.checklist.businesstypeactivity,function () {
                var id = $(this).order;
                checklist.element.append("<div class='task' id=" + id + "><div>");
                checklist.element.find("#" + id).append("<input type='checkbox' value='None' id='inp_" + id + "' name='check' />");
                checklist.element.find("#" + id).append("<label for=inp_'" + id + "'></label> " + $(this).attr("name"));
                if ($(this).checked == 1) {
                    checklist.element.find("#" + id).find("input").attr('checked', true);
                }
            });
*/
            
            
            
            	console.log(this.element.html)
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
        "initalize": function (data, element) {
        
				this.data = data;
				this.element = element;
				this.main();
				
				
        }
    
}