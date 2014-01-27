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

Ext.define("EvolveQueryEditor.util.HtmlUtils", {
    statics: {
        convertAngleBracketToPlaceHolder : function (value) {
            return value.replace(/</g, "LEFT_ANGLE_BRACKET_PLACEHOLDER").replace(/>/g, "RIGHT_ANGLE_BRACKET_PLACEHOLDER");
        },
    
        escapeRegExp : function (str) {
            return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
        },

        replaceAll : function(find, replace, str) {
            return str.replace(new RegExp(EvolveQueryEditor.util.HtmlUtils.escapeRegExp(find), 'g'), replace);
        },

        convertLTandGT: function (value) {
            var s1 = EvolveQueryEditor.util.HtmlUtils.replaceAll("&gt;", "RIGHT_ANGLE_BRACKET_PLACEHOLDER", value);
            var s2 = EvolveQueryEditor.util.HtmlUtils.replaceAll("&lt;", "LEFT_ANGLE_BRACKET_PLACEHOLDER", s1);

            return s2;
        },

        convertPlaceHolderToAngleBracket: function (value) {
            return value.replace(/LEFT_ANGLE_BRACKET_PLACEHOLDER/g, "<").replace(/RIGHT_ANGLE_BRACKET_PLACEHOLDER/g, ">");
        }
    }
});