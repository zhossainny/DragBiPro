import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
//import Highcharts from 'highcharts';
import '../../../../configuration/HighChartsLighTheme';
import * as widgetActions from "../../../../actions/dashboardWidgetActions";
import * as dashboardActions from "../../../../actions/dashboardActions";
import { formatMoney } from "../../../../functions/dataUtils";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import { AXIS_POSITION_LEFT, AXIS_POSITION_RIGHT, DEFAULT_COLORS } from './chart-constants';
import * as _ from 'lodash';
import * as accounting from 'accounting';
import { legendLabelFormatter, tooltipFormatter, isMultiSeriesChart, isValidDate, sortDataSeries, getCaption, setSeriesColor } from './chartHelpers';
import * as Highcharts from 'highcharts';
import highcharts3d from 'highcharts/highcharts-3d'
highcharts3d(Highcharts);
import HighStocks from 'highcharts/highstock'
import Funnel from 'highcharts/modules/funnel'
Funnel(Highcharts);

export class HighChartWidget extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            options: null,
            resizeId: null,
            revision: 0
        };

        this.updateRevision = this.updateRevision.bind(this);
    }
    componentDidMount() {
        this.buildChartAndHandleErrors();
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.dataSource.version !== prevProps.dataSource.version) {
            this.buildChartAndHandleErrors();
        }
        if (this.props.resizeEvents &&
            this.chart &&
            this.props.container.tab.isActive) {

            const unconsumedEvent = this.props.resizeEvents.find(event => event.componentId === this.props.id);
            if (unconsumedEvent) {
                this.chart.reflow();
                console.log('#### resizing!');
                this.props.actions.markResizeEventAsConsumed(unconsumedEvent.eventId);
            }
        }
    }

    updateRevision() {
        this.setState({ revision: this.state.revision + 1 });
        console.log('updating revision: ' + this.state.revision + 1);
    }

    getXAxisSettings(xLabel) {
        let type = this.getXAxisType(xLabel);
        let xAxisOptions = {
            title: {
                enabled: xLabel,
                text: xLabel
            },
            type,
            crosshair: this.props.settings.crosshair && this.props.settings.crosshair.enabled

        };
        return xAxisOptions;
    }

    labelFormatter() {
        let point = this.point;
        return '<b>' + point.name + '</b><br>' +
            accounting.toFixed(point.percentage, 2) +
            ' %<br>' + formatMoney(point.y, 2);
    }

    getXAxisType(xLabel) {
        if (xLabel && this.props.dataSource.data.length > 0) {
            if (isValidDate(this.props.dataSource.data[0][xLabel])) {
                return 'datetime';
            }
        }
        return 'category';
    }

    getYAxisSettings() {
        const mappedYOptions = this.props.settings.yOptions.map(option =>
            ({ title: { text: getCaption(option.caption, this.props.configItems) }, opposite: option.position === AXIS_POSITION_RIGHT ? true : false }));
        const countByOpposite = _.countBy(mappedYOptions, 'opposite');
        const uniqueAxes = _.uniqBy(mappedYOptions, 'opposite');
        // Reset axis title to '' when there's more than one axis placed on the same side
        uniqueAxes.forEach(axis => {
            if (countByOpposite[axis.opposite] > 1) {
                axis.title.text = '';
            }
            axis.crosshair = this.props.settings.crosshair && this.props.settings.crosshair.enabled;
        });
        return _.orderBy(uniqueAxes, ['opposite'], ['asc']);
    }

    getChartOptions() {
        let userProvidedCaption = this.props.settings.caption ? getCaption(this.props.settings.caption, this.props.configItems) : this.props.title;
        let title = this.props.dataSource.filtered && this.props.dataFilter.value ? this.props.dataFilter.value : userProvidedCaption;
        let chartOptions = {
            time: {
                useUTC: false
            },
            title: {
                text: title
            },
            chart: {
                type: this.props.settings.yOptions[0].type,
                options3d: {
                    enabled: this.props.settings.enabled3d,
                    alpha: this.props.settings.alpha,
                    beta: this.props.settings.beta,
                    depth:50
                },
                animation: false,
                resetZoomButton: {
                    theme: {
                        display: 'none'
                    }
                }
            },
            colors: DEFAULT_COLORS,
            xAxis: this.getXAxisSettings(this.props.settings.x),
            yAxis: this.getYAxisSettings(),
            tooltip: {
                ...(this.props.settings.tooltip),
                formatter: tooltipFormatter.bind(this)()
            },
            legend: {
                ...(this.props.settings.legend),
                labelFormatter: legendLabelFormatter.bind(this)()
            },credits: {enabled:false},
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    depth: 35,
                    innerSize: 100,
                    dataLabels: {
                        enabled: true,
                        formatter: this.labelFormatter,
                        style: { fontWeight: '400' }
                    },
                    series: {
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}</b> ({point.y:,.0f})',
                            allowOverlap: true,
                            y: 10
                        },
                        center: ['40%', '50%'],
                        neckWidth: '30%',
                        neckHeight: '0%',
                        width: '50%'
                    },
                    showInLegend: true
                }
            }
        };
        this.enhanceWithPlotLines(chartOptions);
        this.enhanceWithZoom(chartOptions);

        return chartOptions;
    }
    getStockOptions() {
        let userProvidedCaption = this.props.settings.caption ? getCaption(this.props.settings.caption, this.props.configItems) : this.props.title;
        let title = this.props.dataSource.filtered && this.props.dataFilter.value ? this.props.dataFilter.value : userProvidedCaption;
        let chartOptions = {
            time: {
                useUTC: false
            },
            title: {
                text: title
            },
            rangeSelector: {
                selected: 1
            },
            colors: DEFAULT_COLORS,
            // xAxis: this.getXAxisSettings(this.props.settings.x),
            // yAxis: this.getYAxisSettings(),
            tooltip: {
                ...(this.props.settings.tooltip),
                formatter: tooltipFormatter.bind(this)()
            },
            legend: {
                ...(this.props.settings.legend),
                labelFormatter: legendLabelFormatter.bind(this)()
            },credits: {enabled:false},

        };

        return chartOptions;
    }

    enhanceWithZoom(currentOptions) {
        if (_.has(this.props.settings, 'zoom.enabled') && this.props.settings.zoom.enabled && currentOptions.xAxis.type === 'datetime') {
            currentOptions.chart.zoomType = 'x';
        }
    }

    enhanceWithPlotLines(currentOptions) {
        if (_.has(this.props.settings, 'plotLines.enabled') && _.has(this.props.dataSource, 'chartOptions.plotLines') && this.props.settings.plotLines.enabled) {
            if (this.props.dataSource.chartOptions.plotLines.x) {
                currentOptions.xAxis.plotLines = this.props.dataSource.chartOptions.plotLines.x.map(value => ({ color: '#ce3948', value, width: 2 }));
            }
        }
    }

    buildSingleSeriesData() {
        let options = this.props.settings;
        let rowObjects = this.props.dataSource.data;
        let series = [];
        let uniqPositions = _.uniq(options.yOptions.map(option => _.isNil(option.position) ? AXIS_POSITION_LEFT : option.position));
        options.yOptions.forEach(yOption => {
            let singleSeriesData = [];
            rowObjects.forEach(row => this.createPoint(singleSeriesData, row, options, yOption));
            if (options.sortXAxis) {
                sortDataSeries(singleSeriesData);
            }
            let seriesObject = {
                name: yOption.y,
                data: singleSeriesData,
                type: (yOption.type==='timeseries'|| yOption.type==='funnel')?'':yOption.type,
                yAxis: (uniqPositions.length > 1 && yOption.position === AXIS_POSITION_RIGHT) ? 1 : 0
            };
            setSeriesColor(seriesObject, yOption);
            series.push(seriesObject);
        });
        return series;
    }

    buildMultiSeriesData() {
        let options = this.props.settings;
        let rowObjects = this.props.dataSource.data;
        let names = new Set();
        rowObjects.forEach(row => names.add(row[options.series]));
        let multiSeries = [];
        let uniqPositions = _.uniq(options.yOptions.map(option => _.isNil(option.position) ? AXIS_POSITION_LEFT : option.position));
        options.yOptions.forEach((yOption, index) => {
            for (let seriesName of names) {
                let filteredRows = rowObjects.filter(row => row[options.series] === seriesName);
                let seriesData = [];
                filteredRows.forEach(row => this.createPoint(seriesData, row, options, yOption));
                if (options.sortXAxis) {
                    this.sortDataSeries(seriesData);
                }

                let seriesObject = {
                    name: seriesName,
                    data: seriesData,
                    type: (yOption.type==='timeseries'|| yOption.type==='funnel')?'':yOption.type,
                    yAxis: (uniqPositions.length > 1 && yOption.position === AXIS_POSITION_RIGHT) ? 1 : 0
                }
                setSeriesColor(seriesObject, yOption);
                multiSeries.push(seriesObject);
            }
        });
        return multiSeries;
    }

    createPoint(pointArray, row, options, yOption) {
        let x = '';
        if (options.x) {
            x = row[options.x.toString()];
            if (isValidDate(x)) {
                x = moment(x).valueOf();
            }
        }
        let y = _.toNumber(row[yOption.y]);
        let existingVal = pointArray.find(point => point && point.length > 0 && point[0] === x);
        if (existingVal && yOption.type !== 'scatter') {
            for (let point of pointArray) {
                if (point[0] === x) { //x
                    point[1] = existingVal[1] + y; //y
                    break;
                }
            }
        } else {
            pointArray.push([x, y]);
        }
    }

    buildChartAndHandleErrors() {
        try {
            this.buildChart();
        } catch (e) {
            let error = 'Error building chart\'s data source';
            console.error(e);
            this.props.onError(error);
        }
    }

    buildChart() {
        if (!this.props.dataSource.data) return;
        let chartOptions = this.getChartOptions();
        let stockOptions = this.getStockOptions();
        chartOptions["series"] = isMultiSeriesChart(this.props.settings) ? this.buildMultiSeriesData() : this.buildSingleSeriesData();
        stockOptions["series"] = isMultiSeriesChart(this.props.settings) ? this.buildMultiSeriesData() : this.buildSingleSeriesData();
        if(this.props.settings.yOptions[0].type==='timeseries'){
            this.chart = HighStocks.stockChart('highChartsContainer' + this.props.id, stockOptions)
        } else {
            this.chart = Highcharts.chart('highChartsContainer' + this.props.id, chartOptions);
        }
        this.setState({
            options: chartOptions,
            revision: this.state.revision + 1
        });
    }

    onDoubleClick = e => {
        if(this.chart) {
            this.chart.zoomOut();
            e.stopPropagation();
        }
    }

    render() {
        return (
            <Container>
                <ChartContainer id={'highChartsContainer' + this.props.id} onDoubleClick={this.onDoubleClick} />
            </Container>
        );
    }
}

HighChartWidget.propTypes = {
    dataSource: PropTypes.object,
    dataFilter: PropTypes.object,
    settings: PropTypes.object,
    configItems: PropTypes.array,
    resizeEvents: PropTypes.array,
    actions: PropTypes.object,
    title: PropTypes.string,
    onError: PropTypes.func,
    id: PropTypes.string,
    container: PropTypes.object
};

const Container = styled.div`
    padding: 15px 5px 5px 5px;
    height: 100%;
    width: 100%;
    background-color: #313133;
`;

const ChartContainer = styled.div`
    height: 100%;
    width: 100%;
`;


function mapStateToProps(state) {
    return {
        resizeEvents: state.dashboard.resizeEvents
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...widgetActions, ...dashboardActions }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(HighChartWidget);