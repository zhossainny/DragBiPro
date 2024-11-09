import { parseCSVasJson } from "../dataUtils";
import { buildColumnDefs, buildRows } from "./agGridUtils";
import * as constants from '../../configuration/constants';
import WidgetDataManager from "./WidgetDataManager";

class WidgetCsvDataManager extends WidgetDataManager {
    constructor(rawData, dataFilters = null) {
        super(rawData, dataFilters);

        this._csv = null;
        this._columnNames = null;
    }

    _getParsedCsv() {
        if (!this._csv) {
            this._csv = parseCSVasJson(this._data);
        }
        return this._csv;
    }

    getColumnNames() {
        if (!this.isValidData()) return null;
        if (this._columnNames) return this._columnNames;
        if (this.getDataType() === constants.DATA_TYPE_CSV) {
            this._columnNames = Object.getOwnPropertyNames(this._getParsedCsv()[0]);
            return this._columnNames;
        }
        return null;
    }

    getAgGridDataSource(gridSettings, version = 0) {
        if (!this.isValidData()) return null;
        let columnNames = this.getColumnNames();
        let columnDefs = null;
        let plainRowData = [];
        if (this.getDataType() === constants.DATA_TYPE_CSV) {
            columnDefs = buildColumnDefs(columnNames, gridSettings);
            let rowModels = this._getParsedCsv();
            rowModels = this._filterData(rowModels);
            for (let rowObj of rowModels) {
                let tmp = [];
                for (let columnName of columnNames) {
                    tmp.push(rowObj[columnName]);
                }
                plainRowData.push(tmp);
            }
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
    }

    getHighChartsDataSource(version = 0) {
        if (!this.isValidData()) return null;

        let chartDs = null;
        if (this.getDataType() === constants.DATA_TYPE_CSV) {
            let json = parseCSVasJson(this._data);
            if (!json) {
                throw new Error('Failed to parse the file.');
            }
            json = this._filterData(json);
            chartDs = {
                version: version + 1,
                data: json,
                filtered: this._filterSet()
            };
        }
        return chartDs;
    }
}

export default WidgetCsvDataManager;