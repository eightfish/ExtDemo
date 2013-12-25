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
    ]

}, function (Cls) {
    Cls.None = Ext.create('EvolveQueryEditor.model.SortingTypeModel', {
        sortingType: 'None',
        sortingTypeId: 0
    });

    Cls.Ascending = Ext.create('EvolveQueryEditor.model.SortingTypeModel', {
        sortingType: 'Ascending',
        sortingTypeId: 1
    });

    Cls.Descending = Ext.create('EvolveQueryEditor.model.SortingTypeModel', {
        sortingType: 'Descending',
        sortingTypeId: 2
    });
});