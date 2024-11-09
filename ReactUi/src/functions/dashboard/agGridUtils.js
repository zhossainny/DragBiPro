import { formatMoney, formatDate, formatValue } from "../dataUtils";
import { AG_GRID_ROW_HEIGHT, AG_GRID_AUTO_COLUMN } from "../../configuration/constants";
import moment from "moment";
import ConditionalFormatValidator from "./ConditionalFormatValidator";
import DataBarCellRenderer from './../../components/dashboard/widget/grid/DataBarCellRenderer';
import * as math from 'mathjs';
import memoize from 'memoize-one';
import * as _ from 'lodash';

export function buildColumnDefs(headerNames, gridSettings = null) {
    let columnDefs = [];
    let counter = 0;
    for (let header of headerNames) {
        let def = {
            headerName: header,
            field: header
        };
        let columnProps = getColumnProps(gridSettings, header);
        if (columnProps && columnProps.caption)
            def.headerName = columnProps.caption;
        if (columnProps && columnProps.type === 'date')
            def.comparator = dateComparator;
        def.filterParams = { newRowsAction: 'keep' };
        if (counter === 0) {
            def.sort = "asc";
        }
        def.cellStyle = function (params) {
            let style = getStyle(def.field, gridSettings);
            if (!style) return null;
            let node = params.node;
            if (node && node.id && node.id.includes('rowGroupFooter')) {
                delete style.backgroundColor;
            }
            return style;
        };
        columnDefs.push(def);
        counter++;
    }
    return columnDefs;
}

export function getConditionalFormatting(gridSettings, headerName, data, value) {
    if (gridSettings.conditionalFormatting) {
        let conditionalFormatValidator = new ConditionalFormatValidator(gridSettings.conditionalFormatting.formats);
        let conditionalFormat = conditionalFormatValidator.getColumnFormatting(headerName, data, value);
        if (conditionalFormat) return conditionalFormat;
    }
    return null;
}

export function hasGroupColumn(gridColumnApi) {
    return gridColumnApi.getAllDisplayedColumns().find(col => col.colId === AG_GRID_AUTO_COLUMN);
}

export function getStyle(field, gridSettings) {
    let props = getColumnProps(gridSettings, field);
    let style = {};
    if (props) {
        if (props.color)
            style.color = toStringRGBA(props.color);
        if (props.backgroundColor) {
            style.backgroundColor = toStringRGBA(props.backgroundColor);
        }
        if (props.fontSize) {
            style.fontSize = props.fontSize.toString().endsWith('px') ? props.fontSize : props.fontSize + 'px';
            style.fontSize = style.fontSize + " !important";
        }

        if (props.fontStyle) {
            if (props.fontStyle.toString().startsWith('bold') || !isNaN(props.fontStyle)) {
                style.fontWeight = props.fontStyle;
            } else {
                style.fontStyle = props.fontStyle;
            }
        }
    }
    if (gridSettings.rowHeight && gridSettings.rowHeight !== AG_GRID_ROW_HEIGHT) {
        style.lineHeight = Math.round(gridSettings.rowHeight * 0.9) + 'px';
    }
    return style;
}

export function getColumnProps(gridSettings, field) {
    if (_.has(gridSettings, 'view.columnProperties')) {
        if (Array.isArray(gridSettings.view.columnProperties)) {
            let properties = {};
            gridSettings.view.columnProperties.forEach(prop => {
                properties[prop[0]] = prop[1];
            });
            gridSettings.view.columnProperties = properties;
        }
        return field ? gridSettings.view.columnProperties[field] : gridSettings.view.columnProperties;
    }
    return null;
}

function numberFormatter(gridSettings) {
    return params => {
        if (typeof params.value === 'undefined') {
            return '';
        }
        let props = getColumnProps(gridSettings, params.colDef.field);
        if (props && props.type === 'percentage') {
            return formatValue(params.value, '%', props.decimalPrecision);
        }
        if (props && props.formatDollar) {
            return formatMoney(params.value, props.decimalPrecision, '$');
        }
        if (props && props.type === 'text') {
            return params.value;
        }
        if (gridSettings.formatDollar &&
            params.colDef &&
            params.colDef.headerName &&
            params.colDef.headerName.toString().toLowerCase().includes('$')) {
            return formatMoney(params.value, null, '$');
        }
        let precision = gridSettings.decimalPrecision;
        if (props && props.decimalPrecision)
            precision = props.decimalPrecision;
        let number = Number(params.value).toFixed(precision);
        let parts = number.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    };
}

function dateFormatter(gridSettings) {
    return params => {
        let props = getColumnProps(gridSettings, params.colDef.field);
        if (props && props.type === 'date') {
            return formatDate(params.value, props.dateFormat);
        }
        return params.value;
    };
}

