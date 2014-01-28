Ext.define('EvolveQueryEditor.Dialog', {
    extend: 'Infor.widget.DialogPluginBase',
    requires: [
        'EvolveQueryEditor.view.EditorControl',
        'EvolveQueryEditor.util.QAALogger',
        'EvolveQueryEditor.model.Query'
    ],
    
    id: 'qnaDialogQueryEditor',

    editorControl: undefined,

    wrapper: undefined,

    getContent: function () {
        if (!this.wrapper) {
            this.wrapper = Ext.create('Ext.panel.Panel');
        }

        return this.wrapper;
    },

    init: function (config, dialogData) {
        var me = this,
            proxyUrl = this.dialogContainer.getActionUrl('EvolveProxy', 'Index', { aliasName: me.dialogConfig.aliasName }),
            loginUrl = this.dialogContainer.getActionUrl('EvolveProxy', 'Login', { aliasName: me.dialogConfig.aliasName, connectionInfo: me.dialogConfig.connectionInfo });

        if (EvolveQueryEditor.model.Query.clientToken == undefined) {
            Ext.Ajax.request({
                url: loginUrl,
                timeout: 60000,
                async: true,
                success: function (result, options) {
                    var res = Ext.decode(result.responseText);
                    var model = EvolveQueryEditor.model.Query;

                    model.clientToken = res.data.ClientToken;
                    model.serverUrlBase = proxyUrl;

                    me.editorControl = Ext.create('EvolveQueryEditor.view.EditorControl', {
                        dialogContainer: me.dialogContainer,
                        dialogConfig: me.dialogConfig
                    });

                    me.wrapper.add(me.editorControl);
                },
                failure: function (result, options) {
                    EvolveQueryEditor.util.QAAMsg.showErrorDialog(result.statusText);
                }
            });

        }
    },

    buttonClicked: function (clickedButtonKey) {
        var query;
        var self = this;
        
        if (clickedButtonKey === "Ok") {
            query = this.editorControl.getQueryDefinition();
            if(Ext.isEmpty(query)) {
                return;
            }  
        } 
        
        self.dialogContainer.close(query);
        EvolveQueryEditor.model.Query.clientToken = undefined;
    }
});