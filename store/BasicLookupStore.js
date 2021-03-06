/*
 * File: app/store/BasicLookupStore.js
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

Ext.define('EvolveQueryEditor.store.BasicLookupStore', {
    extend: 'Ext.data.Store',

    requires: [
        'EvolveQueryEditor.model.Query',
        'EvolveQueryEditor.model.BasicLookupResultModel',
        'EvolveQueryEditor.store.JsonPostingProxy'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            autoLoad: false,
            model: 'EvolveQueryEditor.model.BasicLookupResultModel',
            storeId: 'BasicLookupStore',
            proxy: me.processMyAjaxProxy6({
                type: 'ajax',
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

    processMyAjaxProxy6: function(config) {
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
        alert('Error loading Lookup store: ' + response.stateText);
    },

    onArraystoreBeforeLoad: function(store, operation, eOpts) {
        console.log('Loading lookup model');

        this.proxy.extraParams = {
            clientToken: EvolveQueryEditor.model.Query.clientToken,
            query: {
                mode: EvolveQueryEditor.model.Query.getQueryType(),
                productCode: EvolveQueryEditor.model.Query.getProductCode(),
                tableCode: '',
                filters: []
            }
        };


        //this.proxy.extraParams.query.filters.add

        this.proxy.url = EvolveQueryEditor.model.Query.serverUrlBase + '&method=LookupFilterValues';
    }

});