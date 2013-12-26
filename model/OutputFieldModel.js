Ext.define('EvolveQueryEditor.model.OutputFieldModel', {
    extend: 'Ext.data.Model',

    requires: [
      'Ext.data.Field'
    ],
    
    fields: [
        {
            name: 'codePath',
            type: 'string'
        },
        {
            name: 'sortIndex',
            type: 'int'
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
            type: 'auto'
        },
		{
			name:'sortOptionDescription',
			type:'string',
			convert: function (value, record) {
				if(record.get('sortingType') !== undefined && record.get('sortIndex') !== undefined){
					return record.get('sortingType').get('sortingType') + ' ' + record.get('sortIndex');
				}
            }
		}
    ]
});