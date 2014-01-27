/*
 * File: app/view/PeriodLookupWindow.js
 *
 */

Ext.define('EvolveQueryEditor.view.PeriodLookupWindow', {
    extend: 'Ext.window.Window',

    requires: [
        'EvolveQueryEditor.model.Query',
        'EvolveQueryEditor.model.FilterModel',
        'EvolveQueryEditor.model.FilterValueModel',
        'EvolveQueryEditor.model.PeriodTypeModel',
        'EvolveQueryEditor.model.PeriodValueModel',
        'EvolveQueryEditor.util.PeriodUtils',
		'EvolveQueryEditor.util.QAAMsg'
    ],

    height: 350,
    itemId: 'qnaWindowPeriodLookup',
    id: 'qnaWindowPeriodLookup',
    width: 450,
    layout: {
        align: 'stretch',
        type: 'vbox'
    },
    title: 'Period Lookup',
    modal: true,

    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            items: [
                {
                    xtype: 'container',
                    margin:'0 0 10 0',
                    layout:{
                        type:'hbox',                        
                    },
                    items: [
                        {
                            xtype: 'combobox',
                            itemId: 'qnaComboBoxPeriodType',
                            id: 'qnaComboBoxPeriodType',                            
                            width:320,
                            editable: false,
                            displayField: 'Description',
                            valueField: 'Code',
                            listeners: {
                                select: {
                                    fn: me.onPeriodTypeSelect,
                                    scope: me
                                }
                            }
                        }]
                },
                {
                    xtype: 'container',
                    margin:'0 0 10 0',
                    layout:{
                        type:'hbox'
                    },
                    items: [
                    {
                        xtype: 'combobox',
                        itemId: 'qnaComboBoxPeriodFrom',
                        id: 'qnaComboBoxPeriodFrom',
                        fieldLabel: 'From',
                        labelAlign: 'top',
                        width:220,
                        editable: false,
                        displayField: 'DisplayValue',
                        valueField: 'Value',
                        listeners: {
                            select: {
                                fn: me.onPeriodFromSelect,
                                scope: me
                            }
                        }
                    },
                    {
                        xtype: 'container',
                        margin:"0 0 0 10",
                        layout: {
                                type: 'absolute'
                            },
                        items: [                            
                        {
                            xtype: 'textfield',
                            width: 90,
                            x:0,
                            y:0,
                            margin:"15 0 0 0",
                            id: 'qnaTextFieldPeriodOffsetFrom',
                            itemId: 'qnaTextFieldPeriodOffsetFrom',
                            listeners: {
                                'change': function () {
                                    me._onPeriodOffsetFromChange();
                                }
                            }
                        },
                        {
                            xtype: 'textfield',
                            itemId: 'qnaTextFieldPeriodOffset',
                            id: 'qnaTextFieldPeriodOffset',
                            width: 90,
                            x:0,
                            y:0,
                            fieldLabel: 'Period Offset:',
                            labelAlign:'top',
                            labelWidth: 70,
                            listeners: {
                                'change': function () {
                                    me._onPeriodOffsetChange();
                                }
                            }
                        }]
                            
                    }]                        
                },
                {
                    xtype: 'container',
                    margin:'0 0 10 0',
                    layout:{
                        type:'hbox'
                    },
                    items: [
                    {
                        xtype: 'combobox',
                        itemId: 'qnaComboBoxPeriodTo',                        
                        id: 'qnaComboBoxPeriodTo',
                        fieldLabel: 'To',
                        labelAlign: 'top',
                        width:220,
                        editable: false,
                        displayField: 'DisplayValue',
                        valueField: 'Value',
                        listeners: {
                            select: {
                                fn: me.onPeriodToSelect,
                                scope: me
                            }
                        }
                    },
                    {
                        xtype:'container',
                        margin:"0 0 0 10",
                        layout: {
                                type: 'absolute'
                        },
                        items: [
                        {
                            xtype: 'textfield',
                            width: 90,
                            x:0,
                            y:0,
                            margin:"15 0 0 0",                            
                            itemId: 'qnaTextFieldPeriodOffsetTo',
                            id: 'qnaTextFieldPeriodOffsetTo',
                            listeners: {
                                'change': function () {
                                    me._onPeriodOffsetToChange();
                                }
                            }
                        }]                                        
                    }]                                       
                },                
                {
                    xtype: 'container',
                    layout:{
                        type:'hbox'
                    },
                    items: [
                    {
                        xtype: 'textfield',
                        itemId: 'qnaTextFieldOverridePeriod',
                        id: 'qnaTextFieldOverridePeriod',
                        width:220,
                        fieldLabel: 'Current Period Override:',
                        labelAlign: 'top',
                        listeners: {
                            'change': function () {
                                me._onRealValueChange(false, Ext.getCmp('qnaTextFieldOverridePeriod').getValue(), true, me.filterModel.lookupStore);
                            }
                        }
                    }]
                    
                }],
  
             buttonAlign: 'center',   
             buttons:[{                  
                    xtype: 'button',
                    itemId: 'qnaButtonPeriodLookupOk',
                    id: 'qnaButtonPeriodLookupOk',
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
                    itemId: 'qnaButtonPeriodLookupCancel',
                    id: 'qnaButtonPeriodLookupCancel',
                    text: 'Cancel',
                    listeners: {
                        click: {
                            fn: me.onBtnCancel,
                            scope: me
                        }
                    }
                }],                  

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

    onWindowShow: function (component, eOpts) {
        var parent = this;

        parent.filterModel = parent.viewFilters.store.getAt(parent.filterModelIndex);

        if (parent.filterModel.lookupStore === undefined) {
            parent.loadMask.show();
            Ext.Ajax.request({
                url: EvolveQueryEditor.model.Query.serverUrlBase + '&method=LookupFilterValues',
                jsonData: {
                    clientToken: EvolveQueryEditor.model.Query.clientToken,
                    codePath: parent.filterModel.get('codePath'),
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
                    parent.filterModel.lookupStore = data;

                    parent._initData(parent.filterModel, false);
                },
                failure: function (response, options) {
                    parent.loadMask.hide();
                    EvolveQueryEditor.util.QAAMsg.showErrorDialog(response.statusText);
                    parent.loadMask.hide();
                }
            });
        } else {
            parent._initData(parent.filterModel, parent.single);
        }
        
    },

    onBasicLookupWindowBeforeShow: function(component, eOpts) {
        this.loadMask = new Ext.LoadMask(this, {msg:"Please wait..."});

    },
    
    _initData: function (filterModel, _single) {
        var _data = filterModel.lookupStore;

        var periodTypeStore = Ext.create('Ext.data.Store', {
            storeId: 'PeriodTypeStore',
            autoLoad: true,
            data: _data,
            model: "EvolveQueryEditor.model.PeriodTypeModel",
            proxy: {
                type: 'memory',
                reader: {
                    type: 'json',
                    root: 'CalculateTypes'
                }
            }
        });

        var periodValueStore = Ext.create('Ext.data.Store', {
            storeId: 'PeriodValueStore',
            autoLoad: true,
            data: _data,
            model: "EvolveQueryEditor.model.PeriodValueModel",
            proxy: {
                type: 'memory',
                reader: {
                    type: 'json',
                    root: 'Values'
                }
            }
        });

        var currentPeriod = _data.Current.CurrentPeriodValue;
        var allPeriods = _data.Values;
        var _periodInfo = EvolveQueryEditor.util.PeriodUtils.parsePeriodInfo(filterModel.get('from'), filterModel.get('to'), currentPeriod, allPeriods);
        this.periodInfo = _periodInfo;

        var comboBoxPeriodType = Ext.getCmp('qnaComboBoxPeriodType');
        var txtPeriodFromOffset = Ext.getCmp('qnaTextFieldPeriodOffsetFrom');
        var txtPeriodToOffset = Ext.getCmp('qnaTextFieldPeriodOffsetTo');
        var txtPeriodOffset = Ext.getCmp('qnaTextFieldPeriodOffset');
        var cbxPeriodFrom = Ext.getCmp('qnaComboBoxPeriodFrom');
        var cbxPeriodTo = Ext.getCmp('qnaComboBoxPeriodTo');
        var txtCurrentPeriod = Ext.getCmp('qnaTextFieldOverridePeriod');

        cbxPeriodFrom.setDisabled(false);
        cbxPeriodTo.setDisabled(false);
        cbxPeriodTo.setVisible(!_single);

        txtPeriodFromOffset.setVisible(true);
        txtPeriodToOffset.setVisible(true);
        //$.setHidden($("#divPeriod"), false);
        //$.setHidden($("#lblPeriodFrom"), _single);
        //$.setHidden($("#lblPeriodTo"), _single);

        comboBoxPeriodType.store = periodTypeStore;
        comboBoxPeriodType.setValue(_periodInfo.type);
        cbxPeriodFrom.store = periodValueStore;
        cbxPeriodTo.store = periodValueStore;

        this._resetPeriodInfo(_periodInfo, _data, _single);
        this._onRealValueChange(true, txtCurrentPeriod.getValue(), true, _data);
    },

    _resetPeriodInfo: function (_periodInfo, _data, _single) {
        var txtPeriodFromOffset = Ext.getCmp('qnaTextFieldPeriodOffsetFrom');
        var txtPeriodToOffset = Ext.getCmp('qnaTextFieldPeriodOffsetTo');
        var txtPeriodOffset = Ext.getCmp('qnaTextFieldPeriodOffset');
        var cbxPeriodFrom = Ext.getCmp('qnaComboBoxPeriodFrom');
        var cbxPeriodTo = Ext.getCmp('qnaComboBoxPeriodTo');
        var txtCurrentPeriod = Ext.getCmp('qnaTextFieldOverridePeriod');

        var periodType = _periodInfo.type;
        //$("#lblPeriodType").text(periodType);
        cbxPeriodFrom.setDisabled(periodType !== "P");
        cbxPeriodTo.setDisabled(periodType !== "P");
        txtCurrentPeriod.setDisabled(periodType === "P");
        var store = cbxPeriodFrom.store;
        if (periodType === "P") {
            Ext.getCmp('qnaButtonPeriodLookupOk').setDisabled(false);
            if (store.findExact(cbxPeriodFrom.valueField, EvolveQueryEditor.util.PeriodUtils.MIN, 0) !== -1) {
                store.remove(store.findRecord(cbxPeriodFrom.valueField, EvolveQueryEditor.util.PeriodUtils.MIN));
                store.remove(store.findRecord(cbxPeriodFrom.valueField, EvolveQueryEditor.util.PeriodUtils.MAX));
                store.remove(store.findRecord(cbxPeriodFrom.valueField, EvolveQueryEditor.util.PeriodUtils.NA));
            }
        } else {
            if (store.findExact(cbxPeriodFrom.valueField, EvolveQueryEditor.util.PeriodUtils.MIN, 0) === -1) {
                store.add({ DisplayValue: "MIN_DESC", Value: EvolveQueryEditor.util.PeriodUtils.MIN });
                store.add({ DisplayValue: "MAX_DESC", Value: EvolveQueryEditor.util.PeriodUtils.MAX });
                store.add({ DisplayValue: "NOT_VALID", Value: EvolveQueryEditor.util.PeriodUtils.NA });
            }
        }
        var periodData = this._findPeriodType(periodType, _data, _single);
        txtPeriodFromOffset.setVisible(periodData.IsOffSet1Visible);
        txtPeriodToOffset.setVisible((periodData.IsOffSet2Visible && !_single));
        txtPeriodOffset.setVisible(periodData.IsOffSet3Visible && !_single);

        if (_periodInfo.offset1 < 0) {
            //Setting offset1 to be less than 0 is valid while offset2 is 0.
            txtPeriodFromOffset.setValue(_periodInfo.offset1);
            txtPeriodToOffset.setValue(_periodInfo.offset2);
        } else {
            //Setting offset1 to be large than 0 is invalid while offset2 is 0. So we must set offset2 firstly
            txtPeriodToOffset.setValue(_periodInfo.offset2);
            txtPeriodFromOffset.setValue(_periodInfo.offset1);
        }
        txtPeriodOffset.setValue(_periodInfo.offset3);

        this._resetPeriodFromTo(_periodInfo, _data);
    },

    _resetPeriodFromTo: function (_periodInfo, _data) {
        var cbxPeriodFrom = Ext.getCmp('qnaComboBoxPeriodFrom');
        var cbxPeriodTo = Ext.getCmp('qnaComboBoxPeriodTo');

        EvolveQueryEditor.util.PeriodUtils.calculateFromToValue(_periodInfo, _data);
        cbxPeriodFrom.setValue(_periodInfo.fromValue);
        cbxPeriodTo.setValue(_periodInfo.toValue);
    },

    _findPeriodType: function (value, _data) {
        for (var i = 0; i < _data.CalculateTypes.length; i += 1) {
            if (_data.CalculateTypes[i].Code == value) {
                return _data.CalculateTypes[i];
            }
        }
        return null;
    },

    onBtnOk: function (button, e, eOpts) {
        var txtPeriodFromOffset = Ext.getCmp('qnaTextFieldPeriodOffsetFrom');
        var txtPeriodToOffset = Ext.getCmp('qnaTextFieldPeriodOffsetTo');
        var txtPeriodOffset = Ext.getCmp('qnaTextFieldPeriodOffset');
        var cbxPeriodFrom = Ext.getCmp('qnaComboBoxPeriodFrom');
        var cbxPeriodTo = Ext.getCmp('qnaComboBoxPeriodTo');
        var txtCurrentPeriod = Ext.getCmp('qnaTextFieldOverridePeriod');
        var cbxPeriodType = Ext.getCmp('qnaComboBoxPeriodType');

        var fromValue = "";
        var toValue = "";

        var periodType = cbxPeriodType.getValue();

        if (periodType === "P") {
            var fromDisplayValue = cbxPeriodFrom.getRawValue();
            var toDisplayValue = "";
            if (!this.single) {
                toDisplayValue = cbxPeriodTo.getRawValue();
            }

            fromValue = fromDisplayValue;
            toValue = toDisplayValue;
        } else {
            var shortcutValue = periodType;
            var periodData = this._findPeriodType(periodType, this.filterModel.lookupStore);
            if (periodData.IsOffSet1Visible) {
                shortcutValue += " " + this._convertPeriodOffset(txtPeriodFromOffset.getValue());
            }

            if (periodData.IsOffSet2Visible) {
                shortcutValue += " " + this._convertPeriodOffset(txtPeriodToOffset.getValue());
            }

            if (periodData.IsOffSet3Visible) {
                shortcutValue += " " + this._convertPeriodOffset(txtPeriodOffset.getValue());
            }
            var currentPeriod = Ext.util.Format.trim(txtCurrentPeriod.getValue());
            if (currentPeriod !== "") {
                shortcutValue = shortcutValue + " =" + currentPeriod;
            }
            fromValue = shortcutValue;
        }
        
        this.hide();

        this.filterModel.beginEdit();
        this.filterModel.set('hasValue', true);
        this.filterModel.set('from', fromValue);
        this.filterModel.set('to', toValue);
        this.filterModel.endEdit();
    },

    onBtnCancel: function (button, e, eOpts) {
        this.hide();
    },

    onPeriodFromSelect: function (combo, records, eOpts) {
        var cbxPeriodFrom = Ext.getCmp('qnaComboBoxPeriodFrom');
        var cbxPeriodTo = Ext.getCmp('qnaComboBoxPeriodTo');

        if (cbxPeriodFrom.getValue() > cbxPeriodTo.getValue()) {
            cbxPeriodTo.setValue(cbxPeriodFrom.getValue());
        }
    },

    onPeriodToSelect: function (combo, records, eOpts) {
        var cbxPeriodFrom = Ext.getCmp('qnaComboBoxPeriodFrom');
        var cbxPeriodTo = Ext.getCmp('qnaComboBoxPeriodTo');

        if (cbxPeriodFrom.getValue() > cbxPeriodTo.getValue()) {
            cbxPeriodFrom.setValue(cbxPeriodTo.getValue());
        }
    },

    onPeriodTypeSelect: function (combo, records, eOpts) {
        var _data = this.filterModel.lookupStore;
        var txtCurrentPeriod = Ext.getCmp('qnaTextFieldOverridePeriod');

        var overridePeriod = txtCurrentPeriod.getValue();
        var periodType = records[0].get('Code');
        if (periodType === "P") {
            overridePeriod = "";
            txtCurrentPeriod.setValue("");
        }
        var currentPeriod = EvolveQueryEditor.util.PeriodUtils.processPeriod(_data.Current.CurrentPeriodValue);
        this.periodInfo = { "type": periodType, "fromValue": currentPeriod, "toValue": currentPeriod, "offset1": 0, "offset2": 0, "offset3": 0, "currentPeriod": overridePeriod ? overridePeriod : currentPeriod };
        this._resetPeriodInfo(this.periodInfo, _data, this.single);
    },

    _onRealValueChange: function (init, currentPeriodValue, allowEmpty, _data) {
        var txtPeriodFromOffset = Ext.getCmp('qnaTextFieldPeriodOffsetFrom');
        var txtPeriodToOffset = Ext.getCmp('qnaTextFieldPeriodOffsetTo');
        var txtPeriodOffset = Ext.getCmp('qnaTextFieldPeriodOffset');
        var cbxPeriodFrom = Ext.getCmp('qnaComboBoxPeriodFrom');
        var cbxPeriodTo = Ext.getCmp('qnaComboBoxPeriodTo');
        var txtCurrentPeriod = Ext.getCmp('qnaTextFieldOverridePeriod');
        var cbxPeriodType = Ext.getCmp('qnaComboBoxPeriodType');

        if (!init && this._validateCurrentPeriod(currentPeriodValue, allowEmpty, _data)) {
            var currentPeriod = EvolveQueryEditor.util.PeriodUtils.processPeriod(_data.Current.CurrentPeriodValue);
            this.periodInfo = { "type": cbxPeriodType.getValue(), "fromValue": currentPeriod, "toValue": currentPeriod, "offset1": parseInt(txtPeriodFromOffset.getValue()), "offset2": parseInt(txtPeriodToOffset.getValue()), "offset3": parseInt(txtPeriodOffset.getValue()), "currentPeriod": currentPeriodValue ? currentPeriodValue : currentPeriod };
            this._resetPeriodFromTo(this.periodInfo, _data);
        }
    },

    _validateCurrentPeriod : function (value, allowEmpty, _data) {
        var valid = (allowEmpty && value === "") || EvolveQueryEditor.util.PeriodUtils.isSpecifyPeriod(value, _data.Values);
        if (valid) {
            Ext.getCmp('qnaButtonPeriodLookupOk').setDisabled(false);
        } else {
            /*
            if (EvolveQueryEditor.util.PeriodUtils.isPeriodFormat(value)) {
                FieldSetStatusManager.addError(currentPeriodFieldset, QAA_I18N.Workbook.PeriodSelectionDialog.WarningTextOfValueOutOfRange);
            } else {
                FieldSetStatusManager.addError(currentPeriodFieldset, QAA_I18N.Workbook.PeriodSelectionDialog.WarningTextOfIllegalValue);
            }
            */
            Ext.getCmp('qnaButtonPeriodLookupOk').setDisabled(true);
        }
        return valid;
    },

    _convertPeriodOffset : function (value) {
        if (value >= 0) {
            return "+" + value;
        } else {
            return "" + value;
        }
    },

    _onPeriodOffsetFromChange: function () {
        var cbxPeriodFrom = Ext.getCmp('qnaComboBoxPeriodFrom');
        var cbxPeriodTo = Ext.getCmp('qnaComboBoxPeriodTo');
        var _data = this.filterModel.lookupStore;
        var currentPeriod = _data.Current.CurrentPeriodValue;
        var allPeriods = _data.Values;
        var _periodInfo = this.periodInfo;

        var txtPeriodFromOffset = Ext.getCmp('qnaTextFieldPeriodOffsetFrom');
        var txtPeriodToOffset = Ext.getCmp('qnaTextFieldPeriodOffsetTo');

        var currentOffset = parseInt(txtPeriodFromOffset.getValue());
        if (currentOffset > parseInt(txtPeriodToOffset.getValue())) {
            txtPeriodFromOffset.setValue(txtPeriodToOffset.getValue());
            return;
        }
        _periodInfo.offset1 = currentOffset;
        EvolveQueryEditor.util.PeriodUtils.calculateFromToValue(_periodInfo, _data);
        if (EvolveQueryEditor.util.PeriodUtils.isValidPeriod(_periodInfo.fromValue)) {
            cbxPeriodFrom.setValue(_periodInfo.fromValue);
        } else {
            _periodInfo.offset1 = parseInt(txtPeriodToOffset.getValue());
            txtPeriodFromOffset.setValue(_periodInfo.offset1);
        }
    },

    _onPeriodOffsetToChange: function () {
        var cbxPeriodFrom = Ext.getCmp('qnaComboBoxPeriodFrom');
        var cbxPeriodTo = Ext.getCmp('qnaComboBoxPeriodTo');
        var _data = this.filterModel.lookupStore;
        var currentPeriod = _data.Current.CurrentPeriodValue;
        var allPeriods = _data.Values;
        var _periodInfo = this.periodInfo;

        var txtPeriodFromOffset = Ext.getCmp('qnaTextFieldPeriodOffsetFrom');
        var txtPeriodToOffset = Ext.getCmp('qnaTextFieldPeriodOffsetTo');

        var currentOffset = parseInt(txtPeriodToOffset.getValue());
        if (parseInt(txtPeriodFromOffset.getValue()) > currentOffset) {
            txtPeriodToOffset.setValue(txtPeriodFromOffset.getValue());
            return;
        }
        _periodInfo.offset2 = currentOffset;
        EvolveQueryEditor.util.PeriodUtils.calculateFromToValue(_periodInfo, _data);
        if (EvolveQueryEditor.util.PeriodUtils.isValidPeriod(_periodInfo.toValue)) {
            cbxPeriodTo.setValue(_periodInfo.toValue);
        } else {
            _periodInfo.offset2 = parseInt(txtPeriodFromOffset.getValue());
            txtPeriodToOffset.setValue(_periodInfo.offset2);
        }
    },

    _onPeriodOffsetChange: function () {
        var cbxPeriodFrom = Ext.getCmp('qnaComboBoxPeriodFrom');
        var cbxPeriodTo = Ext.getCmp('qnaComboBoxPeriodTo');
        var _data = this.filterModel.lookupStore;
        var currentPeriod = _data.Current.CurrentPeriodValue;
        var allPeriods = _data.Values;
        var _periodInfo = this.periodInfo;

        var txtPeriodOffset = Ext.getCmp('qnaTextFieldPeriodOffset');

        _periodInfo.offset3 = parseInt(txtPeriodOffset.getValue());
        EvolveQueryEditor.util.PeriodUtils.calculateFromToValue(_periodInfo, _data);
        if (EvolveQueryEditor.util.PeriodUtils.isValidPeriod(_periodInfo.toValue)) {
            cbxPeriodTo.setValue( _periodInfo.toValue);
            cbxPeriodFrom.setValue(_periodInfo.fromValue);
        } else {
            _periodInfo.offset3 = 0;
            txtPeriodOffset.setValue(_periodInfo.offset3);
        }
    },
}, function (Cls) {
    Cls.Instance = EvolveQueryEditor.view.PeriodLookupWindow.create();
});