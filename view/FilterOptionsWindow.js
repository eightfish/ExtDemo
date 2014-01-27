Ext.define('EvolveQueryEditor.view.FilterOptionsWindow', {
    extend: 'Ext.window.Window',
    title: 'Filter Options',
    layout: 'fit',
    autoshow: true,
    modal: true,
    minHeight: 550,
    Height: 550,
    minWidth: 580,
    width: 580,
    id: 'qnaWindowFilterOptions',
    
    requires: [
		'Ext.util.*',
		'Ext.form.*',
		'EvolveQueryEditor.util.QAALogger',
		'EvolveQueryEditor.model.FilterOptionsModel'
    ],
    
    config: {
        filterOptionsModel: null,
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
					bodyPadding: 10,
                    items: [{
                        xtype: 'panel',
                        layout: 'form',
                        items:[
                            {
                                xtype: 'panel',
                                layout: 'anchor',
                                border: false,
                                items: [{
                                    fieldLabel: 'Filter From',
									xtype: 'textfield',
                                    id: 'qnaFilterOptionsTextFieldFilterFrom',
                                	labelAlign: 'right',
									anchor: '80%',
									disabled: !me.filterOptionsModel.isFilterFromNeeded(),
									value: me.filterOptionsModel.get('from')
                                },{
                                    fieldLabel: 'Filter To',
									xtype: 'textfield',
                                    id: 'qnaFilterOptionsTextFieldFilterTo',
									disabled: !me.filterOptionsModel.isFilterToNeeded(),
                                	labelAlign: 'right',
									value: me.filterOptionsModel.get('to'),
									anchor: '80%'
                                }]
                            },
							{
								xtype: 'panel',
								layout: 'column',
								items: [
									{
										xtype: 'fieldset',
										id: 'qnaFieldsetComparisonOperator',
										title: 'Comparison Operator',
										autoHeight: true,
										style:'margin:10px', 
										defaultType: 'radio',
										layout: 'vbox',
										disabled: !me.filterOptionsModel.get('mode').isDefaultMode(),
										items: me._getAvailableOperators()
									}, {
										xtype: 'panel',
										layout: 'anchor',
										items:[
											{
												xtype: 'fieldcontainer',
												defaultType: 'checkboxfield',
												style:'margin:10px',
												disabled: !(me.filterOptionsModel.isValueNeededInDefaultMode()),
												items: [{
													boxLabel: 'Case Insensitive',
													name: 'chkboxCaseInsensitive',
													inputValue: 'true',
													id: 'qnaChkboxCaseInsensitive',
													checked: me.filterOptionsModel.get('caseInsensitive')
												}]
											}, {
												xtype: 'fieldset',
												id: 'qnaFieldsetSegment',
												title: 'Segment',
												style:'margin:10px', 
												autoHeight: true,
												width: 280,
												layout: 'vbox',
												checkboxToggle: true,
												checkboxName: 'qnaChkboxToggleSegment',
												collapsed: !me.filterOptionsModel.get('segment'),
												disabled: !(me.filterOptionsModel.isValueNeededInDefaultMode()),
												items:[{
													xtype: 'numberfield',
													anchor: '50%',
													name: 'offset',
													fieldLabel: 'Offset',
													id: 'qnaNumberFieldOffset',
													value: me.filterOptionsModel.get('segmentOffset'),
													allowDecimals: false,
													minValue: 1,
													maxValue: 99
												},{
													xtype: 'numberfield',
													anchor: '50%',
													name: 'Length',
													fieldLabel: 'Length',
													id: 'qnaNumberFieldLength',
													value: me.filterOptionsModel.get('segmentLength'),
													allowDecimals: false,
													minValue: 1,
													maxValue: 99
												}]
											},{
												xtype: 'fieldset',
												id: 'qnaFieldsetFilterOptionsMode',
												title: 'Mode',
												style:'margin:10px', 
												autoHeight: true,
												defaultType: 'radio',
												layout: 'vbox',
												items: me._getFilterModes()
											}
										]
									}]
							}]
                            }]
                    }],
                    buttonAlign: 'center',
				    buttons: [
						{
						    text: 'OK',
						    scope: me,
							id: 'qnaButtonFilterOptionsOK',
							itemId: 'qnaButtonFilterOptionsOK',
						    handler: function () {
						        me._fillIntoFilterOptionsModel();
						        me.close();
						    }
						},
						{
						    text: 'Cancel',
							id: 'qnaButtonFilterOptionsCancel',
							itemId: 'qnaButtonFilterOptionsCancel',
						    scope: me,
						    handler: me.close
						}
				    ]
				});
         
        me.callParent(arguments);
    },
	
	_getAvailableOperators: function() {
		var isRange = this.filterOptionsModel.isRange();
		var isString = this.filterOptionsModel.isString();
		var availableOperators = EvolveQueryEditor.model.ComparisonOperatorModel.getAvailableOperators(isRange, isString);
		var operator = this.filterOptionsModel.get('operator');
		var me = this;
		
		var itemsInGroup = [];
		availableOperators.forEach(function(op, index) {
  			itemsInGroup.push({
      			boxLabel: op.get('name'), 
      			name: 'qnaRadioButtonComparisonOperator', 
      			inputValue: op,
				checked: (operator === op),
				listeners: {'change': function(field, newValue, oldValue, eOpts) {
					if(newValue) {
						var operatorModel = field.inputValue;
						me.filterOptionsModel.set('operator', operatorModel);
						
						me._setFilterFromAndFilterToEnable();
						me._setCaseInsensitiveEnable();
						me._setSegmentPartEnable();						
					}
				}}
  			});
		});
		
		return itemsInGroup;
	},
	
	 _getFilterModes: function() {
		var itemsInGroup = [];
		var filterModes = EvolveQueryEditor.model.FilterModeModel.getAllFilterModes();
		var mode = this.filterOptionsModel.get('mode');
		var me = this;		

		filterModes.forEach(function(op,index) {
			itemsInGroup.push({
				boxLabel: op.get('name'), 
				name: 'qnaRadioButtonFilterMode', 
				inputValue: op,
				checked: (mode === op),
				listeners: {'change': function(field, newValue, oldValue, eOpts) {
					if(newValue) {
						var filterModeModel = field.inputValue;
						me.filterOptionsModel.set('mode', filterModeModel);
						
						me._setFilterFromAndFilterToEnable();
						me._setComparisonOperatorEnable();
						me._setCaseInsensitiveEnable();
						me._setSegmentPartEnable();	
					}
				}}
			});
		});
  
  		return itemsInGroup;
 	},
	
	_setFilterFromEnable : function() {
		var disabled = !this.filterOptionsModel.isFilterFromNeeded();
		
		var textfieldFilterFrom = this.down('#qnaFilterOptionsTextFieldFilterFrom');
		textfieldFilterFrom.setDisabled(disabled);		
	},
	
	_setFilterToEnable : function() {
		var disabled = !this.filterOptionsModel.isFilterToNeeded();
		
		var textfieldFilterTo = this.down('#qnaFilterOptionsTextFieldFilterTo');
		textfieldFilterTo.setDisabled(disabled);
	},
	
	_setFilterFromAndFilterToEnable : function() {
		this._setFilterFromEnable();
		this._setFilterToEnable();
	},
	
	_setComparisonOperatorEnable : function() {
		var disabled = !this.filterOptionsModel.get('mode').isDefaultMode();
		
		var fieldsetComparisonOperator = this.down('#qnaFieldsetComparisonOperator');
		fieldsetComparisonOperator.setDisabled(disabled);
	},
	
	_setSegmentPartEnable : function() {
		var disabled = !(this.filterOptionsModel.isValueNeededInDefaultMode());
		
		var fieldsetSegment = this.down('#qnaFieldsetSegment');
		fieldsetSegment.setDisabled(disabled);
	},
	
	_setCaseInsensitiveEnable : function() {
		var disabled = !(this.filterOptionsModel.isValueNeededInDefaultMode());
					
		var chkboxCaseInsensitive = this.down('#qnaChkboxCaseInsensitive');
		chkboxCaseInsensitive.setDisabled(disabled); 	
	},
	
	_fillIntoFilterOptionsModel: function() {
		this._setFilterFromAndFilterToIntoModel();
		
		this._setComparisonOperatorIntoModel();

		this._setCaseInsensitiveIntoModel();
		
		this._setFilterModeIntoModel();
		
		this._setSegmentPartIntoModel();
		
		this.filterOptionsModel.save();
	},

	_getInputValueOfCheckedRadio : function(fieldsetId) {
		var fieldset = this.down(fieldsetId);
		var inputValue = null;
	  
		var radioGroup = fieldset.items.items;
		for(var i = 0; i < radioGroup.length; i++) {	 
		   if(radioGroup[i].checked) {
				inputValue = radioGroup[i].inputValue;
				break;
		   }
	  	}
	  
	  	return inputValue;
 	},

	_getCheckedFilterMode : function() {
		return this._getInputValueOfCheckedRadio('#qnaFieldsetFilterOptionsMode');
 	},
	
	_getCheckedOperator : function() {
		return this._getInputValueOfCheckedRadio('#qnaFieldsetComparisonOperator');
 	},
	
	_setFilterFromAndFilterToIntoModel : function () {
		var textfieldFilterFrom = this.down('#qnaFilterOptionsTextFieldFilterFrom');
		this.filterOptionsModel.set('from',textfieldFilterFrom.value);
		
		var textfieldFilterTo = this.down('#qnaFilterOptionsTextFieldFilterTo');
		this.filterOptionsModel.set('to',textfieldFilterTo.value);		
	},
	
	_setComparisonOperatorIntoModel : function () {
		var operator = this._getCheckedOperator();
		
		if(!Ext.isEmpty(operator)) {
			this.filterOptionsModel.set('operator', operator);
		}
	},
	
	_setCaseInsensitiveIntoModel : function() {
		var chkboxCaseInsensitive = this.down('#qnaChkboxCaseInsensitive');
		
		var caseInsensentive = chkboxCaseInsensitive === undefined? false : chkboxCaseInsensitive.checked;
		this.filterOptionsModel.set('caseInsensitive', caseInsensentive);  		
	},
	
	_setSegmentPartIntoModel : function () {
		var fieldsetSegment = this.down('#qnaFieldsetSegment');
		
		if(fieldsetSegment === undefined || fieldsetSegment.collapsed) {
			this.filterOptionsModel.clearSegment();
		}
		else {
			var numberfieldSegmentOffset = this.down('#qnaNumberFieldOffset');
			var numberfieldSegmentLength = this.down('#qnaNumberFieldLength');
			this.filterOptionsModel.setSegment(numberfieldSegmentOffset.value, numberfieldSegmentLength.value);
		}		
	},
	
	_setFilterModeIntoModel : function () {
		var mode = this._getCheckedFilterMode();

		if(!Ext.isEmpty(mode)) {
			this.filterOptionsModel.set('mode', mode);
		}
	}
});