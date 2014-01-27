Ext.define('EvolveQueryEditor.model.OutputFieldModel', {
    extend: 'Ext.data.Model',

    requires: [
      'Ext.data.Field',
	  'EvolveQueryEditor.util.QAALogger',
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
			defaultValue: 1, //Ascending
			convert: function (value, record) {
				if(!Ext.isEmpty(value) && Ext.isNumber(value)) {
					return EvolveQueryEditor.model.SortingTypeModel.parseFromInt(value);
				}
				return value;
			}
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
		this.set('sortingType', EvolveQueryEditor.model.SortingTypeModel.Ascending);	//this is similar logic as Evolve excel addin 
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
},function(Cls){
	
	var outputFieldRegexString = "(?:C=(.+),)?E=([-\\d]+),(?:X=<sFm2>{_sf_}([\\+\\-\\/\\*]\\d+(?:\\.\\d+)?)</sFm2>,)?(S=(\\(?\\d+\\)?),)?O=([^,]+)";
	var outputFieldMatchPt = new RegExp(outputFieldRegexString,"g");
	var outputFieldGroupPt = new RegExp(outputFieldRegexString,"");
	var extractionRegularP = /(?:(-)?)(\d+)/;
	var parseExtractTypeAndReverseSignFromString = function(extractValueWithReverseSign){
		var offset = 1;
		var length = 1;
		var extractType = null;
		var reverseSign = false;
		
 		if( extractionRegularP.test(extractValueWithReverseSign)){
			var groups = extractValueWithReverseSign.match(extractionRegularP);
			var extractValue = groups[2];
			if(extractValue.length === EvolveQueryEditor.model.ExtractionTypeModel.Segment.get("intValue").toString().length)
			{
				 //IS_SEGMENT has the unique length and the second to third is for offset, fourth to fifth is for length.
				offset = parseInt(extractValue.substr(1, 2));
				length = parseInt(extractValue.substr(3, 2));
				extractType =EvolveQueryEditor.model.ExtractionTypeModel.Segment;
			}
			else
			{
				extractType = EvolveQueryEditor.model.ExtractionTypeModel.parseFromValue(extractValue);
			}
			
			reverseSign = groups[1] === undefined? false:true;
			
 		}
 		else
		{
			var errorMsg = Ext.String.format("the output field formula {0} is not valid",extractValueWithReverseSign);
			EvolveQueryEditor.util.QAALogger.error(errorMsg); 
			throw errorMsg;
		}
		
		return {
			"offset":offset,
			"length":length,
			"extractType":extractType,
			"reverseSign":reverseSign
		};
	};
	
	var parseSingleFromString = function(outputFieldString){	                         
		var groups = outputFieldString.match(outputFieldGroupPt);
		var result = null;
		if(groups.length !== 7){
			var errorMsg = Ext.String.format("the output field formula {0} is not valid",outputFieldString);
			EvolveQueryEditor.util.QAALogger.error(errorMsg); 
			return undefined;
		}   
		
		var codePath = groups[6];
		var extractValueWithReverseSign = groups[2];
		result = parseExtractTypeAndReverseSignFromString(extractValueWithReverseSign);		
		
		//ignore target cell
		
		//group 3 is for scalling factor
		var scalingFactor = Ext.isEmpty(groups[3])? "" : groups[3];

		var paresedOutputField = Ext.create('EvolveQueryEditor.model.OutputFieldModel', {
			codePath: codePath,
			segmentOffset: result["offset"],
			segmentLength: result["length"],
			scalingFactor: scalingFactor,
			reverseSign: result["reverseSign"],
			extractType: result["extractType"]
		});
		
		//group 5 is for sortIndexWithSorMode
		var parsedSortingInfo = EvolveQueryEditor.model.SortingTypeModel.parseFromString(groups[5]);
		if(parsedSortingInfo.sortingType === EvolveQueryEditor.model.SortingTypeModel.None){
			paresedOutputField.clearSorting();
		}
		else
		{
			paresedOutputField.setSorting(parsedSortingInfo.sortingType, parsedSortingInfo.sortIndex);
		}
			
		//get extra information from services
		
		Ext.Ajax.request({
			url: EvolveQueryEditor.model.Query.serverUrlBase + '&method=BringOutFieldDetails',
			jsonData: {
				clientToken: EvolveQueryEditor.model.Query.clientToken,
				codePath:codePath,
				async: false, 
				query: {
					productCode: EvolveQueryEditor.model.Query.getProductCode(),
					tableCode: EvolveQueryEditor.model.Query.tableCode,
					mode: EvolveQueryEditor.model.Query.getQueryType(),
					filters: EvolveQueryEditor.model.Query.getFilters()
				}
			},
			success: function (response) {
				var fieldItem = Ext.decode(response.responseText);		
				var fieldVarType = fieldItem["dataType"];
				var dataType = EvolveQueryEditor.model.FieldDataTypeModel.find(fieldVarType);
				var fieldName = fieldItem["name"];
				var lookupCategory = fieldItem["lookupCategory"];
				paresedOutputField.set('dataType', dataType);
				paresedOutputField.set('fieldVarType', fieldVarType);
				paresedOutputField.set('fieldName', fieldName);
				paresedOutputField.set('lookupCategory', lookupCategory);
			},
			failure: function (response, options) {
				alert(response.statusText);
			}
		});
	
		
		return paresedOutputField;
	};
	
	Cls.parseAllFromString = function(reportFormula) {
		var allFields = [];
		var outputFiledMatches = reportFormula.match(outputFieldMatchPt);
					
		for(var i=0; i<outputFiledMatches.length; i++){						
			var outputFiledModel = parseSingleFromString(outputFiledMatches[i]);
			if(!Ext.isEmpty(outputFiledModel)) {
				allFields.push(outputFiledModel);
			}
		}   
		
		return allFields;
	}
	
});