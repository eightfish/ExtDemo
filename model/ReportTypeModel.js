/*
 * File: app/model/ReportTypeModel.js
 *
 * This file was generated by Sencha Architect version 2.2.2.
 * http://www.sencha.com/products/architect/
 *
 * This file requires use of the Ext JS 4.1.x library, under independent license.
 * License of Sencha Architect does not include license for Ext JS 4.1.x. For more
 * details see http://www.sencha.com/license or contact license@sencha.com.
 *
 * This file will be auto-generated each and everytime you save your project.
 *
 * Do NOT hand edit this file.
 */

Ext.define('EvolveQueryEditor.model.ReportTypeModel', {
    extend: 'Ext.data.Model',

    idProperty: 'Type',

    fields: [
        {
            name: 'Type', type:'int'
        },
        {
            name: 'Caption', type:'string'
        }
    ],

    toFormula: function () {
        return "QAA";
    }


}, function(Cls) {
    
    Cls.SummaryReport = Ext.create("EvolveQueryEditor.model.ReportTypeModel", {
        Type: 2,
        Caption: 'Summary',

    });
    
    Cls.SummaryReport.toFormula = function () {
        return "QAA_SR";
    };

    Cls.DetailReport = Ext.create("EvolveQueryEditor.model.ReportTypeModel", {
        Type: 3,
        Caption: 'Detail'
    });
    
    Cls.DetailReport.toFormula = function () {
        return "QAA_DR";
    };

    var map = new Ext.util.HashMap();
    map.add(Cls.SummaryReport.toFormula(), Cls.SummaryReport);
    map.add(Cls.DetailReport.toFormula(), Cls.DetailReport);

    Cls.getReportType = function (formula) {
        if (map !== undefined) {
            return map.get(formula);
        } else {
            EvolveQueryEditor.util.QAALogger.error(Ext.String.format("The given query definition's report type is not correct: {0}"), formula);
        }
    };
});