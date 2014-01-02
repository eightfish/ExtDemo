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
    id: 'qnaWindowSorting',

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
							id: 'qnaGridSorting',
						    itemId: 'qnaGridSorting',
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
									renderer : function(value) 
									{
										return value.get('sortingType');
									}
									
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
									id: 'qnaButtonMoveToTop',
                                    itemId: 'qnaButtonMoveToTop',
                                    width: 50,
                                    margin: '5 0 0 5',
                                    listeners:
									{
									    click:
										{
										    fn: me.moveToTop,
										    scope: me
										}
									}
                                },
								{
								    xtype: 'button',
								    text: 'Up',
								    width: 50,
									id: 'qnaButtonMoveUp',
                                    itemId: 'qnaButtonMoveUp',
								    margin: '5 0 0 5',
								    listeners:
									{
									    click:
										{
										    fn: me.moveUp,
										    scope: me
										}
									}
								},
								{
								    xtype: 'button',
								    text: 'Down',
									id: 'qnaButtonMoveDown',
									itemId: 'qnaButtonMoveDown',
								    width: 50,
								    margin: '5 0 0 5',
								    listeners:
									{
									    click:
										{
										    fn: me.moveDown,
										    scope: me
										}
									}
								},
								{
								    xtype: 'button',
								    text: 'Bottom',
									id: 'qnaButtonMoveToBottom',
									itemId: 'qnaButtonMoveToBottom',
								    width: 50,
								    margin: '5 0 0 5',
								    listeners:
									{
									    click:
										{
										    fn: me.moveToBottow,
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
							id: 'qnaButtonOK',
							itemId: 'qnaButtonOK',
						    handler: function () {
						        me.onLookupComplete(me.outputFieldsStore, me.scope);
						        me.close();
						    }
						},
						{
						    text: 'Cancel',
							id: 'qnaButtonCancel',
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

    moveSelectedRow: function (funcGetTargetRowIndexToMove) {
        var grid = this.down('#qnaGridSorting');
        var selectedRecord = grid.getSelectionModel().getSelection()[0];
        if (selectedRecord === undefined) return;

        var store = grid.store;
		var originalRowIndex = store.indexOf(selectedRecord);
        var targetRowIndex = funcGetTargetRowIndexToMove(originalRowIndex, store.getCount());
		if(originalRowIndex !== targetRowIndex) {
			store.remove(selectedRecord);
			store.insert(targetRowIndex, selectedRecord);
	
			grid.getSelectionModel().deselectAll();
		}
    },

    moveUp: function () {
        this.moveSelectedRow(function (selectedRowIndex, count) {
            return selectedRowIndex === 0 ? 0 : selectedRowIndex - 1;
        }
		);
    },

    moveDown: function () {
        this.moveSelectedRow(function (selectedRowIndex, count) {
            return (selectedRowIndex === count - 1) ? count - 1 : selectedRowIndex + 1;
        }
		);
    },

    moveToTop: function () {
        this.moveSelectedRow(function (selectedRowIndex, count) {
            return 0;
        }
		);
    },

    moveToBottow: function () {
        this.moveSelectedRow(function (selectedRowIndex, count) {
            return count - 1;
        }
		);
    }
}
);
