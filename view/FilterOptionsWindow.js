Ext.define('EvolveQueryEditor.view.FilterOptionsWindow', {
    extend: 'Ext.window.Window',
    title: 'Filter Options Window',
    layout: 'fit',
    autoshow: true,
    modal: true,
    minHeight: 600,
    Height: 600,
    minWidth: 500,
    width: 500,
    id: 'qnaWindowFilterOptions',
    
    requires: [
    'Ext.util.*',
    'Ext.form.*',
    'EvolveQueryEditor.util.QAALogger',
    'EvolveQueryEditor.model.FilterModel'
    ],
    
    config: {
        filterModel: null,
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
         Ext.applyIf(me, {
             items: [{
                    xtype: 'form',
				    width: 450,
                    items: [{
                        xtype: 'panel',
                        layout: 'column',
                        items:[
                            {
                                //From and To panel    
                                xtype: 'panel',
                                layout: 'form',
                                border: false,
                                items: [{
                                    xtype: 'label',
                                    id: 'qnaLabelFilterFrom',
									labelWidth: 50,
                                	labelAlign: 'right',
                                    text: 'Filter From'    
                                },{
                                    xtype: 'textfield',
                                    id: 'qnaTextFieldFilterFrom',
                                    width: '180'    
                                }]
                            }
//                             ,{
                                
//                                 //panel comparison operator    
//                             }
                        ],
                    }],
                    buttonAlign: 'center',
				    buttons: [
						{
						    text: 'OK',
						    scope: me,
							id: 'qnaButtonOK',
							itemId: 'qnaButtonOK',
						    handler: function () {
						        me.onLookupComplete(me.filterModel, me.scope);
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
				    ]}
             ]
         });
         
        me.callParent(arguments);
    }
});