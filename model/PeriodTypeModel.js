/*
 * File: app/model/PeriodTypeModel.js
 *
 */

Ext.define('EvolveQueryEditor.model.PeriodTypeModel', {
    extend: 'Ext.data.Model',

    idProperty: 'Code',

    fields: [
        {
            name: 'Code', type: 'string'
        },
        {
            name: 'Description', type: 'string'
        },
        {
            name: 'IsOffSet1Visible', type: 'boolean'
        },
        {
            name: 'IsOffSet2Visible', type: 'boolean'
        },
        {
            name: 'IsOffSet3Visible', type: 'boolean'
        }
    ]


});