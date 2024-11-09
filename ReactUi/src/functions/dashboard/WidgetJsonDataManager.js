import { formatValue } from "../dataUtils";
import { buildColumnDefs, buildRows } from "./agGridUtils";
import WidgetDataManager from "./WidgetDataManager";

class WidgetJsonDataManager extends WidgetDataManager {
    constructor(rawData, propertyPath, dataFilters = null) {
        super(rawData, dataFilters);
        if (!rawData) {
            throw new Error('Empty data source provided.');
        }
        this._propertyPath = propertyPath;
        this._json = null;
    }

    getJsonProperties(obj) {
        if (!obj) obj = this._getParsedJson();
        if (typeof obj !== 'object') return [];
        return Object.getOwnPropertyNames(obj);
    }

    getColumnNames() {
        let columnNames = [];
        if (!this.isValidData()) return null;
        if (!this._propertyPath) return [];
        let obj = this._getParsedJson()[this._propertyPath];
        if (obj) {
            if (Array.isArray(obj) && obj.length) {
                columnNames = this.getJsonProperties(obj[0]);
            } else {
                columnNames = this.getJsonProperties(obj);
            }
        }

        return columnNames;
    }


    getAgGridDataSource(gridSettings, version = 0) {
        if (!this.isValidData()) return null;

        try {
            let columnNames = this.getColumnNames();
            let columnDefs = buildColumnDefs(columnNames, gridSettings);
            let objFromPath = this._getParsedJson()[this._propertyPath];
            if (!objFromPath || !Array.isArray(objFromPath))
                throw new Error('Selected object is not an Array');

            let plainRowData = [];
            objFromPath = this._filterData(objFromPath);
            for (let rowObj of objFromPath) {
                let tmp = [];
                for (let columnName of columnNames) {
                    tmp.push(rowObj[columnName]);
                }
                plainRowData.push(tmp);
            }
            let rows = buildRows(plainRowData,
                columnDefs,
                gridSettings);
            return {
                columnDefs: columnDefs,
                rows: rows,
                version: version + 1,
                filtered: this._filterSet()
            };
        } catch (e) {
            throw new Error('Grid data source error. Selected path must be an ARRAY.');
        }
    }

    getHighChartsDataSource(version = 0) {
        if (!this.isValidData()) return null;

        let rawData = this._getParsedJson();
        let objFromPath = rawData[this._propertyPath];
        if (!objFromPath || !Array.isArray(objFromPath))
            throw new Error('Selected object is not an Array');
        objFromPath = this._filterData(objFromPath);
        return {
            version: version + 1,
            data: objFromPath,
            filtered: this._filterSet(),
            chartOptions: rawData.chartOptions
        };
    }

    getPercentagePieDataSource(settings, version = 0) {
        if (!this.isValidData()) return { version: version, data: null };
        let result = [];
        let path = settings.path;
        if (!path) return { version: version, data: null };
        let val = this._getParsedJson()[path];
        let formatted = val;
        if (Math.abs(val) < 0 || Math.abs(val) > 1) {
            throw new Error('Expecting a value between 0 and 100 (abs). Not ' + val);
        }
        if (!isNaN(val)) {
            formatted = formatValue(val * 100, null, 0);
        } else {
            throw new Error(val + ' is not a percent.');
        }
        result.push({
            raw: val,
            formatted: formatted
        });

        return {
            version: version + 1,
            data: result
        };
    }

    getMetricDataSource(settings, version = 0) {
        if (!this.isValidData()) return [];
        let result = [];
        if (settings.type === 'numeric') {
            for (let path of settings.paths) {
                let val = this._getParsedJson()[path];
                let formatted = val;
                if (settings.formatNumbers && !isNaN(val))
                    formatted = formatValue(val, settings.formatter, settings.decimalPrecision);
                result.push({
                    raw: val,
                    formatted: formatted
                });
            }
        }
        else if (settings.type === 'text') {
            for (let path of settings.paths) {
                let val = this._getParsedJson()[path];
                result.push({
                    raw: val,
                    formatted: val
                });
            }
        }
        return {
            version: version + 1,
            data: result
        };
    }

    _getParsedJson() {
        if (!this._json) {
            this._data = this._data.toString().replace('NaN', 'null'); //let's make it a valid JSON first
            this._json = JSON.parse(this._data);
        }
        return this._json;
    }
}

export default WidgetJsonDataManager;