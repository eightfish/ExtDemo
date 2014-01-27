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
    var allSortingTypes = new Ext.util.HashMap();
    
    Cls.None = Ext.create('EvolveQueryEditor.model.SortingTypeModel', {
        sortingType: 'None',
        sortingTypeId: 0
    });
    allSortingTypes.add(Cls.None.get('sortingTypeId'), Cls.None);
   
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
    allSortingTypes.add(Cls.Ascending.get('sortingTypeId'), Cls.Ascending);

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
    allSortingTypes.add(Cls.Descending.get('sortingTypeId'), Cls.Descending);
    
    Cls.parseFromInt = function(intValue) {
        if(!Ext.isEmpty(intValue) && Ext.isNumber(intValue)) {
            var found = allSortingTypes.get(intValue);
            if(!Ext.isEmpty(found)) {
                return found;
            }
        }
        
        return undefined;
    };
        
    
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