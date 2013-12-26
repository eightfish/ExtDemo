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
            type: 'string'
        }
    ]
	
}, function(Cls) {
	Cls.convertFromOuputFieldModel = function(outputFieldModel) {
		 return Ext.create('EvolveQueryEditor.model.OutputFieldSortingModel', {
			codePath : outputFieldModel.get('codePath'),
			extractType :  outputFieldModel.get('extractType'),
			fieldName : outputFieldModel.get('fieldName'),
			//replace binding object 'sortingType' on combobox with string 
			//since if binding object, we must use 'renderer' to display,
			//but a exception will be thrown when change an selection on cellEditing 
			sortingType : getSortingType(outputFieldModel)
		});
	};
	
	var getSortingType = function(outputFieldModel)	{
		if(outputFieldModel.get('sortIndex') == 0) {
			return EvolveQueryEditor.model.SortingTypeModel.None.get('sortingType');
		}
		
		return outputFieldModel.get('sortingType').get('sortingType');
	};
});