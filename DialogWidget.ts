/// <reference path='../../Infor.BI.WebFramework.Web/Scripts/Infor.d.ts'/>
/// <reference path='ReportContent.ts'/>

import ReportContent = module("./ReportContent");

export class DialogWidget extends ReportContent.ReportContent implements Infor.BI.dashboards.IDialog {
    constructor(public dashboard: Infor.BI.dashboards.IDialogContainer, public config: ReportContent.ASWSReportConfiguration) {
        super(dashboard, config);
    }

    init(config: Infor.BI.dashboards.IWidgetConfiguration): void {
        this.config = <ReportContent.ASWSReportConfiguration>config;
        this.loadUrl(false);
    }

    buttonClicked(clickedButtonKey: string): void {
    }

    dialogDataChanged(data: Infor.BI.dashboards.IDialogData, modified?: Infor.BI.dashboards.IDialogData): void {
    }

    // protected
    processSpecificPostMessage(detailsJson: any) {
        if (detailsJson === null) {

        } else if (detailsJson.action === "init") {
            this.onContentInit();
        } else if (detailsJson.action === "closeDialog") {
            this.closeWidgetDialog(detailsJson);
        }
    }

    private closeWidgetDialog(detailsJson: any): void {
        // since the parent report is unknown in the context of the open dialog,
        // Dashboard closes the dialog and informs WS about it afterwards
        var jsonData = {
            actionToken: detailsJson.actionToken,
            returnValue: detailsJson.returnValue
        };
        this.dashboard.close(jsonData);
    }

    private onContentInit() {
        this.dashboard.UX.hideLoadingMask();
    }
}