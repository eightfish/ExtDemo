/*
 * File: app/view/EditorControl.js
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

Ext.define('EvolveQueryEditor.model.FieldTreeModel', {
    extend: 'Ext.data.TreeModel',
    requires: [
        'Ext.data.NodeInterface'
    ]
},
function () {
    Ext.data.NodeInterface.decorate(this);
});

Ext.define('EvolveQueryEditor.view.EditorControl', {
    extend: 'Ext.panel.Panel',

    requires: [
        'EvolveQueryEditor.model.FieldDataTypeModel',
        'EvolveQueryEditor.model.ExtractionTypeModel',
        'EvolveQueryEditor.model.ScalingFactorModel',
        'EvolveQueryEditor.model.SortingTypeModel',
        'EvolveQueryEditor.model.FilterModel',
        'EvolveQueryEditor.model.Query',
        'EvolveQueryEditor.model.OutputFieldModel',
		'EvolveQueryEditor.model.OutputFieldSortingModel',
        
        'EvolveQueryEditor.store.ScalingFactorStore',
        'EvolveQueryEditor.store.ProductStore',
        'EvolveQueryEditor.store.SuperFieldsStore',
        'EvolveQueryEditor.store.ReportTypeStore',
        'EvolveQueryEditor.store.SortingTypeStore',
        'EvolveQueryEditor.store.MandatoryFieldsStore',
        'EvolveQueryEditor.store.BasicLookupStore',
        'EvolveQueryEditor.store.QueryContextStore',

        'EvolveQueryEditor.view.BasicLookupWindow',
        'EvolveQueryEditor.view.PeriodLookupWindow',
        'EvolveQueryEditor.view.TableTreeLookupWindow',
        'EvolveQueryEditor.view.EvolveProgressDialog',
        "EvolveQueryEditor.view.ExtractionTypeWindow",
		'EvolveQueryEditor.view.SortingWindow',
		'EvolveQueryEditor.view.FilterOptionsWindow'
    ],

    title: 'Q&A Query Editor',
    header: false,
    layout: 'border',
    width: 717,
    height: 555,
    id: 'qnaPanelQueryEditor',

    /**
     * @cfg {Infor.BI.dashboards.IDialogContainer} dialogContainer Reference to object providing dashboard functionality. (required)
     */
    dialogContainer: undefined,

    initComponent: function () {
        this.dialogContainer.UX.showLoadingMask("Loading...");
        var me = this;

        var proxyUrl = me.dialogContainer.getActionUrl('EvolveProxy', 'Index', { aliasName: me.dialogConfig.aliasName }),
                    loginUrl = me.dialogContainer.getActionUrl('EvolveProxy', 'Login', { aliasName: me.dialogConfig.aliasName, connectionInfo: me.dialogConfig.connectionInfo });

        if (EvolveQueryEditor.model.Query.clientToken == undefined) {

            Ext.Ajax.request({
                url: loginUrl,
                timeout: 60000,
                async: false, 
                success: function (result, options) {
                    var res = Ext.decode(result.responseText);
                    var model = EvolveQueryEditor.model.Query;
                    model.clientToken = res.data.ClientToken;
                    model.serverUrlBase = proxyUrl;


                },
                failure: function (result, options) {
                    alert(result.statusText);
                }
            });

        }

        me.setQueryDefinition(me.dialogConfig.query);
        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'panel',
                    region: 'north',
                    split: true,
                    height: 250,
                    layout: {
                        type: 'border'
                    },
                    collapsible: true,
                    title: 'Filters',
                    titleCollapse: true,
                    itemId: 'qnaFiltersPanel',
                    id: 'qnaPanelFilters',
                    items: [
                        {
                            xtype: 'panel',
                            region: 'north',
                            height: 98,
                            layout: {
                                type: 'border'
                            },
                            header: false,
                            title: 'My Panel',
                            items: [
                                {
                                    xtype: 'fieldcontainer',
                                    region: 'west',
                                    margin: '0 0 0 20',
                                    width: 358,
                                    items: [
                                        {
                                            xtype: 'combobox',
                                            tpl: '<tpl for="."><div class="x-boundlist-item"><span style="display: inline-block; height: 50px;line-height: 50px;vertical-align: middle"><img style="vertical-align: middle" src="{TypeImage}"/>&nbsp;&nbsp;{Caption}</span></div></tpl>',
                                            itemId: 'cbQueryTypes',
                                            id: 'qnaComboBoxQueryType',
                                            width: 301,
                                            fieldLabel: 'Report Type',
                                            editable: false,
                                            displayField: 'Caption',
                                            queryMode: 'local',
                                            store: EvolveQueryEditor.store.ReportTypeStore.create(me.dialogContainer),
                                            valueField: 'Type',
                                            value: EvolveQueryEditor.model.Query.getQueryType(),
                                            listeners: {
                                                select: {
                                                    fn: me.onComboboxSelect,
                                                    scope: me
                                                }
                                            }
                                        },
                                        {
                                            xtype: 'combobox',
                                            tpl: '<tpl for="."><div class="x-boundlist-item"><span style="display: inline-block; height: 26px;line-height: 26px;vertical-align: middle"><img style="vertical-align: middle" src="{IconUrl}"/>&nbsp;&nbsp;{Description}</span></div></tpl>',
                                            disabled: EvolveQueryEditor.model.Query.getQueryType() === undefined,
                                            itemId: 'cbProducts',
                                            id: 'qnaComboBoxProduct',
                                            width: 301,
                                            fieldLabel: 'Product',
                                            editable: false,
                                            displayField: 'Description',
											store: EvolveQueryEditor.model.Query.getProductStore(),
                                            valueField: 'Code',
                                            value: EvolveQueryEditor.model.Query.getProductCode(),
                                            listeners: {
                                                select: {
                                                    fn: me.onCbProductsSelect,
                                                    scope: me
                                                }
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            xtype: 'gridpanel',
                            region: 'center',
                            itemId: 'gridFilters',
                            id: 'qnaGridFilters',
                            store: EvolveQueryEditor.model.Query.getFilterStore(),
							tools: [{
								type: 'gear',
								tooltip: 'Options',
								handler : function(event, toolEl, panel) {
									me.onPopupFilterOptionsWindowClick();
								}
							}],
                            columns: [
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'name',
                                    text: 'Filter Name',
                                    flex: 15
                                },
                                {
                                    xtype: 'actioncolumn',
                                    flex: 2,
                                    items: [
                                        {
                                            handler: function (view, rowIndex, colIndex, item, e, record, row) {
                                                var filterType = record.get('codePath');
                                                if (filterType == 'TABLE') {
                                                    // Perform a table lookup ...
                                                    var lookupWindow = EvolveQueryEditor.view.TableTreeLookupWindow.Instance;
                                                    lookupWindow.viewFilters = me.down('#gridFilters');

                                                    // It would appear that the record passed in is a clone from the store ...
                                                    // ... edit operations need to operate on the one in the store so find it
                                                    // ... and use that instead ...
                                                    var storeRecordIndex = lookupWindow.viewFilters.store.findExact('codePath', record.get('codePath'));
                                                    lookupWindow.filterModelIndex = storeRecordIndex;
                                                    lookupWindow.onLookupComplete = me.onTableLookupComplete;
                                                    lookupWindow.scope = me;
                                                    lookupWindow.show();
                                                }
                                                else {
                                                    // Perform a general lookup ...
                                                    var lookupWindow;
                                                    if (record.get('dataType') === 'time') {
                                                        lookupWindow = EvolveQueryEditor.view.PeriodLookupWindow.Instance;
                                                    } else {
                                                        lookupWindow = EvolveQueryEditor.view.BasicLookupWindow.Instance;
                                                    }
                                                    lookupWindow.single = false;//TODO: single should be caculated accodring by report type and filter himself
                                                    lookupWindow.viewFilters = me.down('#gridFilters');

                                                    // It would appear that the record passed in is a clone from the store ...
                                                    // ... edit operations need to operate on the one in the store so find it
                                                    // ... and use that instead ...
                                                    var storeRecordIndex = lookupWindow.viewFilters.store.findExact('codePath', record.get('codePath'));
                                                    lookupWindow.filterModelIndex = storeRecordIndex;
                                                    if (record.get('superFieldFilter') === true) {
                                                        lookupWindow.onLookupComplete = me.onSuperfieldLookupComplete;
                                                    } else {
                                                        lookupWindow.onLookupComplete = undefined;
                                                    }
                                                    lookupWindow.scope = me;
                                                    lookupWindow.show();
                                                }
                                            },
                                            icon: me.dialogContainer.getResourceUrl('Content/ellipsis.png'),
                                            iconCls: ''
                                        }
                                    ]
                                },
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'from',
                                    text: 'Filter Value From',
                                    flex: 25,
                                    editor:
									{
									    xtype: 'textfield',
									    id: 'qnaTextFieldFilterFrom',
									    x: 120,
									    y: 10,
									    labelWidth: 50
									}
                                },
                                {
                                    xtype: 'actioncolumn',
                                    flex: 1,
                                    items: [
                                        {

                                        }
                                    ]
                                },
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'to',
                                    text: 'Filter Value To',
                                    flex: 25,
                                    editor:
									{
									    xtype: 'textfield',
									    id: 'qnaTextFieldFilterTo',
									    x: 120,
									    y: 10,
									    labelWidth: 50
									}
                                },
                                {
                                    xtype: 'actioncolumn',
                                    flex: 1,
                                    items: [
                                        {

                                        }
                                    ]
                                }
                            ],
                            plugins: [
                                Ext.create('Ext.grid.plugin.CellEditing', {

                                })
                            ]
                        }
                    ]
                },
                {
                    xtype: 'panel',
                    region: 'center',
                    layout: {
                        align: 'stretch',
                        type: 'hbox'
                    },
                    id: 'qnaPanelOutput',
                    title: 'Output',
                    titleCollapse: true,
                    items: [
                        {
                            xtype: 'panel',
                            flex: 1,
                            border: false,
                            minWidth: 340,
                            layout: {
                                type: 'border'
                            },
                            bodyStyle: {
                                background: 'transparent'
                            },
                            frameHeader: false,
                            header: false,
                            title: 'My Panel',
                            items: [
                                {
                                    xtype: 'panel',
                                    region: 'north',
                                    border: false,
                                    height: 41,
                                    layout: {
                                        type: 'absolute'
                                    },
                                    frameHeader: false,
                                    header: false,
                                    title: 'My Panel',
                                    items: [
                                        {
                                            xtype: 'button',
                                            id: 'qnaButtonAddFilter',
                                            x: 20,
                                            y: 10,
                                            text: 'Add Filter'
                                        },
                                        {
                                            xtype: 'textfield',
                                            id: 'qnaTextFieldFind',
                                            x: 120,
                                            y: 10,
                                            fieldLabel: 'Find',
                                            labelWidth: 50
                                        }
                                    ]
                                },
                                {
                                    xtype: 'treepanel',
                                    flex: 1,
                                    margins: '0 10 10 10',
                                    region: 'center',
                                    title: 'Selection List',
                                    lines: true,
                                    useArrows: true,
                                    rootVisible: false,
                                    itemId: 'fieldsTree',
                                    id: 'qnaTreeSelectionList',
                                    listeners: {
                                        beforeitemexpand: { fn: me.expandFieldsCheck, scope: me },
                                        itemdblclick: { fn: me.dblClickField, scope: me }
                                    },
                                    viewConfig: {

                                    }
                                }
                            ]
                        },
                        {
                            xtype: 'panel',
                            border: false,
                            minWidth: 36,
                            width: 36,
                            layout: {
                                type: 'absolute'
                            },
                            bodyStyle: {
                                background: 'transparent'
                            },
                            frameHeader: false,
                            header: false,
                            title: 'My Panel',
                            items: [
                                {
                                    xtype: 'button',
                                    x: 0,
                                    y: 40,
                                    width: 36,
                                    text: '>'
                                },
                                {
                                    xtype: 'button',
                                    x: 0,
                                    y: 70,
                                    width: 36,
                                    text: '>>'
                                },
                                {
                                    xtype: 'button',
                                    x: 0,
                                    y: 170,
                                    margin: '0, 50, 0, 0',
                                    width: 36,
                                    text: '<'
                                },
                                {
                                    xtype: 'button',
                                    x: 0,
                                    y: 200,
                                    width: 36,
                                    text: '<<'
                                }
                            ]
                        },
                        {
                            xtype: 'gridpanel',
                            flex: 1,
                            margin: 10,
                            title: 'Output Columns',
                            itemId: 'qnaGridFields',
                            id: 'qnaGridFields',
                            store: EvolveQueryEditor.model.Query.getOutputFieldsStore(),
							tools: [{
								type: 'gear',
								tooltip: 'Sort',
								handler : function(event, toolEl, panel) {
									me.onPopupSortingWindowClick();
								}
							}],
                            viewConfig: {
                                listeners: {
                                    itemkeydown: {
                                        fn: me.onOutputRowKeyPress,
                                        scope: me
                                    },
                                    itemdblclick: {
                                        fn: me.onOutputRowDblClick,
                                        scope: me
                                    }
                                },
								
								plugins : {
									ptype : 'gridviewdragdrop',
									dragText : 'Reorder Output Fields'
						    	}
                            },
                            columns: [
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'fieldName',
                                    text: 'Field'
                                },
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'extractTypeDesc',
                                    text: 'Extraction Type'
                                },
                                {
                                    xtype: 'gridcolumn',
                                    dataIndex: 'sortOptionDescription',
                                    text: 'Sort Order'
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        me.callParent(arguments);

        //Must load the data to control after control has been inited, which means after calling 'me.callParent(arguments)'
        if (EvolveQueryEditor.model.Query.tableCode.length > 0) {
            me.loadFieldsTree();
        }

        this.dialogContainer.UX.hideLoadingMask();
    },

    onOutputRowKeyPress: function (view, record, item, index, key) {
        if (key.getKey() === Ext.EventObject.DELETE) {
            var store = view.getStore();
            var sm = view.getSelectionModel();
            if (sm.hasSelection()) {
                store.remove(sm.getSelection());
            }
        }
    },

    onSortingComplete: function (sortedStore, scope) {
        var me = scope;
        var grid = me.down('#qnaGridFields');
		var outputFieldsStore = EvolveQueryEditor.model.Query.getOutputFieldsStore();
		
		var index = 0;
		sortedStore.each(function(sortingModel){
			var match = outputFieldsStore.findBy(function(record,id) {
				if(record.get('extractType') === sortingModel.get('extractType') && record.get('codePath') === sortingModel.get('codePath'))
					return true;
				});	
				
			if(match === -1) {
				var codePath = sortingModel.get('codePath');
				var extractType = sortingModel.get('extractType').get('description');
				EvolveQueryEditor.util.QAALogger.error('The outputField [codepath:' + codePath + ', extractionType:' + extractType + '] exists in sorting dialog but doesn\'t exist in report dialog');			
				return; 
			}
			
			var matchedOutputField = outputFieldsStore.getAt(match);
			
			var sortingType = sortingModel.get('sortingType');
			if(sortingType === EvolveQueryEditor.model.SortingTypeModel.None){
				matchedOutputField.clearSorting();
			}
			else
			{
				matchedOutputField.setSorting(sortingType, ++index);
			}
		});
    },

    onPopupSortingWindowClick: function () {
        var store = EvolveQueryEditor.model.Query.getOutputFieldsStore();
		if (store.getCount() == 0) {
			//TODO: popup a dialog or even disable the sorting button when there' no output field added yet
			return;
		}
		
		var nonSortedFields = store.queryBy(function(m, id) {return m.get('sortIndex') === 0});
		var sortedFields = store.queryBy(function(m, id) { return m.get('sortIndex') !== 0});
		sortedFields.sortBy(function(a, b) {return a.get('sortIndex') > b.get('sortIndex')});
		var allfields = sortedFields.getRange().concat(nonSortedFields.getRange());
		
		//TODO: this logic maybe move into a customized proxy 
		var outputFieldSortingStore = Ext.create('Ext.data.Store', {
                model: "EvolveQueryEditor.model.OutputFieldSortingModel",
		});
        allfields.forEach(function(model) {
			var outputFieldSortingModel = EvolveQueryEditor.model.OutputFieldSortingModel.convertFromOuputFieldModel(model);
			outputFieldSortingStore.add(outputFieldSortingModel);
		});
		
        var sortingWindow = Ext.create('EvolveQueryEditor.view.SortingWindow', {
            outputFieldsStore: outputFieldSortingStore,
            onLookupComplete: this.onSortingComplete,
            scope: this
        });

        sortingWindow.show();
    },

	onFilterOptionsComplete : function (filterModelWithOptions, scope) {
		
		
		
	},

	onPopupFilterOptionsWindowClick : function () {
		var filterGrid = this.down('#gridFilters');
		var selectedFilter = null;
		
		var filterOptionsWindow = Ext.create('EvolveQueryEditor.view.FilterOptionsWindow', {
			filterModel: selectedFilter,
			onLookupComplete: this.onFilterOptionsComplete,
			scope: this
		});

        filterOptionsWindow.show();
	},
	
    onOutputRowDblClick: function (dataview, record, item, index, e, eOpts) {
        var extractTypeWindow = Ext.create("EvolveQueryEditor.view.ExtractionTypeWindow",
            {
                record: record,
                usedExtractTypes: this.getUsedExtractTypes(record.get("codePath"))
            });
			
			
		extractTypeWindow.onExtractionTypeWindowSetComplete = function(offset,offsetLength,reverseSign,factorValue,newExtractedType){
            EvolveQueryEditor.util.QAALogger.info("Extration type window closed");			
			
        	record.set("segmentOffset", offset);        
        	record.set("segmentLength",offsetLength);        
        	record.set("reverseSign",reverseSign);       
        	record.set("scalingFactor",factorValue);      
       		record.set("extractType",newExtractedType);
            
			record.set("extractTypeDesc",""); //only for active the column to refresh
			
            dataview.refresh();
            };
        extractTypeWindow.show();
    },

    onSuperfieldLookupComplete: function (scope) {
        var me = scope;
        me.down('#gridFilters').getView().refresh();

        me.clearExistedFiltersAndFields(function (filter) { return filter.get('superFieldFilter') === false; });

        var allSuperFieldsComplete = EvolveQueryEditor.model.Query.isAllSuperFieldFiltersSet();

        if (allSuperFieldsComplete) {
            // We can now add the table filter ...
            var modelTable = Ext.create('EvolveQueryEditor.model.FilterModel', {
                name: 'Table',
                codePath: 'TABLE'
            });

            EvolveQueryEditor.model.Query.getFilterStore().add(modelTable);

        }
    },

    clearExistedFiltersAndFields: function(condition){
        //Remove all existed filters.
        this.clearFilters(condition);

        //Clear selection list.
        this.clearFieldsTree();

        //Clear output fields.
        this.clearOutputFields();
    },

    clearFilters: function(condition){
        var filters = [];
        var filterStore = EvolveQueryEditor.model.Query.getFilterStore();
        for (var i = 0; i < filterStore.count() ; i++) {
            var filter = filterStore.getAt(i);
            if (condition(filter)) {
                filters.push(filter);
            }
        }
        filterStore.remove(filters);
    },

    clearOutputFields: function(){
        EvolveQueryEditor.model.Query.getOutputFieldsStore().removeAll();
    },

    clearFieldsTree: function(){
        var treeFields = this.down('#fieldsTree');
        treeFields.setRootNode([]);
    },

    loadFieldsTree:function(){
        // Load Fields tree ... 
        // TODO should cache it for performance
        me = this;
        var treeFields = me.down('#fieldsTree');
        treeFields.setLoading(true, "Loading Fields hierarchy ...");
        Ext.Ajax.request({
            url: EvolveQueryEditor.model.Query.serverUrlBase + '&method=LookupOutputFields',
            jsonData: {
                clientToken: EvolveQueryEditor.model.Query.clientToken,
                query: {
                    productCode: EvolveQueryEditor.model.Query.getProductCode(),
                    tableCode: EvolveQueryEditor.model.Query.tableCode,
                    mode: EvolveQueryEditor.model.Query.getQueryType(),
                    filters: EvolveQueryEditor.model.Query.getFilters()
                }
            },
            success: function (response) {
                treeFields.setLoading(false);
                var data = Ext.decode(response.responseText);
                treeFields.setRootNode(data.data);
            },
            failure: function (response, options) {
                treeFields.setLoading(false);
                alert(response.statusText);
            }
        });
    },

    onTableLookupComplete: function (scope) {
        var me = scope;
        var grid = me.down('#gridFilters');
        grid.getView().refresh();

        me.clearExistedFiltersAndFields(function (filter) { return filter.get('superFieldFilter') === false && filter.get('codePath') !== "TABLE"; });

        // Load Mandatory Fields ...
        EvolveQueryEditor.view.EvolveProgressDialog.SetProgressText('Retrieving mandatory fields ...');
        EvolveQueryEditor.view.EvolveProgressDialog.show();

        var storeTables = EvolveQueryEditor.model.Query.getMandatoryFiltersStore(function (records) {
            EvolveQueryEditor.view.EvolveProgressDialog.hide();

            for (var rowIndex = 0; rowIndex < records.length; rowIndex++) {
                if (records[rowIndex].get('from') == '') {
                    records[rowIndex].set('from', undefined);  // No default - so make it really no value
                }
                grid.store.add(records[rowIndex]);
            }
        });

        me.loadFieldsTree();

    },

    onComboboxSelect: function (combo, records, eOpts) {
        var rt = records[0];//.copy();
        this.down('#cbProducts').enable();
        var model = EvolveQueryEditor.model.Query;
        model.reportType = rt;

        //Clear output fields.
        this.clearOutputFields();
    },

    onCbProductsSelect: function (combo, records, eOpts) {
        var me = this;
        var rt = records[0];
        var model = EvolveQueryEditor.model.Query;
        model.product = rt;

        me.clearExistedFiltersAndFields(function (filter) { return true; });

        // Load super filters ...
        var grid = this.down('#gridFilters');
        EvolveQueryEditor.view.EvolveProgressDialog.SetProgressText('Retrieving superfields ...');
        EvolveQueryEditor.view.EvolveProgressDialog.show();

        var storeTables = EvolveQueryEditor.model.Query.getSuperFiltersStore(function (records) {
            EvolveQueryEditor.view.EvolveProgressDialog.hide();

            for (var rowIndex = 0; rowIndex < records.length; rowIndex++) {
                if (records[rowIndex].get('from') == '') {
                    records[rowIndex].set('from', undefined);  // No default - so make it really no value
                }
                records[rowIndex].set('superFieldFilter', true);
                grid.store.add(records[rowIndex]);
            }
        });
    },

    getUsedExtractTypes: function (codepath) {
        var usedExtractTypes = [];

        var outputStore = EvolveQueryEditor.model.Query.getOutputFieldsStore();
        Ext.Array.forEach(outputStore.data.items, function (item, index, allItems) {

            if (codepath === item.get("codePath")) {
                usedExtractTypes.push(item.get("extractType"));
            }

        });

        return usedExtractTypes;
    },

    dblClickField: function (view, record, item, index, e, eOpts) {

        var usedExtractTypes = this.getUsedExtractTypes(record.raw.codePath);

        var reportType = EvolveQueryEditor.model.Query.reportType;
        var dataType = EvolveQueryEditor.model.FieldDataTypeModel.find(record.raw.datatype);
        var isFixedLookup = record.raw.lookupCategory === "IS_FIXED_LIST";
        var allExtrationTypes = EvolveQueryEditor.model.ExtractionTypeModel.getAvaliableExtractTypes(isFixedLookup, dataType, reportType, usedExtractTypes);
        
        if (allExtrationTypes.length === 0) {
            alert("cant add more outputfield");
            return;
        }
        
        var nextAvaliableExtractType = allExtrationTypes[0];

        var newOutputField = Ext.create('EvolveQueryEditor.model.OutputFieldModel', {
            codePath: record.raw.codePath,
            dataType: dataType,
            fieldVarType: record.raw.fieldVartype,
            segmentOffset: 1,
            segmentLength: 1,
            scalingFactor: "",
            reverseSign: false,
            extractType: nextAvaliableExtractType,
            fieldName: record.raw.text,
            lookupCategory: record.raw.lookupCategory
        });

        EvolveQueryEditor.model.Query.getOutputFieldsStore().add(newOutputField);
    },

    expandFieldsCheck: function (node, eOpts) {
        if ((node.raw.childrenFetched != undefined) && (node.raw.childrenFetched == false)) {
            var treeFields = eOpts.scope.down('#fieldsTree');
            treeFields.setLoading(true, "Loading Fields hierarchy ...");
            Ext.Ajax.request({
                url: EvolveQueryEditor.model.Query.serverUrlBase + '&method=LookupOutputFields',
                jsonData: {
                    clientToken: EvolveQueryEditor.model.Query.clientToken,
                    codePath: node.raw.codePath,
                    query: {
                        productCode: EvolveQueryEditor.model.Query.getProductCode(),
                        tableCode: EvolveQueryEditor.model.Query.tableCode,
                        mode: EvolveQueryEditor.model.Query.getQueryType(),
                        filters: EvolveQueryEditor.model.Query.getFilters()
                    }
                },
                success: function (response) {
                    treeFields.setLoading(false);

                    // Remove anything currently there - including the placeholder ...
                    node.removeAll();

                    var data = Ext.decode(response.responseText);
                    for (var index = 0; index < data.data.children.length; index++) {
                        var child = data.data.children[index];

                        /*
                        var newNode = Ext.create('Ext.data.TreeModel', {
                            leaf: child.leaf,
                            loaded: false,
                            expandable: (child.leaf == false),
                            text: child.text,
                            childrenFetched: (child.leaf == false) ? child.childrenFetched : true,
                            codePath:child.codePath,
                            datatype:child.datatype,
                            lookupCategory:child.lookupCategory,
                            fieldVartype: child.fieldVartype
                        });
                        */
                        //node.appendChild([newNode], true);
                        var newTreeNode = node.appendChild(
                            {
                                text: child.text, leaf: child.leaf, codePath: child.codePath,
                                loaded: (child.leaf == false) ? false : true,
                                expandable: (child.leaf == false),
                                text: child.text,
                                icon: child.icon,
                                childrenFetched: (child.leaf == false) ? child.childrenFetched : true,
                                datatype: child.datatype,
                                lookupCategory: child.lookupCategory,
                                fieldVartype: child.fieldVartype,
                                children: (child.leaf == false) ? [{ text: ' ' }] : undefined
                            }, true);

                        if (child.leaf == false) {
                            newTreeNode.leaf = child.leaf;
                            newTreeNode.loaded = (child.leaf == false) ? false : true;
                            newTreeNode.expandable = (child.leaf == false);
                            newTreeNode.childrenFetched = (child.leaf == false) ? child.childrenFetched : true;
                            newTreeNode.codePath = child.codePath;
                            newTreeNode.icon = child.icon;
                            newTreeNode.appendChild({ text: ' ' });
                        }
                        /*
                        if ((newNode.raw.childrenFetched != undefined) && (newNode.raw.childrenFetched == false)) {
                            newNode.expandable = true;
                            newNode.leaf = false;

                        }*/
                    }
                    node.raw.childrenFetched = true;
                    node.expand();
                },
                failure: function (response, options) {
                    treeFields.setLoading(false);
                    alert(response.statusText);
                }
            });

            return false;
        }
    },

    setQueryDefinition: function (queryDefinition) {
        try{
            if (queryDefinition !== undefined && queryDefinition.length > 0) {
                var matches = queryDefinition.match(/<Formula>(.+)<\/Formula>/);
                if (matches.length === 2) {
                    return EvolveQueryEditor.model.Query.queryFromFormula(matches[1]);
                } else {
                    EvolveQueryEditor.util.QAALogger.error(Ext.String.format("The given query definition is not correct: {0}", queryDefinition));
                    return false;
                }
            }
        } catch (err) {
            EvolveQueryEditor.util.QAALogger.error(Ext.String.format("The given query definition is not correct: {0}. The error is: {1}", queryDefinition, err.message));
            return false;
        }
    },

    getQueryDefinition: function () {
        return Ext.String.format("<?xml version=\"1.0\" encoding=\"utf-8\"?><PersistentEvolveQuery xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\">  <Bindings />  <Formula>={0}(\"{1}\",)</Formula></PersistentEvolveQuery>", EvolveQueryEditor.model.Query.reportType.toFormula(), EvolveQueryEditor.model.Query.queryToFormula())
    }
});