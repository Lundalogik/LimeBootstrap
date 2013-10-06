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
    this.initialize = function (appData,node) {

        var ChecklistModel = function(checklist){
            var self = this;
            
           


            

            self.tasks = ko.observableArray();

            for (var i = 0; i < checklist.length; i++) {
                if(!checklist[i].isChecked){
                    checklist[i].isChecked = ko.observable(false);
                }
                else{
                    checklist[i].isChecked = ko.observable(true);
                }
                self.tasks.push(checklist[i]);
            };
            self.name = "Kalle"


            self.taskClicked = function(task){
                try{
                    alert(self.name);
                    task.isChecked = lbs.common.executeVba("Checklist.PerfromAction," + task.idchecklist);
                    self.name = "nisse"
                    task.isChecked = true;

                }catch(e){
                    task.isChecked = false;  
                }
               
            }

        }
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
        return ChecklistModel(dummyData.checklist);
    }
});

