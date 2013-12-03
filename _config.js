
/**
Enable or disable the debug console 
for the whole application
**/
lbs.setDebug(false);

/**
Configure special use cases,
mainly when requiring additional datasources
**/

lbs.configure({
	'index' : {
	    dataSources: [
	         { type: 'localization', source: '' },
	    ],
	 	autorefresh : false
	},

	'helpdesk' : {
	    dataSources: [
	    	{type: 'activeInspector', source: ''}, 
	    	{type: 'localization', source: '' },
	        {type: 'record', source: 'ActionPadTools.GetCompanyContactData'}, 
	        {type: 'record', source: 'ActionPadTools.GetPersonContactData'}
	    ],
	 	autorefresh : false
	},

	'todo' : {
	    dataSources: [
	    	{type: 'activeInspector', source: ''}, 
	    	{type: 'localization', source: '' },
	        {type: 'record', source: 'ActionPadTools.GetPersonContactData' },
   			{type: 'record', source:'ActionPadTools.GetCompanyContactData'}
	    ],
	 	autorefresh : false
	},
})