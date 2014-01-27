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
        { name: 'description', type: 'string' },
        { name: 'intValue', type: 'int' }
    ],
    
    isNumeric: function() {
        return false;
    }

}, function(Cls) {
	
	var extractionTypesDic = new Ext.util.HashMap();
	
    Cls.None = Ext.create("EvolveQueryEditor.model.ExtractionTypeModel", {
        name: "IS_NONE",
        description: "None",
        intValue: 0
    });
	extractionTypesDic.add(Cls.None.get("intValue"),Cls.None);
    
    Cls.Segment = Ext.create("EvolveQueryEditor.model.ExtractionTypeModel", {
        name: "IS_SEGMENT",
        description: "Segment",
        intValue: 10000
    });
	extractionTypesDic.add(Cls.Segment.get("intValue"),Cls.Segment);
    
    Cls.Count = Ext.create("EvolveQueryEditor.model.ExtractionTypeModel", {
        name: "IS_COUNT",
        description: "Count",
        intValue: 2
    });
	extractionTypesDic.add(Cls.Count.get("intValue"),Cls.Count);
    
    Cls.Min = Ext.create("EvolveQueryEditor.model.ExtractionTypeModel", {
        name: "IS_MIN",
        description: "Min",
        intValue: 4
    });
	extractionTypesDic.add(Cls.Min.get("intValue"),Cls.Min);
    
    Cls.Max = Ext.create("EvolveQueryEditor.model.ExtractionTypeModel", {
        name: "IS_MAX",
        description: "Max",
        intValue: 5
    });
	extractionTypesDic.add(Cls.Max.get("intValue"),Cls.Max);
    
    Cls.DistinctCount = Ext.create("EvolveQueryEditor.model.ExtractionTypeModel", {
        name: "IS_DISTINCT_COUNT",
        description: "Distinct Count",
        intValue: 7
    });
    extractionTypesDic.add(Cls.DistinctCount.get("intValue"),Cls.DistinctCount);
    
    Cls.Average = Ext.create("EvolveQueryEditor.model.ExtractionTypeModel", {
        name: "IS_AVERAGE",
        description: "Average",
        intValue: 3
    });
	extractionTypesDic.add(Cls.Average.get("intValue"),Cls.Average);
    
    Cls.DistinctAverage = Ext.create("EvolveQueryEditor.model.ExtractionTypeModel", {
        name: "IS_DISTINCT_AVERAGE",
        description: "Distinct Average",
        intValue: 8
    });
    extractionTypesDic.add(Cls.DistinctAverage.get("intValue"),Cls.DistinctAverage);
    
    Cls.Sum = Ext.create("EvolveQueryEditor.model.ExtractionTypeModel", {
        name: "IS_SUM",
        description: "Sum",
        intValue: 1
    });
	extractionTypesDic.add(Cls.Sum.get("intValue"),Cls.Sum);
    
    Cls.DistinctSum = Ext.create("EvolveQueryEditor.model.ExtractionTypeModel", {
        name: "IS_DISTINCT_SUM",
        description: "Distinct Sum",
        intValue: 6
    });
    extractionTypesDic.add(Cls.DistinctSum.get("intValue"),Cls.DistinctSum);
    
    Cls.Code = Ext.create("EvolveQueryEditor.model.ExtractionTypeModel", {
        name: "IS_LOOKUP_CODE",
        description: "Code",
        intValue: 20
    });
	extractionTypesDic.add(Cls.Code.get("intValue"),Cls.Code);

    Cls.Description = Ext.create("EvolveQueryEditor.model.ExtractionTypeModel", {
        name: "IS_LOOKUP_DESC",
        description: "Description",
        intValue: 21
    });
	extractionTypesDic.add(Cls.Description.get("intValue"),Cls.Description);

    Cls.ShortDescription = Ext.create("EvolveQueryEditor.model.ExtractionTypeModel", {
        name: "IS_LOOKUP_SHORT_DESC",
        description: "Short Description",
        intValue: 22
    });
	extractionTypesDic.add(Cls.ShortDescription.get("intValue"),Cls.ShortDescription);
    
    var extractionTypesForFixedLookupField = [EvolveQueryEditor.model.ExtractionTypeModel.Code, EvolveQueryEditor.model.ExtractionTypeModel.Description, EvolveQueryEditor.model.ExtractionTypeModel.ShortDescription];

    var getExtractType = function (fieldDataType, reportType) {
        var extractionTypes = [];
        
        if(fieldDataType === EvolveQueryEditor.model.FieldDataTypeModel.StringDataType) {
            if(reportType === EvolveQueryEditor.model.ReportTypeModel.DetailReport) {
                 extractionTypes = [EvolveQueryEditor.model.ExtractionTypeModel.None, EvolveQueryEditor.model.ExtractionTypeModel.Segment];
           
            } else if(reportType === EvolveQueryEditor.model.ReportTypeModel.SummaryReport) {
                extractionTypes = [EvolveQueryEditor.model.ExtractionTypeModel.None, EvolveQueryEditor.model.ExtractionTypeModel.Count, 
                EvolveQueryEditor.model.ExtractionTypeModel.Min, EvolveQueryEditor.model.ExtractionTypeModel.Max, 
                EvolveQueryEditor.model.ExtractionTypeModel.DistinctCount,EvolveQueryEditor.model.ExtractionTypeModel.Segment];
                
            } else {
                EvolveQueryEditor.util.QAALogger.error("Unknown report type", {dump: reportType});
            }
        } else if(fieldDataType === EvolveQueryEditor.model.FieldDataTypeModel.TimeDataType) {
            if(reportType === EvolveQueryEditor.model.ReportTypeModel.DetailReport) {
                extractionTypes = [EvolveQueryEditor.model.ExtractionTypeModel.None];
            
            } else if(reportType === EvolveQueryEditor.model.ReportTypeModel.SummaryReport) {
                extractionTypes =  [EvolveQueryEditor.model.ExtractionTypeModel.None, EvolveQueryEditor.model.ExtractionTypeModel.Count, 
                EvolveQueryEditor.model.ExtractionTypeModel.Min, EvolveQueryEditor.model.ExtractionTypeModel.Max, 
                EvolveQueryEditor.model.ExtractionTypeModel.DistinctCount];
                
            } else {
                EvolveQueryEditor.util.QAALogger.error("Unknown report type", {dump: reportType});
            }
            
        } else if(fieldDataType === EvolveQueryEditor.model.FieldDataTypeModel.NumericDataType) {
            if(reportType === EvolveQueryEditor.model.ReportTypeModel.DetailReport) {
                extractionTypes = [EvolveQueryEditor.model.ExtractionTypeModel.None];
                
            } else if(reportType === EvolveQueryEditor.model.ReportTypeModel.SummaryReport) {
                extractionTypes =  [EvolveQueryEditor.model.ExtractionTypeModel.Sum, 
				EvolveQueryEditor.model.ExtractionTypeModel.Count, 
				EvolveQueryEditor.model.ExtractionTypeModel.Average,
				EvolveQueryEditor.model.ExtractionTypeModel.Min,
				EvolveQueryEditor.model.ExtractionTypeModel.Max,
				EvolveQueryEditor.model.ExtractionTypeModel.DistinctSum,
				EvolveQueryEditor.model.ExtractionTypeModel.DistinctCount,
				EvolveQueryEditor.model.ExtractionTypeModel.DistinctAverage,
				EvolveQueryEditor.model.ExtractionTypeModel.None];
			
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
            if (reportType === EvolveQueryEditor.model.ReportTypeModel.SummaryReport) {
				//from desktop logic, it can directly return 7 kinds of types
				//For summary report,it should has Code\Description\Short Description\Min\Max\Count\Distinct Count seven extraction type
                availableExtractTypes = Ext.Array.merge(availableExtractTypes, 
					[EvolveQueryEditor.model.ExtractionTypeModel.Min,EvolveQueryEditor.model.ExtractionTypeModel.Max,
					EvolveQueryEditor.model.ExtractionTypeModel.Count,EvolveQueryEditor.model.ExtractionTypeModel.DistinctCount]);
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
	
	Cls.parseFromValue = function(intValue){
		return extractionTypesDic.get(intValue);
	};
    
});
