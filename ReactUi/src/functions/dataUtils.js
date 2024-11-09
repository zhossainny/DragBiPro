import * as Papa from 'papaparse';
import * as constants from "../configuration/constants";
import moment from 'moment';
import * as accounting from 'accounting';
import * as mathjs from 'mathjs';

export function parseCSVasJson(rawData) {
    if (!rawData) return null;
    return Papa.parse(rawData, { skipEmptyLines: true, trimHeaders: true, header: true, dynamicTyping: true }).data;
}

export function getDataType(data) {
    if (!data) return constants.DATA_TYPE_UNKNOWN;
    if (data.toString().startsWith('{')) return constants.DATA_TYPE_JSON;
    else return constants.DATA_TYPE_CSV; //default
}

export function formatMoney(value, dp, currency = '') {
    let str = '';
    if (value !== null) {
        let absNumber = mathjs.chain(value).abs();
        if (absNumber.done() > 999999)
            str = currency + accounting.formatNumber(absNumber.divide(1000000).done(), dp) + 'M';
        else if (mathjs.abs(value) > 999)
            str = currency + accounting.formatNumber(absNumber.divide(1000).done(), dp) + 'K';
        else
            str = currency + accounting.formatNumber(absNumber.done(), dp);
        if (mathjs.sign(value) === -1)
            str = '-' + str;
    }
    return str;
}

export function formatValue(value, formatType, dp = 2) {
    let str = '';
    if (value !== null) {
        if (formatType === '%') {
            str = accounting.formatNumber(mathjs.multiply(value, 100), dp) + '%';
        }
        else if (formatType === '$')
            str = formatMoney(value, dp, '$');
        else
            str = accounting.formatNumber(value, dp);
    }
    return str;
}

export function formatDate(value, dateFormat) {
    try {
        return moment(value).format(dateFormat ? dateFormat : constants.AG_GRID_DEFAULT_DATE_FORMAT);
    } catch (e) {
        return value;
    }
}
