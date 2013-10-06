lbs.apploader.register('checklist', function () {
    var self = this;
    //config
    this.config = {
        dataSources: [

        ],
        resources: {
            scripts: [],
            styles: ['checklist.css'],
            libs: ['json2xml.js']
        },
        name: 'Checklista'
    },

    //initialize
    this.initialize = function (node,appData) {

        /**
        Checklistmodel
        */
        var ChecklistModel = function(checklist){
            
            
            //tasks
            this.tasks = ko.observableArray();

            //populate tasks
            for (var i = 0; i < checklist.length; i++) {
                if(!checklist[i].isChecked){
                    checklist[i].isChecked = ko.observable(false);
                }
                else{
                    checklist[i].isChecked = ko.observable(true);
                }
                this.tasks.push(checklist[i]);
            };

            //name
            this.name = self.config.name;

            //click event
            this.taskClicked = function(task){
                try{
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

