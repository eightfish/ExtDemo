define(["require", "exports"], function(require, exports) {
    var aswsPostMessageType;
    (function (aswsPostMessageType) {
        aswsPostMessageType._map = [];
        aswsPostMessageType._map[0] = "notRecognized";
        aswsPostMessageType.notRecognized = 0;
        aswsPostMessageType._map[1] = "showError";
        aswsPostMessageType.showError = 1;
        aswsPostMessageType._map[2] = "askForPopupCombo";
        aswsPostMessageType.askForPopupCombo = 2;
        aswsPostMessageType._map[3] = "askForPopupMenu";
        aswsPostMessageType.askForPopupMenu = 3;
        aswsPostMessageType._map[4] = "askForMessageDialog";
        aswsPostMessageType.askForMessageDialog = 4;
        aswsPostMessageType._map[5] = "askForOpenDialog";
        aswsPostMessageType.askForOpenDialog = 5;
        aswsPostMessageType._map[6] = "askForDataLinkQueryEditor";
        aswsPostMessageType.askForDataLinkQueryEditor = 6;
    })(aswsPostMessageType || (aswsPostMessageType = {}));
    var Dashboards = Infor.BI.dashboards;
    
    var ReportContent = (function () {
        function ReportContent(dashboard, config) {
            this.dashboard = dashboard;
            this.config = config;
            this.isInitialLoading = false;
        }
        ReportContent.prototype.getContent = function () {
            this.dashboard.UX.showLoadingMask(this.dashboard.UX.getLocalized('Loading ${widget.caption}'));
            this.iframe = new Dashboards.IFrame();
            this.iframe.onLoadEvent.on(this.onload, this);
            return this.iframe.getContent();
        };
        ReportContent.prototype.getMainIFrame = function () {
            return this.iframe.getIFrame();
        };
        ReportContent.prototype.refreshContent = function () {
            this.dashboard.UX.showLoadingMask(this.dashboard.UX.getLocalized('Refreshing ${widget.caption}'));
            this.loadUrl(true);
        };
        ReportContent.prototype.processPostMessage = function (e) {
            var recievedData = e.data, receivedDataJson = Dashboards.utils.JSON.parse(recievedData);
            this.dashboard.UX.hideMessage();
            this.dashboard.UX.hideLoadingMask();
            switch(this.getBaseReceivedMessageDataType(receivedDataJson)) {
                case aswsPostMessageType.showError:
                    this.dashboard.UX.showMessage((receivedDataJson).errorMessage, Dashboards.ShowMessageType.Error);
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
        };
        ReportContent.prototype.processSpecificPostMessage = function (recievedData) {
            this.dashboard.warn('Trying to access the processSpecificPostMessage abstract method.');
        };
        ReportContent.prototype.loadUrl = function (recalculateReport) {
            this.isInitialLoading = true;
            this.iframe.load(this.config.url + (recalculateReport ? '&recalculateReport=true' : ''));
        };
        ReportContent.prototype.sendMessageToReportEnvironment = function (jsonObject, actionName) {
            jsonObject.action = actionName;
            var jsonString = Dashboards.utils.JSON.encode(jsonObject), reportWin = (this.getMainIFrame().contentWindow), reportFrame = reportWin.YAHOO.asws.getFrame("reportFrame");
            if(reportFrame) {
                reportFrame.postMessage(jsonString, window.location.protocol + "//" + window.location.host);
            } else {
                this.dashboard.warn('The report frame of ASWS Widget is not available.');
            }
        };
        ReportContent.prototype.getBaseReceivedMessageDataType = function (detailsJson) {
            if(detailsJson === null) {
                return aswsPostMessageType.notRecognized;
            } else if(detailsJson.action === "showError" && detailsJson.errorMessage != undefined) {
                return aswsPostMessageType.showError;
            } else if(detailsJson.action === "askForPopupCombo") {
                return aswsPostMessageType.askForPopupCombo;
            } else if(detailsJson.action === "askForPopupMenu") {
                return aswsPostMessageType.askForPopupMenu;
            } else if(detailsJson.action === "askForMessageDialog") {
                return aswsPostMessageType.askForMessageDialog;
            } else if(detailsJson.action === "askForOpenDialog") {
                return aswsPostMessageType.askForOpenDialog;
            } else if(detailsJson.action === "executeDataLinkQueryEditor") {
                return aswsPostMessageType.askForDataLinkQueryEditor;
            } else {
                return aswsPostMessageType.notRecognized;
            }
        };
        ReportContent.prototype.onload = function () {
            if(this.isInitialLoading) {
                this.isInitialLoading = false;
                var content = this.getMainIFrame();
                if(!(content && content.contentWindow && content.contentWindow.document && content.contentWindow.document.getElementById('topFrameset') !== null)) {
                    this.dashboard.UX.hideLoadingMask();
                    this.dashboard.UX.showMessage(this.dashboard.UX.getLocalized('Report unavailable'), Dashboards.ShowMessageType.Error);
                }
            }
            return true;
        };
        ReportContent.prototype.askForPopupCombo = function (detailsJson) {
            this.dashboard.warn('The pop up combo is not supported by ASWS Widget.');
        };
        ReportContent.prototype.askForPopupMenu = function (detailsJson) {
            this.dashboard.warn('The pop up menu is not supported by ASWS Widget.');
        };
        ReportContent.prototype.askForMessageDialog = function (detailsJson) {
            this.dashboard.warn('The message dialog is not supported by ASWS Widget.');
        };
        ReportContent.prototype.askForWidgetDialog = function (detailsJson) {
            var config = this.getWidgetDialogConfig(detailsJson);
            this.dashboard.UX.askForWidgetDialog(config);
        };
        ReportContent.prototype.getWidgetDialogConfig = function (jsonData) {
            var me = this, actionToken = jsonData.actionToken;
            return {
                title: jsonData.title,
                width: jsonData.width,
                height: jsonData.height,
                clickedArea: jsonData.clickedArea,
                js: {
                    type: 'amd',
                    src: me.dashboard.getResourceUrl('Scripts/DialogWidget', false)
                },
                contentPluginConfig: {
                    url: jsonData.customData.url
                },
                submitCallback: function (returnData) {
                    if(returnData) {
                        me.sendMessageToReportEnvironment(returnData, 'closeDialog');
                    } else {
                        me.doCancelWidgetDialog(actionToken);
                    }
                },
                openCallback: function (type) {
                    if(type === 2) {
                        me.doCancelWidgetDialog(actionToken);
                    }
                }
            };
        };
        ReportContent.prototype.doCancelWidgetDialog = function (actionToken) {
            var me = this;
            var jsonData = {
                actionToken: actionToken,
                returnValue: false
            };
            me.sendMessageToReportEnvironment(jsonData, 'closeDialog');
        };
        ReportContent.prototype.askForQueryEditorDialog = function (info) {
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
                submitCallback: function (data) {
                    var report = me.getMainIFrame().contentWindow;
                    info.dialogResult = data ? true : false;
                    info.query = data;
                    report.OnDataLinkEditorClosed(info);
                },
                openCallback: function () {
                },
                buttons: [
                    {
                        key: 'Ok',
                        caption: 'Ok'
                    }, 
                    {
                        key: 'Cancel',
                        caption: 'Cancel'
                    }
                ]
            });
        };
        return ReportContent;
    })();
    exports.ReportContent = ReportContent;    
})
