import * as dataUtils from "../dataUtils";

class WidgetDataManager {
    constructor(rawData, dataFilters = null) {
        if (!rawData) {
            throw new Error('Empty data source provided.');
        }
        this._data = rawData;
        this._dataFilters = dataFilters;
    }

    isValidData() {
        return !!this._data;
    }

    getDataType() {
        return dataUtils.getDataType(this._data);
    }

    _filterData(data) {
        if (this._filterSet() && data) {
            let filteredData = [];
            data.forEach(obj => {
                let pass = false;
                for (let filter of this._dataFilters) {
                    if (filter.value === null) {
                        pass = true;
                        continue;
                    }
                    let prop = filter.field;
                    if (filter.value && filter.value.includes(',')) {
                        let values = filter.value.split(',');
                        if (obj.hasOwnProperty(prop) && values.indexOf(obj[prop]) !== -1) {
                            pass = true;
                            continue;
                        }
                    }
                    else if (obj.hasOwnProperty(prop) && obj[prop] === filter.value) {
                        pass = true;
                        continue;
                    }
                    pass = false;
                    break;
                }
                if (pass)
                    filteredData.push(obj);
            });
            return filteredData;
        }
        return data;
    }

    _filterSet() {
        return this._dataFilters && this._dataFilters.length > 0;
    }
}

export default WidgetDataManager;