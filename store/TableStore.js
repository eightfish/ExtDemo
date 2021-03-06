/*
 * File: app/store/TableStore.js
 *
 * This file was generated by Sencha Architect version 2.2.2.
 * http://www.sencha.com/products/architect/
 *
 * This file requires use of the Ext JS 4.1.x library, under independent license.
 * License of Sencha Architect does not include license for Ext JS 4.1.x. For more
 * details see http://www.sencha.com/license or contact license@sencha.com.
 *
 * This file will be auto-generated each and everytime you save your project.
 *
 * Do NOT hand edit this file.
 */

Ext.define('EvolveQueryEditor.store.TableStore', {
    extend: 'Ext.data.TreeStore',

    requires: [
        'EvolveQueryEditor.model.TableModel',
        'EvolveQueryEditor.store.JsonPostingProxy'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model: 'EvolveQueryEditor.model.TableModel',
            storeId: 'TableStore',
            root: 'data',
            proxy: me.processMyAjaxProxy5({
                type: 'ajax',
                timeout: 60000,
                reader: {
                    type: 'json',
                    root: 'data'
                },
                listeners: {
                    exception: {
                        fn: me.onAjaxException,
                        scope: me
                    }
                }
            }),
            listeners: {
                beforeload: {
                    fn: me.onArraystoreBeforeLoad,
                    scope: me
                }
            }
        }, cfg)]);
    },

    processMyAjaxProxy5: function(config) {
        return Ext.create('EvolveQueryEditor.store.JsonPostingProxy', {
            timeout: 60000,
            listeners: {
                exception: {
                    fn: this.onAjaxException,
                    scope: this
                }
            },
            reader: {
                type: 'json',
                root: 'data'
            }
        });
    },

    onAjaxException: function(proxy, response, operation, eOpts) {
        alert(response.stateText);
    },

    onArraystoreBeforeLoad: function(store, operation, eOpts) {
        this.proxy.extraParams = {
            clientToken: EvolveQueryEditor.model.Query.clientToken,
            query: {
                productCode: EvolveQueryEditor.model.Query.getProductCode(),
                tableCode: '',
                mode: EvolveQueryEditor.model.Query.getQueryType(),
                filters: EvolveQueryEditor.model.Query.getFilters()
            }
        };

        this.proxy.url = EvolveQueryEditor.model.Query.serverUrlBase + '&method=LookupTables';
    }
});