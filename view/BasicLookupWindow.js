/*
 * File: app/view/BasicLookupWindow.js
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

Ext.define('EvolveQueryEditor.view.BasicLookupWindow', {
    extend: 'Ext.window.Window',

    requires: [
        'EvolveQueryEditor.model.Query',
        'EvolveQueryEditor.model.FilterModel',
        'EvolveQueryEditor.model.FilterValueModel'
    ],

    height: 322,
    itemId: 'BasicLookupWindow',
    width: 400,
    layout: {
        type: 'border'
    },
    title: 'Lookup',
    modal: true,

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'container',
                    flex: 1,
                    region: 'south',
                    height: 150
                }
            ],
            listeners: {
                show: {
                    fn: me.onWindowShow,
                    scope: me
                },
                beforeshow: {
                    fn: me.onBasicLookupWindowBeforeShow,
                    scope: me
                }
            }
        });

        me.callParent(arguments);
    },

    createGrid: function(parent, store, columnData) {
        grid = Ext.create('Ext.grid.Panel', {
            flex: 6,
            region: 'center',
            itemId: 'gridResults',
            frameHeader: false,
            header: false,
            title: 'My Grid Panel',      
            store: store,
            columns: columnData,
            stripeRows: true,
            listeners: {
                itemdblclick: { fn: parent.rowSelect, scope: parent }
            }
            //renderTo: 'BasicLookupWindow'
        });
        return grid;
    },

    createStore: function(fieldData, values) {
        return Ext.create('Ext.data.ArrayStore', {
            fields: fieldData,
            data: values});
    },

    onWindowShow: function(component, eOpts) {
        this.loadMask.show();
        var parent = this;

        var storeModel = this.viewFilters.store.getAt(this.filterModelIndex);

        Ext.Ajax.request({
            url: EvolveQueryEditor.model.Query.serverUrlBase + '&method=LookupFilterValues',
            jsonData: {
                clientToken: EvolveQueryEditor.model.Query.clientToken,
                codePath: storeModel.get('codePath'),
                query: {
                    mode: EvolveQueryEditor.model.Query.getQueryType(),
                    productCode: EvolveQueryEditor.model.Query.getProductCode(),
                    tableCode: EvolveQueryEditor.model.Query.tableCode,
                    filters: EvolveQueryEditor.model.Query.getFilters()
                }
            },
            success: function(response){
                parent.loadMask.hide();

                var data = Ext.decode(response.responseText);

                var grid = parent.createGrid(parent, parent.createStore(data.fields, data.data), data.columns);
                parent.add(grid);
            },
            failure: function(response, options) {
                parent.loadMask.hide();
                alert(response.statusText);
                parent.loadMask.hide();
            }
        });
    },

    onBasicLookupWindowBeforeShow: function(component, eOpts) {
        this.loadMask = new Ext.LoadMask(this, {msg:"Please wait..."});

    },
    
    rowSelect: function(grid, record, item, index, e, eOpts) {
        this.hide();

        var storeModel = this.viewFilters.store.getAt(this.filterModelIndex);
        var model = EvolveQueryEditor.model.Query;
        // Create a model to hold the selection ...
        var modelSelection = Ext.create('EvolveQueryEditor.model.FilterValueModel', {
            codePath: storeModel.get('codePath'),
            valueFrom: record.get('col1'),
            valueTo: record.get('col1')
        });

        storeModel.beginEdit();
        storeModel.setValue(modelSelection);
        storeModel.set('hasValue', true);
        storeModel.set('from', modelSelection.get('valueFrom'));
        storeModel.set('to', modelSelection.get('valueTo'));
        storeModel.endEdit();

        if (this.onLookupComplete !== undefined) {
            this.onLookupComplete(this.scope);
        }
    }
});