export function buildRows(rowData, columnDefs, gridSettings) {
    let rows = [];
    enrichColumnDefinitions(rowData, columnDefs, gridSettings);
    rowData.forEach(data => {
        let row = {};
        data.forEach((value, index) => {
            const def = columnDefs[index];
            if (def.isNumeric) {
                row[def.field] = Number(value);
            } else {
                row[def.field] = value;
            }
        });
        rows.push(row);
    });

    return rows;
}

function enrichColumnDefinitions(allRows, columnDefs, gridSettings) {
    if (allRows.length) {
        let row = allRows[0];
        if (row.length) {
            row.forEach((value, index) => {
                const def = columnDefs[index];
                let style = getStyle(def.field, gridSettings);
                if (!style || !style.fontSize)
                    def.cellClass = "font-size-" + gridSettings.fontSize;
                let columnProps = getColumnProps(gridSettings, def.field);
                let columnType = columnProps ? columnProps.type : null;
                if ((_.isFinite(value) && columnType !== 'text') || columnType === 'numeric') {
                    def.isNumeric = true;
                    def.type = "numericColumn";
                    def.filter = "agNumberColumnFilter";
                    def.enableValue = true;
                    def.aggFunc = "sum";
                    def.valueFormatter = numberFormatter(gridSettings);
                    def.cellStyle = params => cellStyleAggregator(gridSettings, params, true);
                    enableDataBar(columnProps, def, allRows, gridSettings.rowHeight, index);
                    enableAbsoluteSort(columnProps, def);
                } else {
                    def.enableRowGroup = true;
                    def.enablePivot = true;
                    def.enableValue = true;
                    def.cellStyle = params => cellStyleAggregator(gridSettings, params);
                    if (columnType === 'date') {
                        def.valueFormatter = dateFormatter(gridSettings);
                    }
                }
            });
        }
    }
}

function enableDataBar(columnProps, columnDef, rows, rowHeight, columnIndex) {
    if (columnProps && columnProps.dataBar) {
        columnDef.cellRendererFramework = DataBarCellRenderer;
        columnDef.cellRendererParams = { dataSet: rows.map(row => row[columnIndex]), rowHeight };
    }
}

function enableAbsoluteSort(columnProps, columnDef) {
    if(columnProps && columnProps.absoluteSort) {
        columnDef.comparator = (valueA, valueB) => math.compare(math.abs(valueA), math.abs(valueB));
    } else {
        columnDef.comparator = null;
    }
}

function cellStyleAggregator(gridSettings, params, numeric = false) {
    let finalStyle = {};
    if (numeric) {
        let color = params.value < 0.0 ? 'red' : 'green';
        finalStyle = { color: color, textAlign: 'right' };
    }

    let style = getStyle(params.colDef.field, gridSettings);
    if (style) {
        finalStyle = { ...finalStyle, ...style };
    }

    let conditionalStyle = getConditionalFormatting(gridSettings, params.colDef.headerName, params.data, params.value);
    if (conditionalStyle) {
        finalStyle = { ...finalStyle, ...conditionalStyle };
    }

    if (params.node.rowPinned) {
        const { backgroundColor, ...others } = finalStyle;
        return others;

    }

    return finalStyle;
}

function dateComparator(rawDate1, rawDate2) {
    let date1 = moment(rawDate1);
    let date2 = moment(rawDate2);
    if (date1.isBefore(date2)) {
        return -1;
    }
    if (date1.isAfter(date2)) {
        return 1;
    }

    return 0;
}

export function extractValueColumns(columnApi) {
    if (!columnApi.isPivotMode()) return [];
    let allColumns = columnApi.getAllGridColumns();
    let valueColumns = [];
    allColumns.forEach(col => {
        if (col.visible && col.colDef.field && col.colDef.colId !== AG_GRID_AUTO_COLUMN) {
            valueColumns.push(col.colDef.field);
        }
    });
    return valueColumns;
}

export function toStringRGBA(rgbaColor) {
    return `rgba(${rgbaColor.r}, ${rgbaColor.g}, ${rgbaColor.b}, ${rgbaColor.a})`;
}

export function scaleNumber(value, targetMax, rangeMin, rangeMax) {
    // targetMin is always 0 thus omitted, ((X - Rmin)/(Rmax - Rmin))*Tmax
    return math.chain(value).subtract(rangeMin).divide(rangeMax - rangeMin).multiply(targetMax).done();
}

export const memoizedScale0 = memoize((absoluteMax, rangeMin, rangeMax, dataSet) => {
    if (dataSet.every(value => value >= 0)) {
        return 0;
    }
    if (dataSet.every(value => value <= 0)) {
        return absoluteMax;
    }
    return scaleNumber(0, absoluteMax, rangeMin, rangeMax);
});

export function getSortedCopy(array) {
    let copy = [...array];
    return copy.sort();
}

export const memoizedMin = memoize(dataSet => math.min(dataSet));
export const memoizedMax = memoize(dataSet => math.max(dataSet));
