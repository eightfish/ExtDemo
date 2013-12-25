Ext.define('EvolveQueryEditor.model.OutputFieldSortingModel', {
    extend: 'Ext.data.Model',

    fields: [
        {
            name: 'codePath',
            type: 'string'
        }, {
            name: 'extractType',
            type: 'auto'
        }, {
            name: 'fieldName',
            type: 'string'
        }, {
            name: 'sortingType',
            type: 'auto'
        }
    ], 
    
    statics: { 
		convertFromOuputFieldModel: function(outputFieldModel) {
			   return Ext.create('EvolveQueryEditor.model.OutputFieldSortingModel', {
				codePath : outputFieldModel.get('codePath'),
				extractType :  outputFieldModel.get('extractType'),
				fieldName : outputFieldModel.get('fieldName'),
				sortingType : outputFieldModel.get('sortingType')
			});
			}
    }
});