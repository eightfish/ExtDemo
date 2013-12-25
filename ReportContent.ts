/// <reference path='../../Infor.BI.WebFramework.Web/Scripts/Infor.d.ts'/>

enum aswsPostMessageType {
    notRecognized,
    showError,
    askForPopupCombo,
    askForPopupMenu,
    askForMessageDialog,
    askForOpenDialog,
    askForDataLinkQueryEditor
}

var Dashboards = Infor.BI.dashboards;

export declare class ASWSReportConfiguration implements Infor.BI.dashboards.IWidgetConfiguration {
    public url: string;
    public jumpTarget: number;  // 0 = replace dashboard, 1 = replace widget
    public reportUniqueName: string;
    public reportJumpBehavior: number; // 0 = controlled by dashboard, 1 = replace dashboard, 2 = replace widget
}

export class ReportContent {
    private iframe: Infor.BI.dashboards.IFrame;
    private isInitialLoading: bool = false;

    constructor(public dashboard: Infor.BI.dashboards.IDashboardContainer, public config: ASWSReportConfiguration) {
    }

    getContent(): HTMLElement {
        this.dashboard.UX.showLoadingMask(this.dashboard.UX.getLocalized('Loading ${widget.caption}'));
        this.iframe = new Dashboards.IFrame();

        this.iframe.onLoadEvent.on(this.onload, this);

        return this.iframe.getContent();
    }

     /**
     * Must be set if the widget contains an iframe which
     * postmessages should be processed. 
     *
     * See processPostMessage.
     */
    getMainIFrame(): HTMLIFrameElement {
        return this.iframe.getIFrame();
    }

    /**
    * Refresh widget content - typically reload url in iframe.
    */
    refreshContent(): void {
        this.dashboard.UX.showLoadingMask(this.dashboard.UX.getLocalized('Refreshing ${widget.caption}'));
        this.loadUrl(true);
    }

    /**
     * Handler for all postMessages sent from inside this widget - recognized based on #getMainIFrame.
     * This method is called when a postMessage was received from a contained IFrame.
     *
     * @param e MessageEvent.
     */
    processPostMessage(e: MessageEvent): void {
        var recievedData = e.data,
            receivedDataJson = Dashboards.utils.JSON.parse(recievedData);

        this.dashboard.UX.hideMessage();
        this.dashboard.UX.hideLoadingMask();

        switch (this.getBaseReceivedMessageDataType(receivedDataJson)) {
            case aswsPostMessageType.showError:
                this.dashboard.UX.showMessage((<any>receivedDataJson).errorMessage, Dashboards.ShowMessageType.Error);
                break;
            case aswsPostMessageType.notRecognized:
                this.processSpecificPostMessage(receivedDataJson);
                break;
            case aswsPostMessageType.askForPopupCombo:
                this.askForPopupCombo(receivedDataJson);
                break;
            case aswsPostMessageType.askForPopupMenu:
                this.askForPopupMenu(receivedDataJson);
                break;
            case aswsPostMessageType.askForMessageDialog:
                this.askForMessageDialog(receivedDataJson);
                break;
            case aswsPostMessageType.askForOpenDialog:
                this.askForWidgetDialog(receivedDataJson);
                break;
            case aswsPostMessageType.askForDataLinkQueryEditor:
                this.askForQueryEditorDialog(receivedDataJson);
                break;
        }
    }

    processSpecificPostMessage(recievedData: any) {
        this.dashboard.warn('Trying to access the processSpecificPostMessage abstract method.');
    }

    /**
     * Change url to value form config and show loading mask.
     */
    public loadUrl(recalculateReport: bool): void {
        this.isInitialLoading = true;
        this.iframe.load(this.config.url + (recalculateReport ? '&recalculateReport=true' : ''));
    }

    public sendMessageToReportEnvironment(jsonObject: any, actionName: string): void {
        jsonObject.action = actionName;

        var jsonString = Dashboards.utils.JSON.encode(jsonObject),
            reportWin = < any > (this.getMainIFrame().contentWindow),
            reportFrame = reportWin.YAHOO.asws.getFrame("reportFrame");

        if (reportFrame) {
            reportFrame.postMessage(jsonString, window.location.protocol + "//" + window.location.host);
        } else {
            this.dashboard.warn('The report frame of ASWS Widget is not available.');
        }
    }

