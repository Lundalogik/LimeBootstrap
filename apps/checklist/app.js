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
        canBeUnchecked: true
    },

    //initialize
    self.initialize = function (node,appData) {
        
        /**
        Checklistmodel
        */
        var ChecklistModel = function(checklist){
            var me = this;
            //populate tasks
            for (var i = 0; i < checklist.length; i++) {
                checklist[i].isChecked = ko.observable(checklist[i].isChecked);
            };

            //tasks
            this.tasks = ko.observableArray(checklist);
            //name
            this.name = self.config.name;
            //Nbr of checkedItems
            this.checked =   ko.computed(function(){
                return ko.utils.arrayFilter(me.tasks(), function(task) {
                        return task.isChecked() == true;
                 }).length;
             });

            //click event
            this.taskClicked = function(task){
                try{
                    if(!task.isChecked()){
                        task.isChecked (lbs.common.executeVba("Checklist.PerfromAction," + task.idchecklist));
                        task.isChecked(true);
                    }else{
                        if(self.config.canBeUnchecked){
                            task.isChecked(false);
                        }
                    }
                }catch(e){
                    task.isChecked(false);  
                }
               
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

