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
Ext.define("EvolveQueryEditor.util.QAALogger", {

    statics: {
        composeOption: function (message, options) {
            message = "[QnA]" + message;

            if (options !== undefined) {
                options.msg = message;
            } else {
                options = { msg: message };
            }

            return options;
        },

        error: function (message,options) {
            Ext.log.error(EvolveQueryEditor.util.QAALogger.composeOption(message, options));
        },

        warn: function (message, options) {
            Ext.log.warn(EvolveQueryEditor.util.QAALogger.composeOption(message, options));
        },

        info: function (message, options) {
            Ext.log.info(EvolveQueryEditor.util.QAALogger.composeOption(message, options));
        },

        log: function (message, options) {
            Ext.log(EvolveQueryEditor.util.QAALogger.composeOption(message, options));
        }
    }
});