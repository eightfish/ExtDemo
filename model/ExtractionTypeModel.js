/******************************************************
*                      NOTICE
* 
* THIS SOFTWARE IS THE PROPERTY OF AND CONTAINS
* CONFIDENTIAL INFORMATION OF INFOR AND SHALL NOT
* BE DISCLOSED WITHOUT PRIOR WRITTEN PERMISSION.
* LICENSED CUSTOMERS MAY COPY AND ADAPT THIS
* SOFTWARE FOR THEIR OWN USE IN ACCORDANCE WITH
* THE TERMS OF THEIR SOFTWARE LICENSE AGREEMENT.
* ALL OTHER RIGHTS RESERVED.
* 
* COPYRIGHT (c) 2010 - 2011 INFOR. ALL RIGHTS RESERVED.
* THE WORD AND DESIGN MARKS SET FORTH HEREIN ARE
* TRADEMARKS AND/OR REGISTERED TRADEMARKS OF INFOR
* AND/OR RELATED AFFILIATES AND SUBSIDIARIES. ALL
* RIGHTS RESERVED. ALL OTHER TRADEMARKS LISTED
* HEREIN ARE THE PROPERTY OF THEIR RESPECTIVE
* OWNERS. WWW.INFOR.COM.
* 
* *****************************************************
*/
Ext.define("EvolveQueryEditor.model.ExtractionTypeModel", {
    extend: "Ext.data.Model",
    
    requires: [
        'EvolveQueryEditor.util.QAALogger'
    ],

    fields: [
        {name: 'name',  type: 'string'},
        {name: 'description', type: 'string'}
    ],
    
    isNumeric: function() {
        return false;
    }

}, function(Cls) {
    Cls.None = Ext.create("EvolveQueryEditor.model.ExtractionTypeModel", {
        name: "IS_NONE",
        description: "None"
    });
    
    Cls.Segment = Ext.create("EvolveQueryEditor.model.ExtractionTypeModel", {
        name: "IS_SEGMENT",
        description: "Segment"
    });
    
    Cls.Count = Ext.create("EvolveQueryEditor.model.ExtractionTypeModel", {
        name: "IS_COUNT",
        description: "Count"
    });
    
    Cls.Min = Ext.create("EvolveQueryEditor.model.ExtractionTypeModel", {
        name: "IS_MIN",
        description: "Min"
    });
    
    Cls.Max = Ext.create("EvolveQueryEditor.model.ExtractionTypeModel", {
        name: "IS_MAX",
        description: "Max"
    });
    
    Cls.DistinctCount = Ext.create("EvolveQueryEditor.model.ExtractionTypeModel", {
        name: "IS_DISTINCT_COUNT",
        description: "Distinct Count"
    });
    
    Cls.Average = Ext.create("EvolveQueryEditor.model.ExtractionTypeModel", {
        name: "IS_AVERAGE",
        description: "Average"
    });
    
    Cls.DistinctAverage = Ext.create("EvolveQueryEditor.model.ExtractionTypeModel", {
        name: "IS_DISTINCT_AVERAGE",
        description: "Distinct Average"
    });
    
    Cls.Sum = Ext.create("EvolveQueryEditor.model.ExtractionTypeModel", {
        name: "IS_SUM",
        description: "Sum"
    });
    
    Cls.DistinctSum = Ext.create("EvolveQueryEditor.model.ExtractionTypeModel", {
        name: "IS_DISTINCT_SUM",
        description: "Distinct Sum"
    });
    
    Cls.DistinctSum = Ext.create("EvolveQueryEditor.model.ExtractionTypeModel", {
        name: "IS_DISTINCT_SUM",
        description: "Distinct Sum"
    });
    
    Cls.Code = Ext.create("EvolveQueryEditor.model.ExtractionTypeModel", {
        name: "IS_LOOKUP_CODE",
        description: "Code"
    });

    Cls.Description = Ext.create("EvolveQueryEditor.model.ExtractionTypeModel", {
        name: "IS_LOOKUP_DESC",
        description: "Description"
    });

    Cls.ShortDescription = Ext.create("EvolveQueryEditor.model.ExtractionTypeModel", {
        name: "IS_LOOKUP_SHORT_DESC",
        description: "Short Description"
    });
    
    var extractionTypesForFixedLookupField = [EvolveQueryEditor.model.ExtractionTypeModel.Code, EvolveQueryEditor.model.ExtractionTypeModel.Description, EvolveQueryEditor.model.ExtractionTypeModel.ShortDescription];

    var getExtractType = function (fieldDataType, reportType) {
        var extractionTypes = [];
        
        if(fieldDataType === EvolveQueryEditor.model.FieldDataTypeModel.StringDataType) {
            if(reportType === EvolveQueryEditor.model.ReportTypeModel.DetailReport) {
                 extractionTypes = [EvolveQueryEditor.model.ExtractionTypeModel.None, EvolveQueryEditor.model.ExtractionTypeModel.Segment];
           
            } else if(reportType === EvolveQueryEditor.model.ReportTypeModel.SummaryReport) {
                extractionTypes = [EvolveQueryEditor.model.ExtractionTypeModel.None, EvolveQueryEditor.model.ExtractionTypeModel.Count, 
                EvolveQueryEditor.model.ExtractionTypeModel.Min, EvolveQueryEditor.model.ExtractionTypeModel.Max, 
                EvolveQueryEditor.model.ExtractionTypeModel.DistinctCount];
                
            } else {
                EvolveQueryEditor.util.QAALogger.error("Unknown report type", {dump: reportType});
            }
        } else if(fieldDataType === EvolveQueryEditor.model.FieldDataTypeModel.TimeDataType) {
            if(reportType === EvolveQueryEditor.model.ReportTypeModel.DetailReport) {
                extractionTypes = [EvolveQueryEditor.model.ExtractionTypeModel.None, EvolveQueryEditor.model.ExtractionTypeModel.Segment];
            
            } else if(reportType === EvolveQueryEditor.model.ReportTypeModel.SummaryReport) {
                extractionTypes =  [EvolveQueryEditor.model.ExtractionTypeModel.None, EvolveQueryEditor.model.ExtractionTypeModel.Count, 
                EvolveQueryEditor.model.ExtractionTypeModel.Min, EvolveQueryEditor.model.ExtractionTypeModel.Max, 
                EvolveQueryEditor.model.ExtractionTypeModel.DistinctCount];
                
            } else {
                EvolveQueryEditor.util.QAALogger.error("Unknown report type", {dump: reportType});
            }
            
        } else if(fieldDataType === EvolveQueryEditor.model.FieldDataTypeModel.StringDataType) {
            if(reportType === EvolveQueryEditor.model.ReportTypeModel.DetailReport) {
                extractionTypes = [EvolveQueryEditor.model.ExtractionTypeModel.None];
                
            } else if(reportType === EvolveQueryEditor.model.ReportTypeModel.SummaryReport) {
                extractionTypes =  [EvolveQueryEditor.model.ExtractionTypeModel.None, EvolveQueryEditor.model.ExtractionTypeModel.Count, 
                EvolveQueryEditor.model.ExtractionTypeModel.Min, EvolveQueryEditor.model.ExtractionTypeModel.Max, 
                EvolveQueryEditor.model.ExtractionTypeModel.DistinctCount, EvolveQueryEditor.model.ExtractionTypeModel.Sum,
                EvolveQueryEditor.model.ExtractionTypeModel.DistinctSum, EvolveQueryEditor.model.ExtractionTypeModel.Average,
                EvolveQueryEditor.model.ExtractionTypeModel.DistinctAverage];
                
            } else {
                EvolveQueryEditor.util.QAALogger.error("Unknown report type", {dump: reportType});
            }
            
        } else {
            EvolveQueryEditor.util.QAALogger.error("Unknown field data type", {dump: fieldDataType});
        }
        
        return extractionTypes;   
    };
    
    Cls.getAvaliableExtractTypes = function (isFixedLookup, fieldDataType, reportType, extractTypesToExclude) {
        var availableExtractTypes = [];
        
        if (isFixedLookup) {
            availableExtractTypes = Ext.Array.merge(availableExtractTypes, extractionTypesForFixedLookupField);
            if (reportType == EvolveQueryEditor.model.ReportTypeModel.SummaryReport) {
                availableExtractTypes = Ext.Array.merge(availableExtractTypes, getExtractType(fieldDataType, availableExtractTypes));
            }
        } else {
            availableExtractTypes = getExtractType(fieldDataType, reportType);
        }

        //remove exlucded ones
        Ext.Array.forEach(extractTypesToExclude, function (item, index, allItems) {
            Ext.Array.remove(availableExtractTypes, item);
        });

        return availableExtractTypes;
    };
    
});
