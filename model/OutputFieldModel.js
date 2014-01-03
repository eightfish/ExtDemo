Ext.define('EvolveQueryEditor.model.OutputFieldModel', {
    extend: 'Ext.data.Model',

    requires: [
      'Ext.data.Field',
	  'EvolveQueryEditor.model.SortingTypeModel'
    ],
    
    fields: [
        {
            name: 'codePath',
            type: 'string'
        },
        {
            name: 'reverseSign',
            type: 'boolean'
        },
        {
            name: 'scalingFactor',
            type: 'auto'
        },
        {
            name: 'segmentOffset',
            type: 'int'
        },
        {
            name: 'segmentLength',
            type: 'int'
        },
        {
            name: 'extractType',
            type: 'auto',
            
        },
		{
			name:'extractTypeDesc',
			type:'string',
			convert: function (value, record) {
                return (record.get('extractType') !== undefined) ? record.get('extractType').get('description') : "0"; //default value 0 means extract type is none
            }
		},
        {
            name: 'dataType',
            type: 'auto'
        },
        {
            name: 'lookupCategory',
            type: 'string'
        },
        {
            name: 'fieldName',
            type: 'string'
        },
		{
            name: 'sortingType',
            type: 'auto',
			defaultValue: EvolveQueryEditor.model.SortingTypeModel.Ascending
        },
        {
            name: 'sortIndex',
            type: 'int',
			defaultValue: 0
        },
		{
			name:'sortOptionDescription',
			type:'string',
			defaultValue: ''
		}
    ],
	
	refreshSortDescription: function() {
		var sortDesc = '';
		
		if(this.get('sortIndex') !== 0){
			sortDesc = this.get('sortingType').get('sortingType') + ' ' + this.get('sortIndex');
		}
		
		this.set('sortOptionDescription', sortDesc);
	},
	
	clearSorting: function() {
		this.set('sortIndex', 0);
		this.set('sortingType', EvolveQueryEditor.model.SortingTypeModel.Ascending);	
		this.refreshSortDescription();
	},
	
	setSorting: function(sortingType, sortIndex) {
		this.set('sortIndex', sortIndex);
		this.set('sortingType', sortingType);
		this.refreshSortDescription();
	},
	
	getActualSortingType: function() {
		if(this.get('sortIndex') === 0 || this.get('sortingType') === undefined) {
			return EvolveQueryEditor.model.SortingTypeModel.None;
		}
		
		return this.get('sortingType');
	}
});