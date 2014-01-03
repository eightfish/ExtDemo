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
Ext.define("EvolveQueryEditor.util.PeriodUtils", {

    statics: {
        MIN: "min",
        MAX: "max",
        NA: "",

        isValidPeriod: function (processedValue) {
            return processedValue !== EvolveQueryEditor.util.PeriodUtils.NA && processedValue !== EvolveQueryEditor.util.PeriodUtils.MIN && processedValue !== EvolveQueryEditor.util.PeriodUtils.MAX;
        },

        isPeriodFormat: function (value) {
            var regExp = /^\d{4}\/([1-9]\d{2}|0[1-9]\d|00[1-9])$/;
            return regExp.test(value);
        },

        isSpecifyPeriod: function (value, allPeriods) {
            if (EvolveQueryEditor.util.PeriodUtils.isPeriodFormat(value)) {
                return EvolveQueryEditor.util.PeriodUtils.getIndex(value, allPeriods) > -1;
            }
            return false;
        },

        getIndex: function (value, allPeriods) {
            var targetPeriod = parseInt(EvolveQueryEditor.util.PeriodUtils.processPeriod(value));
            for (var i = 0; i < allPeriods.length; i++) {
                if (allPeriods[i].Value === targetPeriod) {
                    return i;
                }
            }
            return -1;
        },

        parsePeriodFromInfo: function (value, currentPeriod, allPeriods) {
            var periodInfo = {};
            var regExp = /^(?:(PE|PH|PN|QA|QE|QH|QN|YH|YR|BE|BH|BS)|(PF|PA|YA|YF|YE|BA|BF|BK)\s*([\s+-]\d+)|(B|YK)\s*([\s+-]\d+)\s*([\s+-]\d+))(?:\s*=((?:19|20)\d{2}\/(?:[1-9]\d{2}|0[1-9]\d|00[1-9])))?$/;
            if (regExp.test(value)) {
                var parts = regExp.exec(value);
                periodInfo.type = parts[1] || parts[2] || parts[4];
                periodInfo.offset3 = parseInt(parts[3], 10) || 0;
                periodInfo.offset1 = parseInt(parts[5], 10) || 0;
                periodInfo.offset2 = parseInt(parts[6], 10) || 0;
                if (periodInfo.offset1 > periodInfo.offset2) {
                    return null;
                }
                if (parts[7]) {
                    if (isSpecifyPeriod(parts[7], allPeriods)) {
                        periodInfo.currentPeriod = parts[7];
                        periodInfo.overrided = true;
                    } else {
                        return null;
                    }
                } else {
                    periodInfo.currentPeriod = currentPeriod;
                    periodInfo.overrided = false;
                }
            } else {
                periodInfo = null;
            }
            return periodInfo;
        },

        parsePeriodInfo: function (fromValue, toValue, currentPeriod, allPeriods) {
            var periodInfo;
            if (EvolveQueryEditor.util.PeriodUtils.isSpecifyPeriod(fromValue, allPeriods)) {
                periodInfo = {};
                periodInfo.type = "P";
                periodInfo.fromValue = EvolveQueryEditor.util.PeriodUtils.processPeriod(fromValue);
                periodInfo.toValue = EvolveQueryEditor.util.PeriodUtils.processPeriod(EvolveQueryEditor.util.PeriodUtils.isSpecifyPeriod(toValue, allPeriods) ? toValue : currentPeriod);
                periodInfo.offset3 = 0;
                periodInfo.offset1 = 0;
                periodInfo.offset2 = 0;
            } else {
                var periodInfo = EvolveQueryEditor.util.PeriodUtils.parsePeriodFromInfo(fromValue, currentPeriod, allPeriods)
                if (!periodInfo) {
                    currentPeriod = EvolveQueryEditor.util.PeriodUtils.processPeriod(currentPeriod);
                    periodInfo = {};
                    periodInfo.type = "P";
                    periodInfo.fromValue = currentPeriod;
                    periodInfo.toValue = currentPeriod;
                    periodInfo.offset3 = 0;
                    periodInfo.offset1 = 0;
                    periodInfo.offset2 = 0;
                }
            }
            return periodInfo;
        },

        processPeriod: function (value) {
            if (typeof value === 'string') {
                return value.replace('/', '');
            }
            return value + "";
        },

        adjustPeriodByOffset: function (value, offset, allPeriods) {
            if (EvolveQueryEditor.util.PeriodUtils.isValidPeriod(value)) {
                var index = EvolveQueryEditor.util.PeriodUtils.getIndex(value, allPeriods);
                index = index + offset;
                if (index < 0) {
                    return EvolveQueryEditor.util.PeriodUtils.MIN;
                } else if (index >= allPeriods.length) {
                    return EvolveQueryEditor.util.PeriodUtils.MAX;
                } else {
                    return EvolveQueryEditor.util.PeriodUtils.processPeriod(allPeriods[index].Value);
                }
            } else {
                return EvolveQueryEditor.util.PeriodUtils.NA;
            }
        },

        calculateFromToValue: function (periodInfo, data) {
            var periodType = periodInfo.type;

            if (periodType === "P") {
                return periodInfo;
            } else {
                var currentPeriodValue = EvolveQueryEditor.util.PeriodUtils.processPeriod(periodInfo.currentPeriod);
                var calculatedValues = { "from": currentPeriodValue, "to": currentPeriodValue };
                if (periodType === "B") {
                    if (periodInfo.offset1) {
                        calculatedValues.from = EvolveQueryEditor.util.PeriodUtils.adjustPeriodByOffset(calculatedValues.from, periodInfo.offset1, data.Values);
                    }
                    if (periodInfo.offset2) {
                        calculatedValues.to = EvolveQueryEditor.util.PeriodUtils.adjustPeriodByOffset(calculatedValues.to, periodInfo.offset2, data.Values);
                    }
                } else if (periodType === "PF") {
                    var firstPeriod = EvolveQueryEditor.util.PeriodUtils.getFirstPeriod(currentPeriodValue, data);
                    if (periodInfo.offset3) {
                        calculatedValues.from = EvolveQueryEditor.util.PeriodUtils.adjustPeriodByOffset(firstPeriod, periodInfo.offset3, data.Values);
                        calculatedValues.to = calculatedValues.from;
                    } else {
                        calculatedValues.from = firstPeriod;
                        calculatedValues.to = firstPeriod;
                    }
                } else if (periodType === "PA") {
                    if (periodInfo.offset3) {
                        calculatedValues.from = EvolveQueryEditor.util.PeriodUtils.adjustPeriodByOffset(calculatedValues.from, periodInfo.offset3, data.Values);
                        calculatedValues.to = calculatedValues.from;
                    }
                } else if (periodType === "PE") {
                    var samePeriodLastYear = EvolveQueryEditor.util.PeriodUtils.getSamePeriodLastYear(currentPeriodValue, data);
                    calculatedValues.from = samePeriodLastYear;
                    calculatedValues.to = samePeriodLastYear;
                } else if (periodType === "PH") {
                    var previousPeriod = EvolveQueryEditor.util.PeriodUtils.getPreviousPeriod(currentPeriodValue, data);
                    calculatedValues.from = previousPeriod;
                    calculatedValues.to = previousPeriod;
                } else if (periodType === "PN") {
                    var nextPeriod = EvolveQueryEditor.util.PeriodUtils.getNextPeriod(currentPeriodValue, data);
                    calculatedValues.from = nextPeriod;
                    calculatedValues.to = nextPeriod;
                } else if (periodType === "QA") {
                    calculatedValues = EvolveQueryEditor.util.PeriodUtils.getQuarter(currentPeriodValue.slice(0, 4), EvolveQueryEditor.util.PeriodUtils.getQuarterNumber(currentPeriodValue), data);
                } else if (periodType === "QE") {
                    calculatedValues = EvolveQueryEditor.util.PeriodUtils.getQuarter(parseInt(currentPeriodValue.slice(0, 4), 10) - 1, EvolveQueryEditor.util.PeriodUtils.getQuarterNumber(currentPeriodValue), data);
                } else if (periodType === "QH") {
                    var year = EvolveQueryEditor.util.PeriodUtils.parseInt(currentPeriodValue.slice(0, 4), 10);
                    var quarter = EvolveQueryEditor.util.PeriodUtils.getQuarterNumber(currentPeriodValue);
                    if (quarter === 1) {
                        calculatedValues = EvolveQueryEditor.util.PeriodUtils.getQuarter(year - 1, 4, data);
                    } else {
                        calculatedValues = EvolveQueryEditor.util.PeriodUtils.getQuarter(year, quarter - 1, data);
                    }
                } else if (periodType === "QN") {
                    var year = parseInt(currentPeriodValue.slice(0, 4), 10);
                    var quarter = EvolveQueryEditor.util.PeriodUtils.getQuarterNumber(currentPeriodValue);
                    if (quarter === 4) {
                        calculatedValues = EvolveQueryEditor.util.PeriodUtils.getQuarter(year + 1, 1, data);
                    } else {
                        calculatedValues = EvolveQueryEditor.util.PeriodUtils.getQuarter(year, quarter + 1, data);
                    }
                } else if (periodType === "YA") {
                    calculatedValues.from = EvolveQueryEditor.util.PeriodUtils.getFirstPeriod(currentPeriodValue, data);
                    if (periodInfo.offset3) {
                        calculatedValues.to = EvolveQueryEditor.util.PeriodUtils.adjustPeriodByOffset(calculatedValues.to, periodInfo.offset3, data.Values);
                    }
                } else if (periodType === "YF") {
                    var firstPeriod = EvolveQueryEditor.util.PeriodUtils.getFirstPeriod(currentPeriodValue, data);
                    calculatedValues.from = firstPeriod;
                    if (periodInfo.offset3) {
                        calculatedValues.to = EvolveQueryEditor.util.PeriodUtils.adjustPeriodByOffset(firstPeriod, periodInfo.offset3, data.Values);
                    } else {
                        calculatedValues.to = firstPeriod;
                    }
                } else if (periodType === "YE") {
                    var samePeriodLastYear = EvolveQueryEditor.util.PeriodUtils.getSamePeriodLastYear(currentPeriodValue, data);
                    calculatedValues.from = EvolveQueryEditor.util.PeriodUtils.isValidPeriod(samePeriodLastYear) ? EvolveQueryEditor.util.PeriodUtils.getFirstPeriod(samePeriodLastYear, data) : samePeriodLastYear;
                    if (periodInfo.offset3) {
                        calculatedValues.to = EvolveQueryEditor.util.PeriodUtils.adjustPeriodByOffset(samePeriodLastYear, periodInfo.offset3, data.Values);
                    } else {
                        calculatedValues.to = samePeriodLastYear;
                    }
                } else if (periodType === "YH") {
                    var samePeriodLastYear = EvolveQueryEditor.util.PeriodUtils.getSamePeriodLastYear(currentPeriodValue, data);
                    if (EvolveQueryEditor.util.PeriodUtils.isValidPeriod(samePeriodLastYear)) {
                        calculatedValues.from = EvolveQueryEditor.util.PeriodUtils.getFirstPeriod(samePeriodLastYear, data);
                        calculatedValues.to = EvolveQueryEditor.util.PeriodUtils.getLastPeriod(samePeriodLastYear, data);
                    } else {
                        calculatedValues.from = samePeriodLastYear;
                        calculatedValues.to = samePeriodLastYear;
                    }
                } else if (periodType === "YK") {
                    calculatedValues.from = EvolveQueryEditor.util.PeriodUtils.getFirstPeriod(currentPeriodValue, data);
                    calculatedValues.to = EvolveQueryEditor.util.PeriodUtils.getLastPeriod(currentPeriodValue, data);
                    if (periodInfo.offset1) {
                        calculatedValues.from = EvolveQueryEditor.util.PeriodUtils.adjustPeriodByOffset(calculatedValues.from, periodInfo.offset1, data.Values);
                    }
                    if (periodInfo.offset2) {
                        calculatedValues.to = EvolveQueryEditor.util.PeriodUtils.adjustPeriodByOffset(calculatedValues.to, periodInfo.offset2, data.Values);
                    }
                } else if (periodType === "YR") {
                    var lastPeriod = EvolveQueryEditor.util.PeriodUtils.getLastPeriod(currentPeriodValue, data);
                    if (currentPeriodValue === lastPeriod) {
                        calculatedValues = { "from": EvolveQueryEditor.util.PeriodUtils.NA, "to": EvolveQueryEditor.util.PeriodUtils.NA };
                    } else {
                        calculatedValues.from = EvolveQueryEditor.util.PeriodUtils.getNextPeriod(currentPeriodValue, data);
                        calculatedValues.to = lastPeriod;
                    }
                } else if (periodType === "BA") {
                    calculatedValues.from = EvolveQueryEditor.util.PeriodUtils.processPeriod(data.Values[0].Value);
                    if (periodInfo.offset3) {
                        calculatedValues.to = EvolveQueryEditor.util.PeriodUtils.adjustPeriodByOffset(calculatedValues.to, periodInfo.offset3, data.Values);
                    }
                } else if (periodType === "BE") {
                    calculatedValues.from = EvolveQueryEditor.util.PeriodUtils.processPeriod(data.Values[0].Value);
                    calculatedValues.to = EvolveQueryEditor.util.PeriodUtils.getSamePeriodLastYear(currentPeriodValue, data);
                } else if (periodType === "BF") {
                    calculatedValues.from = EvolveQueryEditor.util.PeriodUtils.processPeriod(data.Values[0].Value);
                    calculatedValues.to = EvolveQueryEditor.util.PeriodUtils.getFirstPeriod(currentPeriodValue, data);
                    if (periodInfo.offset3) {
                        calculatedValues.to = EvolveQueryEditor.util.PeriodUtils.adjustPeriodByOffset(calculatedValues.to, periodInfo.offset3, data.Values);
                    }
                } else if (periodType === "BH") {
                    calculatedValues.from = EvolveQueryEditor.util.PeriodUtils.processPeriod(data.Values[0].Value);
                    calculatedValues.to = EvolveQueryEditor.util.PeriodUtils.getPreviousPeriod(currentPeriodValue, data);
                } else if (periodType === "BK") {
                    calculatedValues.from = EvolveQueryEditor.util.PeriodUtils.processPeriod(data.Values[0].Value);
                    calculatedValues.to = EvolveQueryEditor.util.PeriodUtils.getLastPeriod(currentPeriodValue, data);
                    if (periodInfo.offset3) {
                        calculatedValues.to = EvolveQueryEditor.util.PeriodUtils.adjustPeriodByOffset(calculatedValues.to, periodInfo.offset3, data.Values);
                    }
                } else if (periodType === "BS") {
                    calculatedValues.from = EvolveQueryEditor.util.PeriodUtils.processPeriod(data.Values[0].Value);
                    var samePeriodLastYear = EvolveQueryEditor.util.PeriodUtils.getSamePeriodLastYear(currentPeriodValue, data);
                    calculatedValues.to = EvolveQueryEditor.util.PeriodUtils.isValidPeriod(samePeriodLastYear) ? EvolveQueryEditor.util.PeriodUtils.getLastPeriod(samePeriodLastYear, data) : samePeriodLastYear;
                }

                periodInfo.fromValue = calculatedValues.from;
                periodInfo.toValue = calculatedValues.to;
                return periodInfo;
            }
        },

        getQuarterNumber: function (period) {
            return Math.floor((parseInt(period.slice(4), 10) - 1) / 3) + 1;
        },

        getQuarter: function (year, quarter, data) {
            if (year < parseInt(EvolveQueryEditor.util.PeriodUtils.processPeriod(data.Values[0].Value).slice(0, 4))) {
                return { "from": EvolveQueryEditor.util.PeriodUtils.MIN, "to": EvolveQueryEditor.util.PeriodUtils.MIN };
            } else if (year > parseInt(EvolveQueryEditor.util.PeriodUtils.processPeriod(data.Values[data.Values.length - 1].Value).slice(0, 4))) {
                return { "from": EvolveQueryEditor.util.PeriodUtils.MAX, "to": EvolveQueryEditor.util.PeriodUtils.MAX };
            } else {
                var lastPeriod = EvolveQueryEditor.util.PeriodUtils.getLastPeriod(year + "001", data);
                var result;
                if (quarter === 1) {
                    result = { "from": year + "001", "to": year + "003" };
                } else if (quarter === 2) {
                    result = { "from": year + "004", "to": year + "006" };
                } else if (quarter === 3) {
                    result = { "from": year + "007", "to": year + "009" };
                } else {
                    result = { "from": year + "010", "to": lastPeriod };
                }
                if (result.from > lastPeriod) {
                    return { "from": EvolveQueryEditor.util.PeriodUtils.MAX, "to": EvolveQueryEditor.util.PeriodUtils.MAX };
                } else {
                    if (result.to > lastPeriod) {
                        return { "from": result.from, "to": lastPeriod };
                    } else {
                        return result;
                    }
                }
            }
        },

        getNextPeriod: function (currentPeriodValue, data) {
            currentPeriodValue = parseInt(currentPeriodValue, 10);
            var matched;
            Ext.each(data.Values, function (index, period) {
                if (period.Value === currentPeriodValue) {
                    matched = index + 1;
                    return false;
                }
            });
            return data.Values[matched] ? EvolveQueryEditor.util.PeriodUtils.processPeriod(data.Values[matched].Value) : EvolveQueryEditor.util.PeriodUtils.MAX;
        },

        getPreviousPeriod: function (currentPeriodValue, data) {
            var matched;
            currentPeriodValue = parseInt(currentPeriodValue, 10);
            Ext.each(data.Values, function (index, period) {
                if (period.Value === currentPeriodValue) {
                    return false;
                } else {
                    matched = period;
                }
            });
            return matched ? EvolveQueryEditor.util.PeriodUtils.processPeriod(matched.Value) : EvolveQueryEditor.util.PeriodUtils.MIN;
        },

        getSamePeriodLastYear: function (currentPeriodValue, data) {
            var period = (parseInt(currentPeriodValue.slice(0, 4)) - 1) + currentPeriodValue.slice(4);
            return (period < data.Values[0].Value ? EvolveQueryEditor.util.PeriodUtils.MIN : period);
        },

        getFirstPeriod: function (currentPeriodValue, data) {
            var targetYear = currentPeriodValue.slice(0, 4);
            var matched;
            Ext.each(data.Values, function (index, period) {
                if (EvolveQueryEditor.util.PeriodUtils.processPeriod(period.Value).slice(0, 4) === targetYear) {
                    matched = period;
                    return false;
                }
            });
            return EvolveQueryEditor.util.PeriodUtils.processPeriod(matched.Value);
        },

        getLastPeriod: function (currentPeriodValue, data) {
            var targetYear = currentPeriodValue.slice(0, 4);
            var matched;
            Ext.each(data.Values, function (index, period) {
                if (EvolveQueryEditor.util.PeriodUtils.processPeriod(period.Value).slice(0, 4) > targetYear) {
                    return false;
                } else {
                    matched = period;
                }
            });
            return EvolveQueryEditor.util.PeriodUtils.processPeriod(matched.Value);
        }
    }
});