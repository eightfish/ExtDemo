/// <reference path='../../Infor.BI.WebFramework.Web/Scripts/Infor.d.ts'/>

import ReportContent = module('./ReportContent');

declare class Parameter {
    Name: string;
    Value: string;
}

declare class WidgetChanges {
    parameters: any[];
    fixedReportParameters: Parameter[];
    reportUniqueName: string;
    reportJumpBehavior: number;
}

declare class ASWSWidgetConfiguration extends ReportContent.ASWSReportConfiguration {
    public fixedReportParameters: Parameter[];
    public immediateInteraction: bool;
}

enum aswsPostMessageType {
    init,
    parameterChange,
    jumpdashboard,
    jumpwidget,
    tryTofindDashboard,
    notRecognized
}

var Dashboards = Infor.BI.dashboards;

export class Widget extends ReportContent.ReportContent implements Infor.BI.dashboards.IWidget {
    private currentlyProcessingParamChange: Parameter[] = null;
    private initialized: bool = false;

    //private unfeasibleParamChanges: IWidgetParameter[] = null;
    //private unfeasibleParamChangesTimerId = null;

    constructor(public dashboard: Infor.BI.dashboards.IDashboard, public config: ReportContent.ASWSReportConfiguration) {
        super(dashboard, config);
    }

    init(config: Infor.BI.dashboards.IWidgetConfiguration, params: Infor.BI.dashboards.IWidgetParameter[], widgetData?: Infor.BI.dashboards.IWidgetData): void{
        //this.dashboard.hideLoadingMask();

        this.dashboard.parametersValuesChanged(params);

        this.config = <ASWSWidgetConfiguration>config;
        this.loadUrl(false);
    }

