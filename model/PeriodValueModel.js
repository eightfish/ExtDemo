/*
 * File: app/model/PeriodValueModel.js
 *
 */

Ext.define('EvolveQueryEditor.model.PeriodValueModel', {
    extend: 'Ext.data.Model',

    idProperty: 'Value',

    fields: [
        {
            name: 'Value', type: 'string'
        },
        {
            name: 'DisplayValue', type: 'string'
        }
    ]


});