    /**
     * Select message type.
     *
     * @private
     */
    private getBaseReceivedMessageDataType(detailsJson: any): aswsPostMessageType {
        if (detailsJson === null) {
            return aswsPostMessageType.notRecognized;
        } else if (detailsJson.action === "showError" && detailsJson.errorMessage != undefined) {
            return aswsPostMessageType.showError;
        } else if (detailsJson.action === "askForPopupCombo") {
            return aswsPostMessageType.askForPopupCombo;
        } else if (detailsJson.action === "askForPopupMenu") {
            return aswsPostMessageType.askForPopupMenu;
        } else if (detailsJson.action === "askForMessageDialog") {
            return aswsPostMessageType.askForMessageDialog;
        } else if (detailsJson.action === "askForOpenDialog") {
            return aswsPostMessageType.askForOpenDialog;
        } else if (detailsJson.action === "executeDataLinkQueryEditor") {
            return aswsPostMessageType.askForDataLinkQueryEditor;
        } else {
            return aswsPostMessageType.notRecognized;
        }
    }

    /**
     * Iframe loaded.
     */
    private onload(): bool {
        if (this.isInitialLoading) {
            this.isInitialLoading = false;

            var content = this.getMainIFrame();
            if (!(content && content.contentWindow && content.contentWindow.document
                && content.contentWindow.document.getElementById('topFrameset') !== null)) {
                this.dashboard.UX.hideLoadingMask();
                this.dashboard.UX.showMessage(this.dashboard.UX.getLocalized('Report unavailable'), Dashboards.ShowMessageType.Error);
            }
        }

        return true;
    }

     /**
     * Report wants to show combobox content in popup window.
     * @private
     */
    private askForPopupCombo(detailsJson: any) {
        // var config = this.getComboData(detailsJson.data.clickedElementVisibleRectangle);
        // this.dashboard.UX.askForPopupCombo(config);
        this.dashboard.warn('The pop up combo is not supported by ASWS Widget.');
    }

    /**
     * Report wants to show menu items in popup window.
     * @private
     */
    private askForPopupMenu(detailsJson: any) {
        // var config = this.getMenuData(detailsJson.data.clickedElementVisibleRectangle);
        // this.dashboard.UX.askForPopupMenu(<any>config);
        this.dashboard.warn('The pop up menu is not supported by ASWS Widget.');
    }

    /**
     * Report wants to show message dialog window.
     * @private
     */
    private askForMessageDialog(detailsJson: any) {
        // var config = this.getMessageDialog();
        // this.dashboard.UX.askForMessageDialog(config);
        this.dashboard.warn('The message dialog is not supported by ASWS Widget.');
    }

     /**
     * Report wants to show widget dialog window.
     * @private
     */
    private askForWidgetDialog(detailsJson: any) {
        var config = this.getWidgetDialogConfig(detailsJson);
        this.dashboard.UX.askForWidgetDialog(config);
    }

    private getWidgetDialogConfig(jsonData: any): Infor.BI.dashboards.IWidgetDialogConfig {
        var me = this,
            actionToken = jsonData.actionToken;

        return {
            title: jsonData.title,
            width: jsonData.width,
            height: jsonData.height,
            clickedArea: jsonData.clickedArea,
            js: {
                type: 'amd',
                src: me.dashboard.getResourceUrl('Scripts/DialogWidget', false)
            },
            contentPluginConfig: { url: jsonData.customData.url },
            submitCallback: function (returnData: any) {
                if (returnData) {
                    me.sendMessageToReportEnvironment(returnData, 'closeDialog');
                } else {
                    me.doCancelWidgetDialog(actionToken);
                }
            },
            openCallback: function (type: Infor.BI.dashboards.OpenContentPopupResponse) {
                // OpenContentPopupResponse { Ok, AlreadyOpened, CannotOpen }
                if (type === 2) {
                    // the dialog cannot be open
                    me.doCancelWidgetDialog(actionToken);
                }                
            }
        };
    }

    private doCancelWidgetDialog(actionToken: any) {
        var me = this;

        var jsonData = {
            actionToken: actionToken,
            returnValue: false // ASWS dialogs can be only cancelled from Dashboards
        };

        me.sendMessageToReportEnvironment(jsonData, 'closeDialog');
    }

    private askForQueryEditorDialog(info: any): void {
        var me = this;
        this.dashboard.UX.askForWidgetDialog({
            id: null,
            title: 'Query & Analysis Query Definition',
            width: 717,
            height: 555,
            js: {
                type: 'extjs',
                className: 'EvolveQueryEditor.Dialog',
                paths: {
                    'EvolveQueryEditor': this.dashboard.getResourceUrl('Scripts/QueryDialog', false)
                }
            },
            contentPluginConfig: info,
            submitCallback: function (data: any) {
                var report = <any>me.getMainIFrame().contentWindow;
                // data contains the query - empty means Cancel
                info.dialogResult = data ? true : false;
                info.query = data;
                report.OnDataLinkEditorClosed(info);
            },
            openCallback: function () {},
            buttons: [{ key: 'Ok', caption: 'Ok' }, { key: 'Cancel', caption: 'Cancel' }]
        });
    }
}