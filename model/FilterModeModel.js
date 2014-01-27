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

Ext.define('EvolveQueryEditor.model.FilterModeModel', {
    extend: 'Ext.data.Model',
    
    fields: [
        { name: 'name', type: 'string'},
        { name: 'symbol', type: 'string'},
        { name: 'value', type: 'int'}
    ],
	
	isLiteralMode : function() {
		return this === EvolveQueryEditor.model.FilterModeModel.LITERAL;
	},
	
	isDefaultMode : function() {
		return this === EvolveQueryEditor.model.FilterModeModel.DEFAULT;
	},
	
	isCombinationMode : function() {
		return this === EvolveQueryEditor.model.FilterModeModel.COMBINATION;
	}

}, function(Cls) {
    var allModes = new Ext.util.HashMap();
    
    Cls.DEFAULT = Ext.create('EvolveQueryEditor.model.FilterModeModel', {
        name: 'Default',
        symbol: '',
        value: 0
    });
    allModes.add(Cls.DEFAULT.get('value'), Cls.DEFAULT);
    
    Cls.COMBINATION = Ext.create('EvolveQueryEditor.model.FilterModeModel', {
        name: 'Combination',
        symbol: '<<',
        value: 1
    });
    allModes.add(Cls.COMBINATION.get('value'), Cls.COMBINATION);
    
    Cls.LITERAL = Ext.create('EvolveQueryEditor.model.FilterModeModel', {
        name: 'Literal',
        symbol: '*>',
        value: 2
    });
    allModes.add(Cls.LITERAL.get('value'), Cls.LITERAL);
    
    Cls.parseFromInt = function(intValue) {
        if(!Ext.isEmpty(intValue) && Ext.isNumber(intValue)) {
            var found = allModes.get(intValue);
            if(!Ext.isEmpty(found)) {
                return found;
            }
        }
        
        return undefined;
    };
    
	var allFilterModes = [Cls.DEFAULT, Cls.COMBINATION, Cls.LITERAL];
    Cls.getAllFilterModes = function() {
        return allFilterModes;
    };
});