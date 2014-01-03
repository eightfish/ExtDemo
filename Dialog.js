Ext.define('EvolveQueryEditor.Dialog', {
    extend: 'Infor.widget.DialogPluginBase',
    requires: [
        'EvolveQueryEditor.view.EditorControl'
    ],
    
    id: 'qnaDialogQueryEditor',

    editorControl: undefined,

    getContent: function () {
        if(this.editorControl === undefined){
            this.editorControl = Ext.create('EvolveQueryEditor.view.EditorControl', {
                dialogContainer: this.dialogContainer,
                dialogConfig: this.dialogConfig
            });
        }

        return this.editorControl;
    },
    
    buttonClicked: function (clickedButtonKey) {
        var query;
        var self = this;
        if (clickedButtonKey === "Ok") {
            query = this.editorControl.getQueryDefinition();
        } else {
            query = "";
        }
        self.dialogContainer.close(query);
    }
});