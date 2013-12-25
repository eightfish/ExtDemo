


Ext.define('EvolveQueryEditor.view.ExtractionTypeWindow', {
    extend: 'Ext.window.Window',

    config: {
        record: null,
        usedExtractTypes: null
    },

    requires: [
        'Ext.util.*',
        'Ext.form.*',
        'EvolveQueryEditor.util.QAALogger'
    ],

    modal: true,
    height: 400,
    itemId: 'ExtractionTypeWindow',
    minHeight: 400,
    minWidth: 500,
    width: 500,
    layout: {
        type: 'fit'
    },
    title: 'Extraction Type',

    constructor: function (config) {
        this.callParent(arguments);
        this.initConfig(config);
        return this;
    },


    initComponent: function () {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'container',
                    width: 150,
                    layout: {
                        type: 'border'
                    },
                    items: [
                        {
                            xtype: 'gridpanel',
                            flex: 1,
                            region: 'center',
                            itemId: 'qnaExtractionTypeList',
                            title: '',
                            forceFit: false,
                            hideHeaders: true,
                            rowLines: false,
                            title: 'Operation',
                            store: Ext.create('Ext.data.ArrayStore', {
                                model:"EvolveQueryEditor.model.ExtractionTypeModel"                               
                            }),
                            columns: [
                                {
                                    xtype: 'gridcolumn',
                                    draggable: false,
                                    resizable: false,
                                    dataIndex: 'description',
                                    hideable: false,
                                    text: '',
                                    flex: 1
                                }
                            ],
                            viewConfig: {
                                stripeRows: false
                            }
                           
                            ,
                            listeners: {
                                cellclick: {
                                    fn: me.onqnaExtractionTypeListCellClick,
                                   scope: me
                                }
                            }
                        },
{
    xtype: 'container',
    region: 'east',
    margin: '0 0 0 5',
    width: 150,
    layout: {
        type: 'vbox'
    },
    items: [
        {
            xtype: 'container',
            margin: '0 0 0 15',
            items: [
                {
                    xtype: 'label',
                    text: 'Offset'
                },
                {
                    xtype: 'numberfield',
                    itemId: 'qnaFromOffset',
                    width: 80,
                    value: 1,
                    maxValue: 99,
                    minValue: 1
                },
                {
                    xtype: 'label',
                    text: 'Length'
                },
                {
                    xtype: 'numberfield',
                    itemId: 'qnaSegmentLength',
                    width: 80,
                    value: 1,
                    maxValue: 99,
                    minValue: 1
                }
            ]
        },
        {
            xtype: 'container',
            margins: '',
            margin: '0 0 0 15',
            width: 180,
            items: [
                {
                    xtype: 'checkboxfield',
                    itemId: 'qnaChkReverseSign',
                    fieldLabel: '',
                    boxLabel: 'Reverse Sign'
                },
                {
                    xtype: 'fieldcontainer',
                    height: 120,
                    width: 150,
                    fieldLabel: '',
                    items: [
                        {
                            xtype: 'label',
                            height: 26,
                            text: 'Scaling Factor'
                        },
                        {
                            xtype: 'combobox',
                            height: 20,
                            itemId: 'qnaCbxScalingFactor',
                            margin: '10 0 0 0',
                            width: 130,
                            queryMode: 'local',
                            displayField: 'text',
                            valueField: 'value',
                            store: EvolveQueryEditor.store.ScalingFactorStore.Instance
                        }
                    ]
                }
            ]
        }
    ]
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
                                    margin: '5 5 5 5',
                                    width: 50,
                                    text: 'Ok',
                                    listeners: {
                                        click: {
                                            fn: me.onBtnOk,
                                            scope: me
                                        }
                                    }
                                },
                                {
                                    xtype: 'button',
                                    margin: '5 5 5 5',
                                    width: 50,
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
                    ]
                }
            ],
            listeners: {
                show: {
                    fn: me.onExtractionTypeWindowShow,
                    scope: me
                }
            }
        });

       
        me.callParent(arguments);
    },



    onqnaExtractionTypeListCellClick: function (tableview, td, cellIndex, record, tr, rowIndex, e, eOpts) {

        EvolveQueryEditor.util.QAALogger.info(record.get('name') + ' ' + record.get('description'));
    },

    onBtnOk: function (button, e, eOpts) {

        var offset = this.down('#qnaFromOffset').getValue();
        var offsetLength = this.down('#qnaSegmentLength').getValue();
        var reverseSign = this.down('#qnaChkReverseSign').getValue();
        var factorValue = this.down('#qnaCbxScalingFactor').getValue();        
        var selectExtractedType = this.down("#qnaExtractionTypeList").getSelectionModel().getSelection();
        
        this.onExtractionTypeWindowSetComplete(offset,offsetLength,reverseSign,factorValue,selectExtractedType[0]);
        
        this.close();
    },

    onBtnCancel: function (button, e, eOpts) {
        this.close();
    },

    onExtractionTypeWindowShow: function (component, eOpts) {
        //init data     

        //get all avaliable extract types
        
        var usedExtractTypes = this.getUsedExtractTypes();
        Ext.Array.remove(usedExtractTypes, this.config.record.get("extractType"));
        
        var reportType = EvolveQueryEditor.model.Query.reportType;
        var dataType = this.config.record.get("dataType");
        var isFixedLookup = this.config.record.get("lookupCategory") === "IS_FIXED_LIST";
        var allExtrationTypes = EvolveQueryEditor.model.ExtractionTypeModel.getAvaliableExtractTypes(isFixedLookup, dataType, reportType, usedExtractTypes);
        

        var avaliableExtractTypesStore = this.down("#qnaExtractionTypeList").store;
        Ext.Array.each(allExtrationTypes, function (extractType, index, arrSelf) {
            avaliableExtractTypesStore.add(extractType);
        });
        
        var sm = this.down("#qnaExtractionTypeList").getSelectionModel();
        sm.select(this.config.record.get("extractType"));


        //set segment offset
        this.down("#qnaFromOffset").setValue(this.config.record.get("segmentOffset"));

        //set segment length
        this.down("#qnaSegmentLength").setValue(this.config.record.get("segmentLength"));

        //set reverse sign
        this.down("#qnaChkReverseSign").setValue(this.config.record.get("reverseSign"));

        //set scaling factor
        this.down("#qnaCbxScalingFactor").setValue(this.config.record.get("scalingFactor"));
    }
   
});;