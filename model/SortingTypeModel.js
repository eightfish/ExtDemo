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

Ext.define("EvolveQueryEditor.model.SortingTypeModel", {
    extend: "Ext.data.Model",

    fields: [
       {
           name: 'sortingType',
           type: 'string'
       },
       {
           name: 'sortingTypeId',
           type: 'int'
       }
    ],
    
    toFormula: function(sortIndex) {
        return '';
    }

}, function (Cls) {
    Cls.None = Ext.create('EvolveQueryEditor.model.SortingTypeModel', {
        sortingType: 'None',
        sortingTypeId: 0
    });
   
    Cls.Ascending = Ext.create('EvolveQueryEditor.model.SortingTypeModel', {
        sortingType: 'Ascending',
        sortingTypeId: 1
    });
    
    Ext.override(Cls.Ascending, {
        toFormula: function(sortIndex) {
            if(sortIndex === 0) return "";
            return Ext.String.format("S={0}", sortIndex);
        }
    });    

    Cls.Descending = Ext.create('EvolveQueryEditor.model.SortingTypeModel', {
        sortingType: 'Descending',
        sortingTypeId: 2
    });
    
    Ext.override(Cls.Descending, {
        toFormula: function(sortIndex) {
            if(sortIndex === 0) return "";
            return Ext.String.format("S=({0})", sortIndex);
        }
    });
    
    Cls.parseFromString = function(str) {
        var sortingType = EvolveQueryEditor.model.SortingTypeModel.None;
        var sortIndex = 0;
        
        if(!Ext.isEmpty(str)) {
            var len = str.length;
            var descending = (str[0] === '(' && str[len-1] === ')');
            if(descending) {
                str = str.substring(1, len-1);
            }
            var temp = parseInt(str);
            if(Ext.isNumber(sortIndex)) {
                sortIndex = temp;
                sortingType = descending? EvolveQueryEditor.model.SortingTypeModel.Descending : EvolveQueryEditor.model.SortingTypeModel.Ascending;
            }
        }
        
        return {
            sortingType: sortingType,
            sortIndex: sortIndex
        }
    }
});