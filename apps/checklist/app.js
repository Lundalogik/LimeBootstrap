lbs.apploader.register('checklist', function () {
    var self = this;
    //config
    self.config = {
        dataSources: [

        ],
        resources: {
            scripts: [],
            styles: ['checklist.css'],
            libs: ['json2xml.js']
        },
        name: 'Checklista',
        canBeUnchecked: false,
        canAddTask: false
    },

    //initialize
    self.initialize = function (node,appData) {
        
        /**
        Checklistmodel
        */
        var ChecklistModel = function(checklist){
            var me = this;

            me.tasks = ko.observableArray();
            //populate tasks
            for (var i = 0; i < checklist.length; i++) {
                //Is the task checked?
                checklist[i].isChecked = ko.observable(checklist[i].isChecked);
                //When and who checked?
                if (checklist[i].checkedDate) {
                    checklist[i].checkedDate = ko.observable(checklist[i].checkedDate);
                    checklist[i].checkedBy = ko.observable(checklist[i].checkedBy);
                }else{
                    checklist[i].checkedDate = ko.observable("");
                    checklist[i].checkedBy = ko.observable("");
                }; 
                me.tasks.push(checklist[i])
            };

            //name
            me.name = self.config.name;
            me.canAddTask = self.config.canAddTask;
            //Nbr of checkedItems
            me.nbrOfChecked =   ko.computed(function(){
                return ko.utils.arrayFilter(me.tasks(), function(task) {
                        return task.isChecked() == true;
                 }).length;
             });

            //click event
            me.taskClicked = function(task){
                try{
                    if(!task.isChecked() && task.idchecklist){
                        task.isChecked (lbs.common.executeVba("Checklist.PerfromAction," + task.idchecklist));
                        task.checkedDate(moment());
                        task.checkedBy(lbs.limeDataConnection.ActiveUser.Name);
                        me.save();

                    }else{
                        if(self.config.canBeUnchecked){
                            task.isChecked(false);
                        }
                    }
                }catch(e){
                    task.isChecked(false);  
                }
            }

            me.addTask = function(){
                me.tasks.push({              
                    "idchecklist": "1001",
                    "order": "1",
                    "title": "Beställ diarienummer",
                    "mouseover": "Kontakta diariet och beställ diarienummer med rubrik Avtal om tillträde järnvägsföretag",
                    "isChecked":true
                });    
            }

            me.save = function(){
                        var tempJSON = JSON.stringify({checklist:ko.toJS(me.tasks)});
                        var tempXML = json2xml($.parseJSON(tempJSON),'');
                        lbs.common.executeVba("Checklist.Save," + tempXML) ;

            }
        }


        /**
        Dummy data
        */
        var dummyData =  {"checklist": [
                  {
                    "idchecklist": "1001",
                    "order": "1",
                    "title": "Beställ diarienummer",
                    "mouseover": "Kontakta diariet och beställ diarienummer med rubrik Avtal om tillträde järnvägsföretag",
                    "isChecked":true
                  },
                  {
                    "idchecklist": "1101",
                    "order": "2",
                    "title": "Justera avtal",
                    "mouseover": "Skriv i företagets kontaktuppgifter samt datum och dnr"
                  },
                  {
                    "idchecklist": "1201",
                    "order": "3",
                    "title": "Skicka avtal och Excelfil",
                    "mouseover": "Skicka avtal samt Excelfil för kontaktuppgifter till företagets kontaktperson"
                  }
                ]      
            }

        /**
        Return view model
        */
        return new ChecklistModel(dummyData.checklist);
    }
});

