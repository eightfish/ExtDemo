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

Ext.define('EvolveQueryEditor.view.TableTreeLookupWindow', {
    extend: 'Ext.window.Window',

    requires: [
        'EvolveQueryEditor.model.Query',
        'EvolveQueryEditor.model.FilterModel',
        'EvolveQueryEditor.model.FilterValueModel',
		'EvolveQueryEditor.util.QAAMsg'
    ],

    height: 322,
    itemId: 'TableTreeLookupWindow',
    id: 'qnaWindowTableLookup',
    width: 400,
    layout: {
        type: 'border'
    },
    title: 'Lookup',
    modal: true,
    closeAction:'hide',
    
    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'treepanel',
                    flex: 6,
                    region: 'center',
                    itemId: 'treeTables',
                    frameHeader: false,
                    header: false,
                    lines: true,
                    useArrows: true,
                    title: 'Table Hierarchy',
                    rootVisible: false,
                    listeners: {
                        itemdblclick: { fn: me.itemSelect, scope: me }
                    }
                    //store: 'TableStore',
                    /*
                    columns: [{
                        xtype: 'treecolumn',
                        dataIndex: 'name',
                        flex: 1
                    }]
                    */
                },
                {
                    xtype: 'container',
                    region: 'south',
                    margin: '40 0 0 0 0',
                    layout: {
                        align: 'middle',
                        pack: 'center',
                        type: 'hbox'
                    },
                    items: [
                        {
                            xtype: 'button',
                            itemId: 'qnaButtonTableLookupOk',
                            id: 'qnaButtonTableLookupOk',
                            margin: '5 5 5 5',
                            width: 75,
                            text: 'OK',
                            listeners: {
                                click: {
                                    fn: me.onBtnOk,
                                    scope: me
                                }
                            }
                        },
                        {
                            xtype: 'button',
                            itemId: 'qnaButtonTableLookupCancel',
                            id: 'qnaButtonTableLookupCancel',
                            margin: '5 5 5 5',
                            width: 75,
                            text: 'Cancel',
                            listeners: {
                                click: {
                                    fn: me.onBtnCancel,
                                    scope: me
                                }
                            }
                        }
                    ]
                }
            ],
            listeners: {
                show: {
                    fn: me.onWindowShow,
                    scope: me
                },
            }
        });

        me.callParent(arguments);
    },
    
    _flattenTableResult:function (array) {
        var worker = [];
    
        function rFlatten(a) {
            var i, ln, v;
    
            for (i = 0, ln = a.length; i < ln; i++) {
                v = a[i];                
              
                worker.push(v);
              
                if (!Ext.isEmpty(v.children) && Ext.isArray(v.children)) {
                    rFlatten(v.children);
                } 
            }
    
            return worker;
        }
    
        return rFlatten(array);
    }, 
    
    onWindowShow: function (component, eOpts) {
        //this.down('#treeTables').store.load();

        var parent = this;
        var storeModel = parent.viewFilters.store.getAt(parent.filterModelIndex);
        if (storeModel.isTablesSet !== true) { //!== true means undefined
            var grid = this.down('#treeTables');

            grid.setLoading(true, "Loading Table hierarchy ...");

            Ext.Ajax.request({
                url: EvolveQueryEditor.model.Query.serverUrlBase + '&method=LookupTables',
                jsonData: {
                    clientToken: EvolveQueryEditor.model.Query.clientToken,
                    query: {
                        productCode: EvolveQueryEditor.model.Query.getProductCode(),
                        tableCode: '',
                        mode: EvolveQueryEditor.model.Query.getQueryType(),
                        filters: EvolveQueryEditor.model.Query.getFilters()
                    }
                },
                success: function (response) {
                    grid.setLoading(false);
                    var data = Ext.decode(response.responseText);
                    
                    //change the gap between icon and description
                    var flattenArray = parent._flattenTableResult(data.data.children);                     
                    Ext.each(flattenArray, function(item){
					   item.iconCls = me._getTreeNonLeafNodeImgCls();
				    });
                
                    storeModel.isTablesSet = true;
                    parent.down('#treeTables').setRootNode(data.data);
                },
                failure: function (response, options) {
                    grid.setLoading(false);
                    EvolveQueryEditor.util.QAAMsg.showErrorDialog(response.statusText);
                }
            });
        }
    },
    
    trySelectTable : function(table){
        if (table.leaf) {
            this.hide();

            if (table.filtercode === EvolveQueryEditor.model.Query.tableCode) {
                //Nothing changed.
                return;
            }
            EvolveQueryEditor.model.Query.setTable(table.filtercode, table.text, table.namePlusCode);

            this.onLookupComplete(this.scope);
        }
    },

    itemSelect: function (grid, record, item, index, e, eOpts) {
        this.trySelectTable(record.raw);
    },

    onBtnOk: function (button, e, eOpts) {
        var sm = this.down('#treeTables').getSelectionModel();
        if (sm.hasSelection()) {
            var selectedTable = sm.getSelection()[0].raw;
            this.trySelectTable(selectedTable);
        }
    },

    onBtnCancel: function (button, e, eOpts) {
        this.hide();
    }
}, function (Cls) {
    Cls.Instance = EvolveQueryEditor.view.TableTreeLookupWindow.create();
});