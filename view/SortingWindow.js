Ext.define('EvolveQueryEditor.view.SortingWindow',
{
    extend: 'Ext.window.Window',    

    title: 'OutputField Sorting Window',
    layout: 'fit',
    autoshow: true,
    modal: true,
    minHeight: 400,
    minWidth: 500,
    width: 500,

    requires: [
		'Ext.grid.*',
		'Ext.util.*',
		'Ext.form.*',
		'Ext.selection.CellModel',
		'EvolveQueryEditor.model.OutputFieldSortingModel',
        'EvolveQueryEditor.store.SortingTypeStore'
    ],

    config: {
        outputFieldsStore: null,
        onLookupComplete: null,
        scope: null
    },

    constructor: function (config) {
        this.callParent(arguments);
        this.initConfig(config)
        return this;
    },

    initComponent: function () {
        var me = this;
        var cellEditing = new Ext.grid.plugin.CellEditing(
			{
			    clicksToEdit: 1
			}
			);

        Ext.applyIf(me,
		{
		    items: [
				{
				    xtype: 'form',
				    width: 150,
				    items: [
						{
						    xtype: 'gridpanel',
						    itemId: 'sortingGrid',
						    region: 'center',
						    plugins: [cellEditing],
						    store: me.outputFieldsStore,							
						    // viewConfig : {
						    // plugins : {
						    // ptype : 'gridviewdragdrop',
						    // dragText : 'Reorder sorting'
						    // }
						    // },
						    columns: [
								{
								    text: 'Sorting Field',
								    dataIndex: 'fieldName',
								    sortable: false,
								    width: 150,
								    menuDisabled: true
								},
								{
								    text: 'Extraction Type',
								    dataIndex: 'extractType',
									renderer: function(extractType) {
										return extractType.get('description');
									},
								    width: 150,
								    sortable: false,
								    menuDisabled: true
								},
								{
								    text: 'Sorting Type',
								    dataIndex: 'sortingType',
								    width: 100,
								    sortable: false,
								    menuDisabled: true,
								    flex: 1,
								    editor:
									{
									    xtype: 'combobox',
									    store: EvolveQueryEditor.store.SortingTypeStore.Instance,
									    editable: false,
									    queryMode: 'local',
									    displayField: 'sortingType',
									    valueField: 'sortingTypeId'
									},
								    renderer: me.onRendererSortType
								}
						    ]
						},
						{
						    xtype: 'panel',
						    layout:
							{
							    type: 'vbox',
							    align: 'right'
							},
						    items: [
                                {
                                    xtype: 'button',
                                    text: 'Top',
                                    itemId: 'qnaButtonTop',
                                    width: 50,
                                    margin: '5 0 0 5',
                                    listeners:
									{
									    click:
										{
										    fn: me.onSortingTop,
										    scope: me
										}
									}
                                },
								{
								    xtype: 'button',
								    text: 'Up',
								    width: 50,
                                    itemId: 'qnaButtonUp',
								    margin: '5 0 0 5',
								    listeners:
									{
									    click:
										{
										    fn: me.onSortingUp,
										    scope: me
										}
									}
								},
								{
								    xtype: 'button',
								    text: 'Down',
									itemId: 'qnaButtonDown',
								    width: 50,
								    margin: '5 0 0 5',
								    listeners:
									{
									    click:
										{
										    fn: me.onSortingDown,
										    scope: me
										}
									}
								},
								{
								    xtype: 'button',
								    text: 'Bottom',
									itemId: 'qnaButtonBottom',
								    width: 50,
								    margin: '5 0 0 5',
								    listeners:
									{
									    click:
										{
										    fn: me.onSortingBottom,
										    scope: me
										}
									}
								}
						    ]
						}
				    ],
				    buttonAlign: 'center',
				    buttons: [
						{
						    text: 'OK',
						    scope: me,
							itemId: 'qnaButtonOK',
						    handler: function () {
						        me.onLookupComplete(me.outputFieldsStore, me.scope);
						        me.close();
						    }
						},
						{
						    text: 'Cancel',
							itemId: 'qnaButtonCancel',
						    scope: me,
						    handler: me.close
						}
				    ]
				}
		    ]
		}
		);

        me.callParent(arguments);
    },

    //TODO: it maybe move to model 
    onRendererSortType: function (value) {
        switch (value) {
            case 0:
                return 'None';
                break;
            case 1:
                return 'Ascending';
                break;
            case 2:
                return 'Descending';
                break;
        }

        return value;
    },

    sortStore: function (getExchangedRowIndex) {
        var grid = this.down('#sortingGrid');
        var selectedRecord = grid.getSelectionModel().getSelection()[0];
        if (selectedRecord == undefined) return;

        var store = grid.store;
        var exchangedRowIndex = getExchangedRowIndex(store.indexOf(selectedRecord), store);
        store.remove(selectedRecord);
        store.insert(exchangedRowIndex, selectedRecord);

        grid.getSelectionModel().deselectAll();
    },

    onSortingUp: function () {
        this.sortStore(function (selectedRowIndex, store) {
            return selectedRowIndex == 0 ? 0 : selectedRowIndex - 1;
        }
		);
    },

    onSortingDown: function () {
        this.sortStore(function (selectedRowIndex, store) {
            return selectedRowIndex == store.getCount() - 1 ? store.getCount() - 1 : selectedRowIndex + 1;
        }
		);
    },

    onSortingTop: function () {
        this.sortStore(function (selectedRowIndex, store) {
            return 0;
        }
		);
    },

    onSortingBottom: function () {
        this.sortStore(function (selectedRowIndex, store) {
            return store.getCount() - 1;
        }
		);
    }
}
);
