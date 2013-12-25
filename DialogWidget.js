var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "./ReportContent"], function(require, exports, __ReportContent__) {
    var ReportContent = __ReportContent__;

    var DialogWidget = (function (_super) {
        __extends(DialogWidget, _super);
        function DialogWidget(dashboard, config) {
                _super.call(this, dashboard, config);
            this.dashboard = dashboard;
            this.config = config;
        }
        DialogWidget.prototype.init = function (config) {
            this.config = config;
            this.loadUrl(false);
        };
        DialogWidget.prototype.buttonClicked = function (clickedButtonKey) {
        };
        DialogWidget.prototype.dialogDataChanged = function (data, modified) {
        };
        DialogWidget.prototype.processSpecificPostMessage = function (detailsJson) {
            if(detailsJson === null) {
            } else if(detailsJson.action === "init") {
                this.onContentInit();
            } else if(detailsJson.action === "closeDialog") {
                this.closeWidgetDialog(detailsJson);
            }
        };
        DialogWidget.prototype.closeWidgetDialog = function (detailsJson) {
            var jsonData = {
                actionToken: detailsJson.actionToken,
                returnValue: detailsJson.returnValue
            };
            this.dashboard.close(jsonData);
        };
        DialogWidget.prototype.onContentInit = function () {
            this.dashboard.UX.hideLoadingMask();
        };
        return DialogWidget;
    })(ReportContent.ReportContent);
    exports.DialogWidget = DialogWidget;    
})
