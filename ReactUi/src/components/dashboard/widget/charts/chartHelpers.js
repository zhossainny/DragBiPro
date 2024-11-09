import moment from 'moment';
import * as _ from 'lodash';
import { formatValue } from '../../../../functions/dataUtils';
import { findConfigItemsInExpression } from './../../../../functions/utils';
import { toStringRGBA } from '../../../../functions/dashboard/agGridUtils';

export function legendLabelFormatter() {
    let widgetContext = this;
    return captionForName(widgetContext);
}


export function tooltipFormatter() {
    let widgetContext = this;
    return function () {
        return tooltipFormatInnerHtml(this, widgetContext);
    };
}

export function sortDataSeries(series) {
    series.sort(function (a, b) {
        if (a[0] === b[0]) {
            return 0;
        } else {
            return a[0] > b[0] ? 1 : -1;
        }
    });
}

export function setSeriesColor(series, yOption) {
    if(yOption.color) {
        series.color = toStringRGBA(yOption.color);
    }
}

export function isValidDate(value) {
    return !_.isNumber(value) && !_.isNil(value) && !containsSpecialCharacters(value) && moment(value).isValid();
}

export function isMultiSeriesChart(settings) {
    return settings.series && !settings.series.toString().startsWith("--");
}

export function getCaption(userProvidedCaption, configItems) {
    let parsedCaption = userProvidedCaption ? userProvidedCaption : '';
    let matchingConfigItems = findConfigItemsInExpression(parsedCaption, configItems);
    matchingConfigItems.forEach(match => {
        parsedCaption = parsedCaption.replace(`{${match.key}}`, match.value);
    });
    return parsedCaption.toUpperCase();
}

function containsSpecialCharacters(value) {
    return value.match(/[%$]/g);
}

function captionForName(widgetContext) {
    return function() {
        let matchingYOption = widgetContext.props.settings.yOptions && widgetContext.props.settings.yOptions.find(option => option.y === this.name);
        if (matchingYOption && matchingYOption.caption) {
            return getCaption(matchingYOption.caption, widgetContext.props.configItems);
        }
        return this.name;
    };
}

function tooltipFormatInnerHtml(tooltipContext, widgetContext) {
    let settings = widgetContext.props.settings;
    let data = widgetContext.props.dataSource.data;
    let xAxisType = widgetContext.state.options.xAxis.type;
    let xLabel = xAxisType === 'datetime' ? moment(tooltipContext.x).format('DD MMM YYYY') : tooltipContext.x;
    return tooltipContext.points ? 
    [
        xLabel, 
        ...tooltipContext.points.map(point => tooltipAndAdditionalItems(point, settings, data, captionForName(widgetContext).call(point.series)))
    ] : 
    [
        xLabel, 
        '<br/>',
        tooltipAndAdditionalItems(tooltipContext, settings, data, captionForName(widgetContext).call(tooltipContext.series))
    ];
}

function tooltipAndAdditionalItems(context, settings, data, seriesName) {
    let additionalFields = '';
    let formattedYValue = formatTooltipValue(context.y, settings);
    let tooltipBody = `${seriesName}: <b>${formattedYValue}</b>`;
    if (settings.tooltip && settings.tooltip.additionalItems) {
        let filteredData = data.find(x => x[settings.x] === context.key && x[context.series.name] === context.y);
        if (filteredData) {
            settings.tooltip.additionalItems.forEach(field => additionalFields = additionalFields + '<br>' + field + '<b>' + ':  ' + filteredData[field] + '</b>');
        }
    }
    return tooltipBody + additionalFields;
}

function formatTooltipValue(value, settings) {
    if (_.isFinite(value) && settings.tooltip && _.isFinite(settings.tooltip.precision)) {
        return formatValue(value, null, settings.tooltip.precision);
    }

    return value;
}


