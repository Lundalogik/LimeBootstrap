lbs.externalConfig = {
	/**
	Enable or disable the debug console 
	for the whole application
	**/
	debug: true,

	/**
	Configure special use cases,
	mainly when requiring additional datasources
	**/

	config:{
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
	}
}