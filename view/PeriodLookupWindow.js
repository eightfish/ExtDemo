/*
 * File: app/view/PeriodLookupWindow.js
 *
 */

Ext.define('EvolveQueryEditor.view.PeriodLookupWindow', {
    extend: 'Ext.window.Window',

    requires: [
        'EvolveQueryEditor.model.Query',
        'EvolveQueryEditor.model.FilterModel',
        'EvolveQueryEditor.model.FilterValueModel'
    ],

    height: 322,
    itemId: 'BasicLookupWindow',
    id: 'qnaWindowPeriodLookup',
    width: 400,
    layout: {
        type: 'border'
    },
    title: 'Period Lookup',
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
            ]
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

    onWindowShow: function (component, eOpts) {
        var parent = this;

        var storeModel = parent.viewFilters.store.getAt(parent.filterModelIndex);

        if (storeModel.lookupStore === undefined) {
            parent.loadMask.show();
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
                success: function (response) {
                    parent.loadMask.hide();

                    var data = Ext.decode(response.responseText);
                    storeModel.lookupStore = parent.createStore(data.fields, data.data);
                    storeModel.dataColumns = data.columns;

                    if (parent.grid !== undefined) {
                        parent.grid.reconfigure(storeModel.lookupStore, storeModel.dataColumns);
                    } else {
                        parent.grid = parent.createGrid(parent, storeModel.lookupStore, storeModel.dataColumns);
                        parent.add(parent.grid);
                    }
                },
                failure: function (response, options) {
                    parent.loadMask.hide();
                    alert(response.statusText);
                    parent.loadMask.hide();
                }
            });
        } else {
            if (parent.grid !== undefined) {
                parent.grid.reconfigure(storeModel.lookupStore, storeModel.dataColumns);
            } else {
                parent.grid = parent.createGrid(parent, storeModel.lookupStore, storeModel.dataColumns);
                parent.add(parent.grid);
            }
        }
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
}, function (Cls) {
    Cls.Instance = EvolveQueryEditor.view.PeriodLookupWindow.create();
});