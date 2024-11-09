import {toStringRGBA} from "./agGridUtils";

class ConditionalFormatValidator {

    constructor(conditionalFormats) {
        this._formats = conditionalFormats;
    }

    getColumnFormatting(headerName, data, cellValue) {
        if (!headerName || !data) return null;
        let formats = this._formats.filter(x => x.columnName === headerName);
        if (formats.length === 0) return null;
        let formatting = null;
        for (let format of formats) {
            let result = this._validateConditionalFormat(format, data, cellValue);
            if (result) {
                if (!formatting) formatting = {};
                formatting = Object.assign(formatting, result);
            }
        }
        return formatting;
    }

    _validateConditionalFormat(conditionalFormat, data, cellValue){
        let results = [];
        for (let entry of conditionalFormat.entries) {
            results.push(this._validateCondition(entry, data, cellValue));
        }
        let conditionValid = false;
        if (conditionalFormat.type === 'or') {
            conditionValid = !!results.find(x => !!x);
        } else {
            conditionValid = results.every(x => !!x);
        }
        if (conditionValid) {
            let formatting = {};
            if (conditionalFormat.color)
                formatting.color = toStringRGBA(conditionalFormat.color);
            if (conditionalFormat.backgroundColor)
                formatting.backgroundColor = toStringRGBA(conditionalFormat.backgroundColor);
            return formatting;
        }
        return null;
    }

    _validateCondition(conditionEntry, data, cellValue) {
        let conditionValue = this._getConditionValue(conditionEntry, data);
        let conditionMet = false;
        switch(conditionEntry.condition) {
            case 'Equals':
                conditionMet = conditionValue === cellValue;
                break;
            case 'Not Equal':
                conditionMet = conditionValue !== cellValue;
                break;
            case 'Less than':
                conditionMet = conditionValue > cellValue;
                break;
            case 'Less than or equals':
                conditionMet = conditionValue >= cellValue;
                break;
            case 'Greater than':
                conditionMet = conditionValue < cellValue;
                break;
            case 'Greater than or equal':
                conditionMet = conditionValue <= cellValue;
                break;
            default:
        }
        return conditionMet;
    }

    _getConditionValue(condition, data) {
        if (condition.value) return condition.value;
        if (condition.field) return data[condition.field];
        return null;
    }
}

export default ConditionalFormatValidator;