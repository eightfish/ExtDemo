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
Ext.define("EvolveQueryEditor.model.ScalingFactorModel", {
    extend: "Ext.data.Model",

    fields: [
        {name: 'text',  type: 'string'},
        {name: 'value', type: 'string'},
    ]

}, function(Cls) {
    Cls.DividedBy10 = Ext.create("EvolveQueryEditor.model.ScalingFactorModel", {
        text: "/10",
        value: "/10"
    });
    
    Cls.DividedBy100 = Ext.create("EvolveQueryEditor.model.ScalingFactorModel", {
        text: "/100",
        value: "/100"
    });
    
    Cls.DividedBy1000 = Ext.create("EvolveQueryEditor.model.ScalingFactorModel", {
        text: "/1000",
        value: "/1000"
    });
    
    Cls.DividedBy10000 = Ext.create("EvolveQueryEditor.model.ScalingFactorModel", {
        text: "/10000",
        value: "/10000"
    });
    
    Cls.DividedBy100000 = Ext.create("EvolveQueryEditor.model.ScalingFactorModel", {
        text: "/100000",
        value: "/100000"
    });
    
    Cls.DividedBy1000000 = Ext.create("EvolveQueryEditor.model.ScalingFactorModel", {
        text: "/1000000",
        value: "/1000000"
    });
    
    Cls.DividedBy10000000 = Ext.create("EvolveQueryEditor.model.ScalingFactorModel", {
        text: "/10000000",
        value: "/10000000"
    });
});
