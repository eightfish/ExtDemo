/******************************************************
*                      NOTICE
* 
* THIS SOFTWARE IS THE PROPERTY OF AND CONTAINS
* CONFIDENTIAL INFORMATION OF INFOR AND SHALL NOT
* BE DISCLOSED WITHOUT PRIOR WRITTEN PERMISSION.
* LICENSED CUSTOMERS MAY COPY AND ADAPT THIS
* SOFTWARE FOR THEIR OWN USE IN ACCORDANCE WITH
* THE TERMS OF THEIR SOFTWARE LICENSE AGREEMENT.
* ALL OTHER RIGHTS RESERVED.
* 
* COPYRIGHT (c) 2010 - 2011 INFOR. ALL RIGHTS RESERVED.
* THE WORD AND DESIGN MARKS SET FORTH HEREIN ARE
* TRADEMARKS AND/OR REGISTERED TRADEMARKS OF INFOR
* AND/OR RELATED AFFILIATES AND SUBSIDIARIES. ALL
* RIGHTS RESERVED. ALL OTHER TRADEMARKS LISTED
* HEREIN ARE THE PROPERTY OF THEIR RESPECTIVE
* OWNERS. WWW.INFOR.COM.
* 
* *****************************************************
*/

Ext.define('EvolveQueryEditor.model.FilterOptionsModel', {
    extend: 'Ext.data.Model',
    
    requires: [
        'EvolveQueryEditor.model.ComparisonOperatorModel',
        'EvolveQueryEditor.model.FilterModeModel'
    ],
    
	config: {
        filterModel: null
    },
	
    fields: [
        {
            name: 'from',
            type: 'string',
			defaultValue: ''
        },
        {
            name: 'to',
            type: 'string',
			defaultValue: ''
        },
        {
            name: 'operator',
            type: 'auto',
			defaultValue: 0, //None
			convert: function (value, record) {
				if(!Ext.isEmpty(value) && Ext.isNumber(value)) {
					return EvolveQueryEditor.model.ComparisonOperatorModel.parseFromInt(value);
				}
                return value;
			}
        },
        {
            name: 'mode',
            type: 'auto',
			defaultValue: 0, //Default mode
			convert: function (value, record) {
				if(!Ext.isEmpty(value) && Ext.isNumber(value)) {
					return EvolveQueryEditor.model.FilterModeModel.parseFromInt(value);
				}
                return value;
			}
        },
        {
            name: 'caseInsensitive',
            type: 'boolean',
            defaultValue: false
        },
        {
            name: 'segment',
            type: 'boolean',
            defaultValue: false
        },
        {
            name: 'segmentOffset',
            type: 'int',
            defaultValue: 0
        },
        {
            name: 'segmentLength',
            type: 'int',
            defaultValue: 0
        },
    ],
	
	isRange : function() {
		return !this.filterModel.get('single');
	},
	
	isString: function() {
		return (this.filterModel.get('dataType') === "string");
	},
    
    isAllowSegments: function() {
		return this.filterModel.get('allowSegments');
	},
    
    clearSegment : function() {
        this.set('segment', false);  		
        this.set('segmentOffset', 1);  
        this.set('segmentLength', 1);
    },
    
    resetFromValueAndToValue: function() {
		this.set('from','');
		this.set('to', '');
	},
    
    setSegment : function (segmentOffset, segmentLength) {
        this.set('segment', true);  		
        this.set('segmentOffset', segmentOffset);  
        this.set('segmentLength', segmentLength);
    },
	
	save: function() {
		var valueFrom = this._getFilterValueWithPrefix(this.get('from'));
		this.filterModel.set('from', valueFrom);
		
		if(this.isRange() && this.isFilterToNeeded()) {
			var valueTo = this._getFilterValueWithPrefix(this.get('to'));
			this.filterModel.set('to', valueTo);		
		} else {
			this.filterModel.set('to', '');
		}
	},
	
	isFilterFromNeeded : function() {
		var mode = this.get('mode');
		return mode.isCombinationMode() || mode.isLiteralMode() || this.isValueNeededInDefaultMode();
	},
	
	isFilterToNeeded : function () {
		var mode = this.get('mode');
		var operator = this.get('operator');
		return (mode.isLiteralMode()) || (mode.isDefaultMode() && operator.isNone())
	},
	
	isValueNeededInDefaultMode : function() {
		var mode = this.get('mode');
		if(mode.isDefaultMode() === false) {
			return false;
		}

		var operator = this.get('operator');
		var operatorsOfValueNeededInDefaultMode = EvolveQueryEditor.model.ComparisonOperatorModel.getOperatorsWhichNeedValue();
		return Ext.Array.contains(operatorsOfValueNeededInDefaultMode, operator);
	},
	
	_getFilterValueWithPrefix : function(filterValue) {
		var stringValue = '';
		var mode = this.get('mode');
		var operator = this.get('operator');
		var segment = this.get('segment');
		var caseInsensitive = this.get('caseInsensitive');
		var segmentOffset = this.get('segmentOffset');
		
		if(mode.isLiteralMode()) {
			stringValue += EvolveQueryEditor.model.FilterModeModel.LITERAL.get('symbol');
			stringValue += filterValue;
			
		} else if (mode.isCombinationMode()) {
			stringValue += EvolveQueryEditor.model.FilterModeModel.COMBINATION.get('symbol');
			stringValue += filterValue;
			
		} else if(Ext.Array.contains(EvolveQueryEditor.model.ComparisonOperatorModel.getSpecialOperators(),operator)) {
			stringValue += operator.get('symbol');
			
		} else {
			stringValue += caseInsensitive? EvolveQueryEditor.model.FilterOptionsModel.CASE_INSENSITIVE: '';
			stringValue += operator.get('symbol');
			
			if(segment) {
				stringValue += EvolveQueryEditor.model.FilterOptionsModel.SEGMENT;
				for(var i = 1; i < segmentOffset; i++) {
					stringValue += EvolveQueryEditor.model.FilterOptionsModel.SEGMENT_PLACEHOLDER;
				}
			}
			
			stringValue += filterValue;
		}
		
		
		return stringValue; 
	}
	
}, function(Cls) {
	Cls.CASE_INSENSITIVE = '>>';
	Cls.SEGMENT = '*?';
	Cls.SEGMENT_PLACEHOLDER = '#';
	
	Cls.createFromFilterModel = function(filterModel) {
		var optionModel = Ext.create('EvolveQueryEditor.model.FilterOptionsModel');
		optionModel.filterModel = filterModel;
		
		var fromValueWithPrefix = filterModel.get('from');
		if(fromValueWithPrefix === undefined) {
			fromValueWithPrefix = '';
		}
		var toValueWithPrefix = filterModel.get('to');
		
		var placeHolderLength = 0;
		var currentOperator = EvolveQueryEditor.model.ComparisonOperatorModel.IS_NONE;
		var currentIsSegment = false;
		var currentSegmentOffset = 1;
		var currentSegmentLength = 1;
		var currentMode = EvolveQueryEditor.model.FilterModeModel.DEFAULT;
		
		var isCombinationMode = fromValueWithPrefix.indexOf(EvolveQueryEditor.model.FilterModeModel.COMBINATION.get('symbol')) === 0;
		var isLiteralMode = fromValueWithPrefix.indexOf(EvolveQueryEditor.model.FilterModeModel.LITERAL.get('symbol')) === 0;
		if(isCombinationMode) {
			placeHolderLength += EvolveQueryEditor.model.FilterModeModel.COMBINATION.get('symbol').length;
			currentMode = EvolveQueryEditor.model.FilterModeModel.COMBINATION;
		} else if(isLiteralMode) {
			placeHolderLength += EvolveQueryEditor.model.FilterModeModel.LITERAL.get('symbol').length;
			currentMode = EvolveQueryEditor.model.FilterModeModel.LITERAL;
		} else {
			var isCaseInsensitive = fromValueWithPrefix.indexOf(EvolveQueryEditor.model.FilterOptionsModel.CASE_INSENSITIVE) === 0;
			if(optionModel.isString() && isCaseInsensitive) {
				placeHolderLength += EvolveQueryEditor.model.FilterOptionsModel.CASE_INSENSITIVE.length;
				optionModel.set('caseInsensitive', true);
			}
			else {
				optionModel.set('caseInsensitive', false);	
			}
			
			if(optionModel.isRange()) {
				var operators = optionModel.isString() ? EvolveQueryEditor.model.ComparisonOperatorModel.getStringOperators() : EvolveQueryEditor.model.ComparisonOperatorModel.getNonStringOperators();
				for(var i = 0; i < operators.length;i++) {
					var isFoundOperator = fromValueWithPrefix.indexOf(operators[i].get('symbol'), placeHolderLength) === placeHolderLength;
					if(isFoundOperator) {
						currentOperator = operators[i];
						placeHolderLength += operators[i].get('symbol').length;
						break;
					}
				}
			}
			
			var isFoundSegment = fromValueWithPrefix.indexOf(EvolveQueryEditor.model.FilterOptionsModel.SEGMENT,placeHolderLength) === placeHolderLength;
			if(optionModel.isAllowSegments() && isFoundSegment) {
				currentIsSegment = true;
				placeHolderLength += EvolveQueryEditor.model.FilterOptionsModel.SEGMENT.length;
				var segmentOffset = 0;
				for(;segmentOffset < fromValueWithPrefix.length - placeHolderLength; segmentOffset++) {
					var isFoundSegmentPlaceHolder = fromValueWithPrefix.indexOf(EvolveQueryEditor.model.FilterOptionsModel.SEGMENT_PLACEHOLDER,placeHolderLength + segmentOffset);
					if(isFoundSegmentPlaceHolder !== (placeHolderLength + segmentOffset)) {
						break;
					}
				}
				
				currentSegmentOffset = segmentOffset + 1; //segment offset is based from 1, rather than 0
				placeHolderLength += segmentOffset;
				currentSegmentLength = fromValueWithPrefix.length - placeHolderLength;
			}
		}
		
		optionModel.set('mode', currentMode );
		optionModel.set('operator', currentOperator);
		optionModel.set('segment', currentIsSegment);
		optionModel.set('segmentOffset', currentSegmentOffset);
		optionModel.set('segmentLength', currentSegmentLength);
		
		optionModel.resetFromValueAndToValue();
		
		if(fromValueWithPrefix.length >= placeHolderLength) {
			optionModel.set('from', fromValueWithPrefix.substr(placeHolderLength));
		}
		
		if(optionModel.isRange() && optionModel.isFilterToNeeded()) {
			var prefixString = fromValueWithPrefix.substr(0,placeHolderLength);
			var toValueHasSamePrefixAsFromValue = toValueWithPrefix.indexOf(prefixString) === 0;
			
			if(toValueHasSamePrefixAsFromValue) {
				if(toValueWithPrefix.length >= placeHolderLength) {
					optionModel.set('to', toValueWithPrefix.substr(placeHolderLength));
				} 
			} else {
				optionModel.set('to', toValueWithPrefix);
			}
		}
		
		return optionModel;
	};
});
