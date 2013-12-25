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
Ext.define("EvolveQueryEditor.model.FieldDataTypeModel", {
    extend: "Ext.data.Model",

    fields: [
        {name: 'typeName',  type: 'string'},
        {name: 'dataType', type: 'string'},
    ],
    
    isNumeric: function() {
        return false;
    }

}, function(Cls) {
    Cls.StringDataType = Ext.create("EvolveQueryEditor.model.FieldDataTypeModel", {
        typeName: "String",
        dataType: "string"
    });
    
    Cls.NumericDataType = Ext.create("EvolveQueryEditor.model.FieldDataTypeModel", {
        typeName: "Numeric",
        dataType: "number"
    });
    Cls.NumericDataType.isNumeric = function() {
        return true;
    }
    
    Cls.TimeDataType = Ext.create("EvolveQueryEditor.model.FieldDataTypeModel", {
        typeName: "Time",
        dataType: "time"
    });
        
    var hash = new Ext.util.HashMap();
    hash.add(Cls.StringDataType.get("dataType"),Cls.StringDataType);
    hash.add(Cls.NumericDataType.get("dataType"),Cls.NumericDataType);
    hash.add(Cls.TimeDataType.get("dataType"),Cls.TimeDataType);
    
    Cls.find = function (dataType) {
        return hash.get(dataType);
    };

});
