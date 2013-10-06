lbs.apploader.register('checklist', function () {

    //config
    this.config = {
        dataSources: [

        ],
        resources: {
            scripts: [],
            styles: ['checklist.css'],
            libs: ['json2xml.js']
        }
    },

    //initialize
    this.initialize = function (node,appData) {

        /**
        Checklistmodel
        */
        var ChecklistModel = function(checklist){
            var self = this;
            
            //tasks
            self.tasks = ko.observableArray();

            //populate tasks
            for (var i = 0; i < checklist.length; i++) {
                if(!checklist[i].isChecked){
                    checklist[i].isChecked = ko.observable(false);
                }
                else{
                    checklist[i].isChecked = true;
                }
                self.tasks.push(checklist[i]);
            };

            //name
            self.name = "Kalle"

            //click event
            self.taskClicked = function(task){
                try{
                    alert(self.name);
                    task.isChecked = lbs.common.executeVba("Checklist.PerfromAction," + task.idchecklist);
                    
                    task.isChecked = true;

                }catch(e){
                    task.isChecked = false;  
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
                    "mouseover": "Kontakta diariet och beställ diarienummer med rubrik Avtal om tillträde järnvägsföretag"
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