    processSpecificPostMessage(receivedJsonData: any) {
        switch (this.getReceivedMessageDataType(receivedJsonData)) {
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
    }

    /**
     * Select message type.
     *
     * @private
     */
    private getReceivedMessageDataType(detailsJson: any): aswsPostMessageType {
        this.currentlyProcessingParamChange = null;

        if (detailsJson === null) {
            return aswsPostMessageType.notRecognized;
        } else if (detailsJson.action === "doDashboardJump" && detailsJson.dashboardName != undefined) {
            return aswsPostMessageType.jumpdashboard;
        } else if (detailsJson.action === "tryTofindDashboard" && detailsJson.dashboardName != undefined) {
            return aswsPostMessageType.tryTofindDashboard;
        } else if (this.reportJumpDetected(detailsJson)) {
            return aswsPostMessageType.jumpwidget;
        } else if (this.initialized === false) {
            return aswsPostMessageType.init;
        } else if (detailsJson.action === "EngineInfo") {
            return aswsPostMessageType.parameterChange;
        } else {
            this.dashboard.warn('Post message is not for dashboard app.');
            return aswsPostMessageType.notRecognized;
        }
    }

    /*
     * @private
     */
    private reportJumpDetected(details: { ReportName?: string; errorMessage?: string; }) {
        return details.ReportName !== undefined && details.ReportName !== this.config.reportUniqueName && !details.errorMessage;
    }

    /*
     * The widget content has been loaded.
     * @private
     */
    private contentHasBeenInitializedForTheFirstTime(detailsJson: any){
        var detailsJsonConverted: WidgetChanges = this.convertToWidgetChanges(detailsJson),
            cfg = <ASWSWidgetConfiguration>this.config;

        this.initialized = true;
        this.processWidgetChange(detailsJsonConverted);

        if (cfg.immediateInteraction === true) {
            this.depleteImmediateInteraction();
        }
    }
     
    /*
     * Widget content has changed parameter.
     * @private
     */
    private contentHasChangedParameter(detailsJson: any){
        var detailsJsonConverted: WidgetChanges = this.convertToWidgetChanges(detailsJson);
        this.processWidgetChange(detailsJsonConverted);
    }

    /**
     * @private
     */
    private jumpToDashboard(detailsJson: any) {
        // Test: Jump to existing dashboard
        // Dashboard name not name!
        // detailsJson.dashboardName = 'EmptyDashboard';
        // detailsJson.dashboardId = 'c2a904d9-29bd-44d6-829f-3423d2862188';
        // End Test
        this.dashboard.processDashboardJump(detailsJson.dashboardName, this.informContentAboutDashboardJumpResult);
    }

    tryTofindDashboard(details: { dashboardName: string; }) {
        // Test: Find dashboard
        // details.dashboardName = "EmptyDashboard";
        // End Test

        var dashboardName = details.dashboardName;
        this.dashboard.canJumpToDashboard(dashboardName, this.informContentAboutTryTofindDashboardResult);
        //(<any>this.getMainIFrame().contentWindow).OnFindDasboardJumpTarget(this.dashboard.existDashboard(dashboardName), dashboardName);
    }

    private informContentAboutTryTofindDashboardResult(canJump: bool, dashboardName: string): void {
        var report = <any>this.getMainIFrame().contentWindow;

        report.OnFindDashboardJumpTarget(canJump, dashboardName);
    }

    /**
     * Widget wants to execute jump.
     * @private
     */
    private contentJumpStarted(detailsJson: any) {
        var widgetWantsJumpToDashboard = this.config.jumpTarget === 0,
            me = this;

        if (widgetWantsJumpToDashboard) {
            me.dashboard.openInFullscreen(false, function (cancelled: bool) {
                if (!cancelled) {
                    // save widget in session (necessary for new dashboard params 
                    // and it is "forget" in source dashboard, because it is already left)
                    me.processWidgetChange(me.convertToWidgetChanges(detailsJson));
                }
            });
        } else {
            me.processWidgetChange(me.convertToWidgetChanges(detailsJson));
        }
    }
    
    private informContentAboutDashboardJumpResult(result: bool, dashboardName: string): void {
        var report = <any>this.getMainIFrame().contentWindow;
        // this.dashboard.info("informContentAboutDashboardJumpResult: " + result + "-" + dashboardName);
        // TODO: content method
        // report.OnDashboardJumpTarget(result, dashboardName);
    }

    /**
     * Parameter value in a connected widget has been changed - check if the value can be change also in this widget.
     * @param params Array of required parameters modifications {name, value}[].
     * @param canCancel Information if the source widget can discard the change.
     * @param approvalCallback If it is called after informing all widgets in network.
     */
    parametersValuesChanging(params: { name: string; value: string; } [], canCancel: bool, approvalCallback: (canContinue: bool) => void ): void {
        if (this.isPreparedForParameterChange()) {
            approvalCallback.call(this, true);
        } else {
            this.callFunctionLater(this.parametersValuesChanging, arguments)
        }
    }

    /**
    * If that widget started parameters value change, 
    * this function is called when all widgets connected to 
    * a network by the parameter reacted for the change.
    * @param confirmed True when all widgets accepted the change
    * @param params Array of required parameters modifications {name, value}[].
    */
    parametersValuesChangeConfirmation(confirmed: bool, params: { name: string; value: string; }[]): void {
        // ASWS reports had already changed the values so there is no need to inform them.
    }

    /**
     * Try it again after some time.
     */
    callFunctionLater(fcn: Function, args: any) {
        var me = this;
        window.setTimeout(
            function () { fcn.apply(me, args) },
            250);
    }

    /**
     * Change report - set new values for parameters in the widget.
     * @param {Object} parameterChanges [{name, value}] - Only modified params!
     */
    setParametersValues(parameterChanges: Infor.BI.dashboards.IWidgetParameter[]) {
        /* e.g.: SetReportParameters([
        *    {  "Name": "ReportVariables.rvRegion", 
        *       "Value": "[REGION].[All Regions].[Europe].[Belgium]" }, 
        *    {  "Name": "ReportVariables.rvTime", 
        *       "Value": "[TIME].[All Years].[2004].[2004_Q3].[2004_Q3_07]"}]) 
        */

        var messageParam: Parameter[] = [],
            param: Infor.BI.dashboards.IWidgetParameter;

        for (var paramIndex = parameterChanges.length - 1; paramIndex >= 0; paramIndex--) {
            param = parameterChanges[paramIndex];
                messageParam.push(<Parameter>{ Name: param.name, Value: param.value });

        }
        //set new values - only for really changed values 
        if (messageParam.length > 0) {
            //call function inside AS iframe            

            if (this.currentlyProcessingParamChange != null && Dashboards.utils.areObjectsEqual(messageParam, this.currentlyProcessingParamChange)) {
                // already processing this param change - do not process it twice - just ignore it
                return;
            }
            if (this.isPreparedForParameterChange()) {
                this.currentlyProcessingParamChange = messageParam;
                (<any>this.getMainIFrame().contentWindow).SetReportParameters(messageParam);
            } else {
                this.setParametersValuesRepeater(parameterChanges);
            }
        }
    }

    /**
     * Try it again after some time.
     */
    setParametersValuesRepeater(parameterChanges: Infor.BI.dashboards.IWidgetParameter[]) {
        var me = this;

        // TODO: handle multiple requestets in time year = 2001, year = 2002 - merge 
        //       and clearInterval(this.unfeasibleParamChangesTimerId)
        //this.unfeasibleParamChanges = parameterChanges;
        /*this.unfeasibleParamChangesTimerId =*/ window.setTimeout(
            function () { me.setParametersValues.call(me, parameterChanges) },
            250);
    }

    /**
     * Create object with name and value of the changed params
     * @property {Object} detailsJson Json with parameter values.
     */
    private createParameterObject (detailsJson: any): any[] {
        var params: Infor.BI.dashboards.IWidgetParameter[] = [],
            index: number,
            item: any;

        if (detailsJson !== null && detailsJson.ReportParameters instanceof Array) {
            for (index = detailsJson.ReportParameters.length - 1; index >= 0; index--) {
                item = detailsJson.ReportParameters[index];
                if (!item.Fixed) {
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
    }

    /**
     * Is prepared for parameter changes? E.g. - iframe is loaded.
     * @returns {Boolean}
     */
    isPreparedForParameterChange(): bool {
        //TODO: not 100% reliable
        var iframe = this.getMainIFrame();

        try {
            return (<any>iframe.contentWindow).checkRedirectState() === "RedirectState:ready" && this.currentlyProcessingParamChange == null;
        } catch(Err) {
            return false;
        }
    }

    /**
     * Replace old values with the new values.
     * Inform other widgets about modifications in parameters.
     * @param {Array} parameterChangesInfo [{name, value}]
     * @param {Array} fixedReportParameters [{name, value}]
     * @param {String} reportUniqueNameChange New report id (null when not modified)
     */
    private processWidgetChange(widgetChanges: WidgetChanges) {
        var cfg = <ASWSWidgetConfiguration>this.config;

        if (this.didConfigChange(cfg, widgetChanges)) {
            // update also model
            this.changeModelConfig(widgetChanges);
        } else {
            // update just parameter values
            this.dashboard.parametersValuesChanged(widgetChanges.parameters);
        }
    }

    /**
     * Start and switch off immediateInteraction for future
     * (in the widget config).
     */
    private depleteImmediateInteraction() {
        var cfg = <ASWSWidgetConfiguration>this.config;

        if (cfg.immediateInteraction == null) {
            this.dashboard.warn("Widget configuration problem - missing immediateInteraction in original configuration");
        }

        cfg.immediateInteraction = false;
        this.dashboard.askForInteractionMode();
        this.dashboard.notifyAboutWidgetChange(null, this.config);
    }

    /**
    * Gets new jump target setting based on the old value and new report jump behavior setting.
    */
    private getNewJumpTarget(newReportJumpBehavior: number, oldJumpTarget: number): number {
        switch (newReportJumpBehavior) {
            case 0:
                // controlled by dashboard
                // no change
                return oldJumpTarget;
            case 1:
                // replace dashboard
                return 0;
            case 2:
                // replace widget
                return 1;
        }
        // TODO log error
        return oldJumpTarget;
    }

    /**
    * Checks whether the jump behavior settings did change.
    */
    private jumpBehaviorChange(config: ASWSWidgetConfiguration, newReportJumpBehavior: number): bool {
        var newJumpTarget: number = this.getNewJumpTarget(newReportJumpBehavior, config.jumpTarget);
        return config.reportJumpBehavior != newReportJumpBehavior || config.jumpTarget != newJumpTarget;
    }

    /** 
    * Checks whether the fixed parameters did change. 
    */ 
    private ParametersChange(config: ASWSWidgetConfiguration, newFixedReportParameters: Parameter[]): bool {  
        return !Dashboards.utils.areObjectsEqual(config.fixedReportParameters, newFixedReportParameters);
    }

    /**
    * Checks whether the config needs to be updated.
    */
    private didConfigChange(config: ASWSWidgetConfiguration, widgetChange: WidgetChanges): bool {
        var changed: bool = false;
        if (widgetChange.reportUniqueName !== null) {
            changed = changed || widgetChange.reportUniqueName != config.reportUniqueName;
        }

        if (widgetChange.fixedReportParameters !== null) {
            changed = changed || this.ParametersChange(config, widgetChange.fixedReportParameters);
        }

        if (widgetChange.reportJumpBehavior !== null) {
            changed = changed || this.jumpBehaviorChange(config, widgetChange.reportJumpBehavior);
        }

        return changed;
    }

    /**
     * Update widget config immediately.
     */
    private changeModelConfig(widgetChanges: WidgetChanges) {
        var cfg = <ASWSWidgetConfiguration>this.config;

        if (this.config.reportUniqueName == null) {
            this.dashboard.warn("Widget configuration problem - missing unique name in original configuration");
        }

        if (widgetChanges.reportUniqueName !== null) {
            this.config.reportUniqueName = widgetChanges.reportUniqueName;
        }

        if (widgetChanges.fixedReportParameters !== null) {
            cfg.fixedReportParameters = widgetChanges.fixedReportParameters;
        }

        if (widgetChanges.reportJumpBehavior !== null) {
            this.alterJumpTarget(cfg, widgetChanges.reportJumpBehavior);
        }

        this.dashboard.notifyAboutWidgetChange(widgetChanges.parameters, cfg);
    }

    setConfig(data: Infor.BI.dashboards.IWidgetConfiguration, changedProperty: string): Infor.BI.dashboards.IWidgetConfiguration {

        if (changedProperty === 'jumpTarget') {
            // convert jumpTarget from string to number
            var jumpTarget: number = parseInt(data[changedProperty]);
            this.config[changedProperty] = jumpTarget;
            // set also to config to return
            data[changedProperty] = jumpTarget;
            // this.dashboard.notifyAboutWidgetChange([], this.config);
        }
        else {
            this.dashboard.warn(Dashboards.utils.String.format('Method [ASWS.]Plugin.setConfig: unexpected parameter: {0}.', [changedProperty]));
        }
        return data;
    }

    /**
    * Gets array with single item with given value. TODO: test this!
    */
    private getSingleItem(items: Infor.BI.dashboards.IDropDownItem[], itemValue: string): Infor.BI.dashboards.IDropDownItem[]{
        var result: Infor.BI.dashboards.IDropDownItem[] = [];
        for (var i: number = 0; i < items.length; i++) {
            if (items[i].key === itemValue) {
                result.push(items[i]);
            }
        }
        return result;
    }

    getDropDownData(dataSourceId: string, items?: Infor.BI.dashboards.IDropDownItem[]): Infor.BI.dashboards.IDropDownItem[] {
        if (dataSourceId === 'jumpTarget') {
            switch (this.config.reportJumpBehavior) {
                case 0:
                    return items;
                case 1:
                    return this.getSingleItem(items, '0');
                case 2:
                    return this.getSingleItem(items, '1');
            }
        }
        return items;
    }

    /*
     * @private
     */
    private convertToWidgetChanges(original: any): WidgetChanges {
        try { 
            return <WidgetChanges> {
                reportUniqueName: original.ReportName,
                reportJumpBehavior: original.JumpBehavior,
                parameters: this.createParameterObject(original),
                fixedReportParameters: this.getFixedReportParameters(original)
            };
        }catch(Err){
            this.dashboard.warn('Param changes conversion failed');
            return null;
        }
    }

    private getFixedReportParameters(detailsJson: any): Parameter[] {
        var params: Parameter[] = [],
            index: number,
            item: { Name: string; Value: string; Fixed?: bool; },
            reportParameters: any;

        if (detailsJson !== null && detailsJson.ReportParameters instanceof Array) {
            reportParameters = detailsJson.ReportParameters;

            for (index = reportParameters.length - 1; index >= 0; index--) {
                item = reportParameters[index];
                if (item.Fixed) {
                    params.push(<Parameter>{ Name: item.Name, Value: item.Value });
                }
            }
        }

        return params;
    }

    /**
    * Alters the jumpTarget property in given config based on new reportJumpBehavior setting.
    */
    private alterJumpTarget(config: ASWSWidgetConfiguration, newReportJumpBehavior: number) {
        config.reportJumpBehavior = newReportJumpBehavior;
        config.jumpTarget = this.getNewJumpTarget(newReportJumpBehavior, config.jumpTarget);
    }

    widgetDataChanged(widgetData: Infor.BI.dashboards.IWidgetData, modified?: Infor.BI.dashboards.IWidgetData): void {
    }

    /**
    * Refresh widget content - typically reload url in iframe.
    */
    refreshContent(): void {
        super.refreshContent();
        this.currentlyProcessingParamChange = null;
    }
}