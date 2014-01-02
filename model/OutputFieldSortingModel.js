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
            type: 'auto',
			convert: function(value, record){
				if(Ext.getClass(value) === EvolveQueryEditor.model.SortingTypeModel) {
					return value;
				} 
				
				//sorting type int value is returned by the combobox
				var sortingTypeObject = EvolveQueryEditor.store.SortingTypeStore.Instance.findRecord('sortingTypeId', value);
				if(sortingTypeObject !== undefined) {
					return sortingTypeObject;
				}
				
				return EvolveQueryEditor.model.SortingTypeModel.None;
			}
			
        }
    ]
	
}, function(Cls) {
	Cls.convertFromOuputFieldModel = function(outputFieldModel) {
		 return Ext.create('EvolveQueryEditor.model.OutputFieldSortingModel', {
			codePath : outputFieldModel.get('codePath'),
			extractType :  outputFieldModel.get('extractType'),
			fieldName : outputFieldModel.get('fieldName'),
			sortingType : outputFieldModel.getActualSortingType()
		});
	};
});