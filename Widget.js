var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", './ReportContent'], function(require, exports, __ReportContent__) {
    var ReportContent = __ReportContent__;

    
    
    
    var aswsPostMessageType;
    (function (aswsPostMessageType) {
        aswsPostMessageType._map = [];
        aswsPostMessageType._map[0] = "init";
        aswsPostMessageType.init = 0;
        aswsPostMessageType._map[1] = "parameterChange";
        aswsPostMessageType.parameterChange = 1;
        aswsPostMessageType._map[2] = "jumpdashboard";
        aswsPostMessageType.jumpdashboard = 2;
        aswsPostMessageType._map[3] = "jumpwidget";
        aswsPostMessageType.jumpwidget = 3;
        aswsPostMessageType._map[4] = "tryTofindDashboard";
        aswsPostMessageType.tryTofindDashboard = 4;
        aswsPostMessageType._map[5] = "notRecognized";
        aswsPostMessageType.notRecognized = 5;
    })(aswsPostMessageType || (aswsPostMessageType = {}));
    var Dashboards = Infor.BI.dashboards;
    var Widget = (function (_super) {
        __extends(Widget, _super);
        function Widget(dashboard, config) {
                _super.call(this, dashboard, config);
            this.dashboard = dashboard;
            this.config = config;
            this.currentlyProcessingParamChange = null;
            this.initialized = false;
        }
        Widget.prototype.init = function (config, params, widgetData) {
            this.dashboard.parametersValuesChanged(params);
            this.config = config;
            this.loadUrl(false);
        };
        Widget.prototype.processSpecificPostMessage = function (receivedJsonData) {
            switch(this.getReceivedMessageDataType(receivedJsonData)) {
                case aswsPostMessageType.parameterChange:
                    this.contentHasChangedParameter(receivedJsonData);
                    break;
                case aswsPostMessageType.init:
                    this.contentHasBeenInitializedForTheFirstTime(receivedJsonData);
                    break;
                case aswsPostMessageType.jumpdashboard:
                    this.jumpToDashboard(receivedJsonData);
                    break;
                case aswsPostMessageType.tryTofindDashboard:
                    this.tryTofindDashboard(receivedJsonData);
                    break;
                case aswsPostMessageType.jumpwidget:
                    this.contentJumpStarted(receivedJsonData);
                    break;
            }
        };
        Widget.prototype.getReceivedMessageDataType = function (detailsJson) {
            this.currentlyProcessingParamChange = null;
            if(detailsJson === null) {
                return aswsPostMessageType.notRecognized;
            } else if(detailsJson.action === "doDashboardJump" && detailsJson.dashboardName != undefined) {
                return aswsPostMessageType.jumpdashboard;
            } else if(detailsJson.action === "tryTofindDashboard" && detailsJson.dashboardName != undefined) {
                return aswsPostMessageType.tryTofindDashboard;
            } else if(this.reportJumpDetected(detailsJson)) {
                return aswsPostMessageType.jumpwidget;
            } else if(this.initialized === false) {
                return aswsPostMessageType.init;
            } else if(detailsJson.action === "EngineInfo") {
                return aswsPostMessageType.parameterChange;
            } else {
                this.dashboard.warn('Post message is not for dashboard app.');
                return aswsPostMessageType.notRecognized;
            }
        };
        Widget.prototype.reportJumpDetected = function (details) {
            return details.ReportName !== undefined && details.ReportName !== this.config.reportUniqueName && !details.errorMessage;
        };
        Widget.prototype.contentHasBeenInitializedForTheFirstTime = function (detailsJson) {
            var detailsJsonConverted = this.convertToWidgetChanges(detailsJson), cfg = this.config;
            this.initialized = true;
            this.processWidgetChange(detailsJsonConverted);
            if(cfg.immediateInteraction === true) {
                this.depleteImmediateInteraction();
            }
        };
        Widget.prototype.contentHasChangedParameter = function (detailsJson) {
            var detailsJsonConverted = this.convertToWidgetChanges(detailsJson);
            this.processWidgetChange(detailsJsonConverted);
        };
        Widget.prototype.jumpToDashboard = function (detailsJson) {
            this.dashboard.processDashboardJump(detailsJson.dashboardName, this.informContentAboutDashboardJumpResult);
        };
        Widget.prototype.tryTofindDashboard = function (details) {
            var dashboardName = details.dashboardName;
            this.dashboard.canJumpToDashboard(dashboardName, this.informContentAboutTryTofindDashboardResult);
        };
        Widget.prototype.informContentAboutTryTofindDashboardResult = function (canJump, dashboardName) {
            var report = this.getMainIFrame().contentWindow;
            report.OnFindDashboardJumpTarget(canJump, dashboardName);
        };
        Widget.prototype.contentJumpStarted = function (detailsJson) {
            var widgetWantsJumpToDashboard = this.config.jumpTarget === 0, me = this;
            if(widgetWantsJumpToDashboard) {
                me.dashboard.openInFullscreen(false, function (cancelled) {
                    if(!cancelled) {
                        me.processWidgetChange(me.convertToWidgetChanges(detailsJson));
                    }
                });
            } else {
                me.processWidgetChange(me.convertToWidgetChanges(detailsJson));
            }
        };
        Widget.prototype.informContentAboutDashboardJumpResult = function (result, dashboardName) {
            var report = this.getMainIFrame().contentWindow;
        };
        Widget.prototype.parametersValuesChanging = function (params, canCancel, approvalCallback) {
            if(this.isPreparedForParameterChange()) {
                approvalCallback.call(this, true);
            } else {
                this.callFunctionLater(this.parametersValuesChanging, arguments);
            }
        };
        Widget.prototype.parametersValuesChangeConfirmation = function (confirmed, params) {
        };
        Widget.prototype.callFunctionLater = function (fcn, args) {
            var me = this;
            window.setTimeout(function () {
                fcn.apply(me, args);
            }, 250);
        };
        Widget.prototype.setParametersValues = function (parameterChanges) {
            var messageParam = [], param;
            for(var paramIndex = parameterChanges.length - 1; paramIndex >= 0; paramIndex--) {
                param = parameterChanges[paramIndex];
                messageParam.push({
                    Name: param.name,
                    Value: param.value
                });
            }
            if(messageParam.length > 0) {
                if(this.currentlyProcessingParamChange != null && Dashboards.utils.areObjectsEqual(messageParam, this.currentlyProcessingParamChange)) {
                    return;
                }
                if(this.isPreparedForParameterChange()) {
                    this.currentlyProcessingParamChange = messageParam;
                    (this.getMainIFrame().contentWindow).SetReportParameters(messageParam);
                } else {
                    this.setParametersValuesRepeater(parameterChanges);
                }
            }
        };
        Widget.prototype.setParametersValuesRepeater = function (parameterChanges) {
            var me = this;
            window.setTimeout(function () {
                me.setParametersValues.call(me, parameterChanges);
            }, 250);
        };
        Widget.prototype.createParameterObject = function (detailsJson) {
            var params = [], index, item;
            if(detailsJson !== null && detailsJson.ReportParameters instanceof Array) {
                for(index = detailsJson.ReportParameters.length - 1; index >= 0; index--) {
                    item = detailsJson.ReportParameters[index];
                    if(!item.Fixed) {
                        params.push({
                            name: item.Name,
                            value: item.Value,
                            passive: false,
                            caption: item.Caption,
                            custom: {
                                lookupName: item.LookupName,
                                type: item.Type
                            }
                        });
                    }
                }
            }
            return params;
        };
        Widget.prototype.isPreparedForParameterChange = function () {
            var iframe = this.getMainIFrame();
            try  {
                return (iframe.contentWindow).checkRedirectState() === "RedirectState:ready" && this.currentlyProcessingParamChange == null;
            } catch (Err) {
                return false;
            }
        };
        Widget.prototype.processWidgetChange = function (widgetChanges) {
            var cfg = this.config;
            if(this.didConfigChange(cfg, widgetChanges)) {
                this.changeModelConfig(widgetChanges);
            } else {
                this.dashboard.parametersValuesChanged(widgetChanges.parameters);
            }
        };
        Widget.prototype.depleteImmediateInteraction = function () {
            var cfg = this.config;
            if(cfg.immediateInteraction == null) {
                this.dashboard.warn("Widget configuration problem - missing immediateInteraction in original configuration");
            }
            cfg.immediateInteraction = false;
            this.dashboard.askForInteractionMode();
            this.dashboard.notifyAboutWidgetChange(null, this.config);
        };
        Widget.prototype.getNewJumpTarget = function (newReportJumpBehavior, oldJumpTarget) {
            switch(newReportJumpBehavior) {
                case 0:
                    return oldJumpTarget;
                case 1:
                    return 0;
                case 2:
                    return 1;
            }
            return oldJumpTarget;
        };
        Widget.prototype.jumpBehaviorChange = function (config, newReportJumpBehavior) {
            var newJumpTarget = this.getNewJumpTarget(newReportJumpBehavior, config.jumpTarget);
            return config.reportJumpBehavior != newReportJumpBehavior || config.jumpTarget != newJumpTarget;
        };
        Widget.prototype.ParametersChange = function (config, newFixedReportParameters) {
            return !Dashboards.utils.areObjectsEqual(config.fixedReportParameters, newFixedReportParameters);
        };
        Widget.prototype.didConfigChange = function (config, widgetChange) {
            var changed = false;
            if(widgetChange.reportUniqueName !== null) {
                changed = changed || widgetChange.reportUniqueName != config.reportUniqueName;
            }
            if(widgetChange.fixedReportParameters !== null) {
                changed = changed || this.ParametersChange(config, widgetChange.fixedReportParameters);
            }
            if(widgetChange.reportJumpBehavior !== null) {
                changed = changed || this.jumpBehaviorChange(config, widgetChange.reportJumpBehavior);
            }
            return changed;
        };
        Widget.prototype.changeModelConfig = function (widgetChanges) {
            var cfg = this.config;
            if(this.config.reportUniqueName == null) {
                this.dashboard.warn("Widget configuration problem - missing unique name in original configuration");
            }
            if(widgetChanges.reportUniqueName !== null) {
                this.config.reportUniqueName = widgetChanges.reportUniqueName;
            }
            if(widgetChanges.fixedReportParameters !== null) {
                cfg.fixedReportParameters = widgetChanges.fixedReportParameters;
            }
            if(widgetChanges.reportJumpBehavior !== null) {
                this.alterJumpTarget(cfg, widgetChanges.reportJumpBehavior);
            }
            this.dashboard.notifyAboutWidgetChange(widgetChanges.parameters, cfg);
        };
        Widget.prototype.setConfig = function (data, changedProperty) {
            if(changedProperty === 'jumpTarget') {
                var jumpTarget = parseInt(data[changedProperty]);
                this.config[changedProperty] = jumpTarget;
                data[changedProperty] = jumpTarget;
            } else {
                this.dashboard.warn(Dashboards.utils.String.format('Method [ASWS.]Plugin.setConfig: unexpected parameter: {0}.', [
                    changedProperty
                ]));
            }
            return data;
        };
        Widget.prototype.getSingleItem = function (items, itemValue) {
            var result = [];
            for(var i = 0; i < items.length; i++) {
                if(items[i].key === itemValue) {
                    result.push(items[i]);
                }
            }
            return result;
        };
        Widget.prototype.getDropDownData = function (dataSourceId, items) {
            if(dataSourceId === 'jumpTarget') {
                switch(this.config.reportJumpBehavior) {
                    case 0:
                        return items;
                    case 1:
                        return this.getSingleItem(items, '0');
                    case 2:
                        return this.getSingleItem(items, '1');
                }
            }
            return items;
        };
        Widget.prototype.convertToWidgetChanges = function (original) {
            try  {
                return {
                    reportUniqueName: original.ReportName,
                    reportJumpBehavior: original.JumpBehavior,
                    parameters: this.createParameterObject(original),
                    fixedReportParameters: this.getFixedReportParameters(original)
                };
            } catch (Err) {
                this.dashboard.warn('Param changes conversion failed');
                return null;
            }
        };
        Widget.prototype.getFixedReportParameters = function (detailsJson) {
            var params = [], index, item, reportParameters;
            if(detailsJson !== null && detailsJson.ReportParameters instanceof Array) {
                reportParameters = detailsJson.ReportParameters;
                for(index = reportParameters.length - 1; index >= 0; index--) {
                    item = reportParameters[index];
                    if(item.Fixed) {
                        params.push({
                            Name: item.Name,
                            Value: item.Value
                        });
                    }
                }
            }
            return params;
        };
        Widget.prototype.alterJumpTarget = function (config, newReportJumpBehavior) {
            config.reportJumpBehavior = newReportJumpBehavior;
            config.jumpTarget = this.getNewJumpTarget(newReportJumpBehavior, config.jumpTarget);
        };
        Widget.prototype.widgetDataChanged = function (widgetData, modified) {
        };
        Widget.prototype.refreshContent = function () {
            _super.prototype.refreshContent.call(this);
            this.currentlyProcessingParamChange = null;
        };
        return Widget;
    })(ReportContent.ReportContent);
    exports.Widget = Widget;    
})
