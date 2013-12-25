Ext.define('EvolveQueryEditor.store.SortingTypeStore', {
    extend: 'Ext.data.Store',
    model: 'EvolveQueryEditor.model.SortingTypeModel',

}, function (Cls) {
    Cls.Instance = Ext.create('EvolveQueryEditor.store.SortingTypeStore');

    Cls.Instance.add(EvolveQueryEditor.model.SortingTypeModel.None);
    Cls.Instance.add(EvolveQueryEditor.model.SortingTypeModel.Ascending);
    Cls.Instance.add(EvolveQueryEditor.model.SortingTypeModel.Descending);
});
