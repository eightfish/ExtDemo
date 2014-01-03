Ext.define('EvolveQueryEditor.view.FilterOptionsWindow', {
    extend: 'Ext.window.Window',
    title: 'Filter Options Window',
    layout: 'fit',
    autoshow: true,
    modal: true,
    minHeight: 500,
    Height: 500,
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
                                xtype: 'panel',
                                layout: 'form',
                                border: false,
                                items: [{
                                    fieldLabel: 'Filter From',
									xtype: 'textfield',
                                    id: 'qnaFilterFrom',
                                	labelAlign: 'right',
									anchor: '80%'
                                },{
                                    fieldLabel: 'Filter To',
									xtype: 'textfield',
                                    id: 'qnaFilterTo',
                                	labelAlign: 'right',
									anchor: '80%'
                                }]
                            },{   
								xtype: 'fieldset',
								id: 'qnaFieldsetComparisonOperator',
								title: 'Comparison Operator',
								autoHeight: true,
								bodyPadding: 5,
								defaultType: 'radio',
								layout: 'vbox',
								items:[
									{ boxLabel: 'None', name: 'qnaRadioButtonComparisonOperator', inputValue: '1', checked: true},
									{ boxLabel: 'Display all values', name: 'qnaRadioButtonComparisonOperator', inputValue: '2' },
									{ boxLabel: 'Is greater than', name: 'qnaRadioButtonComparisonOperator', inputValue: '3' },
									{ boxLabel: 'Is greater than or equal to', name: 'qnaRadioButtonComparisonOperator', inputValue: '4' },
									{ boxLabel: 'Is less than', name: 'qnaRadioButtonComparisonOperator', inputValue: '5' },
									{ boxLabel: 'Is less than or equal to', name: 'qnaRadioButtonComparisonOperator', inputValue: '6' },
									{ boxLabel: 'Is not equal to', name: 'qnaRadioButtonComparisonOperator', inputValue: '7' },
									{ boxLabel: 'Is null', name: 'qnaRadioButtonComparisonOperator', inputValue: '8' },
									{ boxLabel: 'Not null', name: 'qnaRadioButtonComparisonOperator', inputValue: '9' }
								]
							}]
                            }],
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
				    ]});
         
        me.callParent(arguments);
    }
});