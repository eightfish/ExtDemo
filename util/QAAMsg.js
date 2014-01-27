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
Ext.define("EvolveQueryEditor.util.QAAMsg", {

},function(Cls){
    
    var show = function ( message,title,iconType) {
            Infor.MsgBox.show({
                 title:title,
                 msg: message,
                 btns: [{
                     text: Infor.MsgText.ok
                 }],
                 iconCls: iconType                
            });
        };
        
    Cls.showErrorDialog = function (message) {
            show(message,"Error",'dicon-error');
        },
        
    Cls.showWarnDialog= function (message) {
        show(message, "Warning", 'dicon-alert');
        },
        
    Cls.showInfoDialog= function (message) {
        show(message, "Information", 'dicon-information');
        }
});