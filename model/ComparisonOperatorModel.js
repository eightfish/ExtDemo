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

Ext.define('EvolveQueryEditor.model.ComparisonOperatorModel', {
    extend: 'Ext.data.Model',
   
    fields: [
        { name: 'name', type: 'string'},
        { name: 'symbol', type: 'string'},
        { name: 'value', type: 'int'}
    ],
	
	isNone : function ()
	{
		return this === EvolveQueryEditor.model.ComparisonOperatorModel.IS_NONE;
	}
    
}, function(Cls) {
    var allOperators = new Ext.util.HashMap();
    
    Cls.IS_ALL = Ext.create('EvolveQueryEditor.model.ComparisonOperatorModel', {
        name: 'All',
        symbol: '<ALL>',
        value: -1
    });
    allOperators.add(Cls.IS_ALL.get('value'), Cls.IS_ALL);
    
    Cls.IS_NONE = Ext.create('EvolveQueryEditor.model.ComparisonOperatorModel', {
        name: 'None',
		symbol: '',
        value: 0
    });
    allOperators.add(Cls.IS_NONE.get('value'), Cls.IS_NONE);
   
    Cls.IS_EQUAL = Ext.create('EvolveQueryEditor.model.ComparisonOperatorModel', {
        name: 'Equal',
		symbol: '',
        value: 1
    });
    allOperators.add(Cls.IS_EQUAL.get('value'), Cls.IS_EQUAL);
    
    Cls.IS_NOT_EQUAL = Ext.create('EvolveQueryEditor.model.ComparisonOperatorModel', {
        name: 'Not Equal',
		symbol: '<>',
        value: 2
    });
    allOperators.add(Cls.IS_NOT_EQUAL.get('value'), Cls.IS_NOT_EQUAL);
    
    Cls.IS_BETWEEN = Ext.create('EvolveQueryEditor.model.ComparisonOperatorModel', {
        name: 'Between',
		symbol: '',
        value: 3
    });
    allOperators.add(Cls.IS_BETWEEN.get('value'), Cls.IS_BETWEEN);
    
    Cls.IS_NOT_BETWEEN = Ext.create('EvolveQueryEditor.model.ComparisonOperatorModel', {
        name: 'Not Between',
		symbol: '',
        value: 4
    });
    allOperators.add(Cls.IS_NOT_BETWEEN.get('value'), Cls.IS_NOT_BETWEEN);
    
    Cls.IS_LESS_THAN = Ext.create('EvolveQueryEditor.model.ComparisonOperatorModel', {
        name: 'Less Than',
		symbol: '<',
        value: 5
    });
    allOperators.add(Cls.IS_LESS_THAN.get('value'), Cls.IS_LESS_THAN);
    
    Cls.IS_LESS_THAN_OR_EQUAL_TO = Ext.create('EvolveQueryEditor.model.ComparisonOperatorModel', {
        name: 'Less Than Or Equal To',
		symbol: '<=',
        value: 6
    });
    allOperators.add(Cls.IS_LESS_THAN_OR_EQUAL_TO.get('value'), Cls.IS_LESS_THAN_OR_EQUAL_TO);
    
    Cls.IS_GREATER_THAN = Ext.create('EvolveQueryEditor.model.ComparisonOperatorModel', {
        name: 'Greater Than',
		symbol: '>',
        value: 7
    });
    allOperators.add(Cls.IS_GREATER_THAN.get('value'), Cls.IS_GREATER_THAN);
    
    Cls.IS_GREATER_THAN_EQUAL_TO = Ext.create('EvolveQueryEditor.model.ComparisonOperatorModel', {
        name: 'Greater Than Or Equal To',
		symbol: '>=',
        value: 8
    });
    allOperators.add(Cls.IS_GREATER_THAN_EQUAL_TO.get('value'), Cls.IS_GREATER_THAN_EQUAL_TO);
    
    Cls.IS_LIKE = Ext.create('EvolveQueryEditor.model.ComparisonOperatorModel', {
        name: 'Like',
		symbol: '*=',
        value: 9
    });
    allOperators.add(Cls.IS_LIKE.get('value'), Cls.IS_LIKE);
    
    Cls.IS_NOT_LIKE = Ext.create('EvolveQueryEditor.model.ComparisonOperatorModel', {
        name: 'Not Like',
		symbol: '*!',
        value: 10
    });
    allOperators.add(Cls.IS_NOT_LIKE.get('value'), Cls.IS_NOT_LIKE);
    
    Cls.IS_NULL = Ext.create('EvolveQueryEditor.model.ComparisonOperatorModel', {
        name: 'Is Null',
		symbol: '<IS NULL>',
        value: 11
    });
    allOperators.add(Cls.IS_NULL.get('value'), Cls.IS_NULL);
    
    Cls.IS_NOT_NULL = Ext.create('EvolveQueryEditor.model.ComparisonOperatorModel', {
        name: 'Is Not Null',
		symbol: '<IS NOT NULL>',
        value: 12
    });
    allOperators.add(Cls.IS_NOT_NULL.get('value'), Cls.IS_NOT_NULL);
    
    Cls.parseFromInt = function(intValue) {
        if(!Ext.isEmpty(intValue) && Ext.isNumber(intValue)) {
            var found = allOperators.get(intValue);
            if(!Ext.isEmpty(found)) {
                return found;
            }
        }
        
        return undefined;
    };
    
    var specialOperators = [Cls.IS_ALL,Cls.IS_NULL,Cls.IS_NOT_NULL];
    var nonStringOperators = specialOperators.concat([Cls.IS_GREATER_THAN_EQUAL_TO,Cls.IS_LESS_THAN_OR_EQUAL_TO,Cls.IS_NOT_EQUAL,Cls.IS_GREATER_THAN,Cls.IS_LESS_THAN]);
    var stringOperators = nonStringOperators.concat([Cls.IS_LIKE,Cls.IS_NOT_LIKE]);
    
    Cls.getSpecialOperators = function() {
        return specialOperators;
    };
    
    Cls.getNonStringOperators = function() {
        return nonStringOperators;
    };
    
    Cls.getStringOperators = function() {
        return stringOperators;
    };
    
    Cls.getAvailableOperators = function(filterIsRange, filterIsString) {
        var operators = [Cls.IS_NONE];
        if(!filterIsRange) {
            return operators;
        }
        
        operators = operators.concat([Cls.IS_ALL,Cls.IS_NOT_NULL,Cls.IS_GREATER_THAN_EQUAL_TO,Cls.IS_LESS_THAN_OR_EQUAL_TO,Cls.IS_NOT_EQUAL,Cls.IS_GREATER_THAN,Cls.IS_LESS_THAN]);
        if(filterIsString) {
            operators = operators.concat([Cls.IS_LIKE,Cls.IS_NOT_LIKE]);
        }
        return operators;
    };
	
	var operatorsWhichNeedValue = [Cls.IS_NONE, Cls.IS_GREATER_THAN, Cls.IS_GREATER_THAN_EQUAL_TO, Cls.IS_LESS_THAN, Cls.IS_LESS_THAN_OR_EQUAL_TO, Cls.IS_NOT_EQUAL, Cls.IS_LIKE, Cls.IS_NOT_LIKE];
	Cls.getOperatorsWhichNeedValue = function() {
		return operatorsWhichNeedValue;
	};
});
