import React from 'react';
import { shallow } from 'enzyme';
import { HighChartWidget } from './HighChartWidget';
import chartSettings from '../../../../../test/chart-settings';
import Highcharts from 'highcharts';
import sinon from 'sinon';
import * as _ from 'lodash';
import moment from 'moment';

jest.mock('highcharts');



describe('Highcharts Widget tests', () => {
    let chartOptions;
    let highchartsStub;
    beforeEach(() => {
        chartOptions = _.cloneDeep(chartSettings);
        if(highchartsStub) {
            highchartsStub.restore();
        }
    });

    test('should render regex caption correctly', () => {
        chartOptions.caption = 'For currencies {CCY} and desk {DESK}';
        const props = { dataSource: { data: [] }, settings: chartOptions, configItems: [{ name: 'CCY', value: 'USD' }, { name: 'DESK', value: 'EMEA' }] };
        const wrapper = shallow(<HighChartWidget {...props} />);

        expect(wrapper.state().options.title.text).toBe('FOR CURRENCIES USD AND DESK EMEA');
    });

    test('should ignore regex caption when no name match', () => {
        chartOptions.caption = 'For currencies {CCY} and desk {DESK-WRONG-NAME}';
        const props = { dataSource: { data: [] }, settings: chartOptions, configItems: [{ name: 'CCY', value: 'USD' }, { name: 'DESK', value: 'EMEA' }] };
        const wrapper = shallow(<HighChartWidget {...props} />);

        expect(wrapper.state().options.title.text).toBe('FOR CURRENCIES USD AND DESK {DESK-WRONG-NAME}');
    });

    test('should render caption when no regex', () => {
        chartOptions.caption = 'caption no regex';
        const props = { dataSource: { data: [] }, settings: chartOptions, configItems: [{ name: 'CCY', value: 'USD' }, { name: 'DESK', value: 'EMEA' }] };
        const wrapper = shallow(<HighChartWidget {...props} />);

        expect(wrapper.state().options.title.text).toBe('CAPTION NO REGEX');
    });

    test('should render title when no caption provided', () => {
        chartOptions.caption = '';
        const props = { dataSource: { data: [] }, settings: chartOptions, title: 'Chart Title', configItems: null };
        const wrapper = shallow(<HighChartWidget {...props} />);
        expect(wrapper.state().options.title.text).toBe('Chart Title');
    });

    test('should plot two Y options with same position on the same axis', () => {
        chartOptions.yOptions.push({ y: 'Price', type: 'bar' });
        const props = { dataSource: { data: [] }, settings: chartOptions };
        const wrapper = shallow(<HighChartWidget {...props} />);

        expect(wrapper.state().options.yAxis.length).toBe(1);
        expect(wrapper.state().options.yAxis[0]).toEqual({ title: { text: '' }, opposite: false });
    });

    test('should plot multiple Y options with different position on max 2 axis', () => {
        chartOptions.yOptions.push({ y: 'Price', type: 'bar', caption: 'Axis 2' });
        chartOptions.yOptions.push({ y: 'Date', type: 'line', caption: 'Axis 3', position: 'Right' });
        const props = { dataSource: { data: [] }, settings: chartOptions };
        const wrapper = shallow(<HighChartWidget {...props} />);

        expect(wrapper.state().options.yAxis.length).toBe(2);
        expect(wrapper.state().options.yAxis[0]).toEqual({ title: { text: '' }, opposite: false });
        expect(wrapper.state().options.yAxis[1]).toEqual({ title: { text: 'AXIS 3' }, opposite: true });
    });

    test('should render Y axis regex caption correctly', () => {
        chartOptions.yOptions[0] = { y: 'Price', type: 'bar', caption: 'For currencies {CCY}' };
        const props = { dataSource: { data: [] }, settings: chartOptions, configItems: [{ name: 'CCY', value: 'USD' }, { name: 'DESK', value: 'EMEA' }] };
        const wrapper = shallow(<HighChartWidget {...props} />);

        expect(wrapper.state().options.yAxis[0]).toEqual({ title: { text: 'FOR CURRENCIES USD' }, opposite: false });
    });

    test('should ignore Y axis regex caption when no name match', () => {
        chartOptions.yOptions[0] = { y: 'Price', type: 'bar', caption: 'For currencies {CCY-nomatch}' };
        const props = { dataSource: { data: [] }, settings: chartOptions, configItems: [{ name: 'CCY', value: 'USD' }, { name: 'DESK', value: 'EMEA' }] };
        const wrapper = shallow(<HighChartWidget {...props} />);

        expect(wrapper.state().options.yAxis[0]).toEqual({ title: { text: 'FOR CURRENCIES {CCY-NOMATCH}' }, opposite: false });
    });

    test('should render Y axis caption when no regex', () => {
        chartOptions.yOptions[0] = { y: 'Price', type: 'bar', caption: 'For currencies' };
        const props = { dataSource: { data: [] }, settings: chartOptions, configItems: [{ name: 'CCY', value: 'USD' }, { name: 'DESK', value: 'EMEA' }] };
        const wrapper = shallow(<HighChartWidget {...props} />);

        expect(wrapper.state().options.yAxis[0]).toEqual({ title: { text: 'FOR CURRENCIES' }, opposite: false });
    });

    test('should render Y axis opposite', () => {
        chartOptions.yOptions[0] = { y: 'Price', type: 'bar', caption: 'For currencies', position: 'Right' };
        const props = { dataSource: { data: [] }, settings: chartOptions, configItems: [{ name: 'CCY', value: 'USD' }, { name: 'DESK', value: 'EMEA' }] };
        const wrapper = shallow(<HighChartWidget {...props} />);

        expect(wrapper.state().options.yAxis[0]).toEqual({ title: { text: 'FOR CURRENCIES' }, opposite: true });
    });

    test('should render multiple Y axis', () => {
        chartOptions.yOptions.push({ y: 'P/L', type: 'line', caption: '', position: 'Right' });
        chartOptions.yOptions.push({ y: 'Maturity', type: 'line', caption: '', position: 'Left' });
        const props = { dataSource: { data: [{ Ticker: 'SPX', Notional: 100, 'P/L': 200, Maturity: 555 }, { Ticker: 'FTSE', Notional: 300, 'P/L': 300, Maturity: 588 }] }, settings: chartOptions, title: 'Chart Title', configItems: null };
        const wrapper = shallow(<HighChartWidget {...props} />);

        expect(wrapper.state().options.series[0]).toEqual({ name: 'Notional', data: [['SPX', 100], ['FTSE', 300]], type: 'pie', yAxis: 0 });
        expect(wrapper.state().options.series[1]).toEqual({ name: 'P/L', data: [['SPX', 200], ['FTSE', 300]], type: 'line', yAxis: 1 });
        expect(wrapper.state().options.series[2]).toEqual({ name: 'Maturity', data: [['SPX', 555], ['FTSE', 588]], type: 'line', yAxis: 0 });
    });

    test('should resolve X axis type correctly when axis name is dodgy', () => {
        chartOptions.x = 'true';
        const props = { dataSource: { data: [{ Ticker: 'SPX', Notional: 100, 'P/L': 200 }, { Ticker: 'FTSE', Notional: 300, 'P/L': 300 }] }, settings: chartOptions, title: 'Chart Title', configItems: null };
        const wrapper = shallow(<HighChartWidget {...props} />);

        expect(wrapper.state().options.xAxis.type).toBe('category');
    });

    test('should resolve X axis type correctly for date axis', () => {
        chartOptions.x = 'PriceDate';
        const props = { dataSource: { data: [{ Ticker: 'SPX', Notional: 100, 'P/L': 200, PriceDate: '2019-01-01' }, { Ticker: 'FTSE', Notional: 300, 'P/L': 300, PriceDate: '2019-01-02' }] }, settings: chartOptions, title: 'Chart Title', configItems: null };
        const wrapper = shallow(<HighChartWidget {...props} />);

        expect(wrapper.state().options.xAxis.type).toBe('datetime');
    });

    test('should resolve X axis type correctly for number axis', () => {
        chartOptions.x = 'Numbers';
        const props = { dataSource: { data: [{ Ticker: 'SPX', Notional: 100, 'P/L': 200, Numbers: 1.23333 }, { Ticker: 'FTSE', Notional: 300, 'P/L': 300, PriceDate: '2019-01-02' }] }, settings: chartOptions, title: 'Chart Title', configItems: null };
        const wrapper = shallow(<HighChartWidget {...props} />);

        expect(wrapper.state().options.xAxis.type).toBe('category');
    });

    test('should resolve X axis type correctly for string axis', () => {
        chartOptions.x = 'Text';
        const props = { dataSource: { data: [{ Ticker: 'SPX', Notional: 100, 'P/L': 200, Text: '1.23333' }, { Ticker: 'FTSE', Notional: 300, 'P/L': 300, PriceDate: '2019-01-02' }] }, settings: chartOptions, title: 'Chart Title', configItems: null };
        const wrapper = shallow(<HighChartWidget {...props} />);

        expect(wrapper.state().options.xAxis.type).toBe('category');
    });

    test('should resolve X axis type correctly for string axis with special characters', () => {
        chartOptions.x = 'Text';
        const props = { dataSource: { data: [{ Ticker: 'SPX', Notional: 100, 'P/L': 200, Text: '100%' }, { Ticker: 'FTSE', Notional: 300, 'P/L': 300, PriceDate: '2019-01-02' }] }, settings: chartOptions, title: 'Chart Title', configItems: null };
        const wrapper = shallow(<HighChartWidget {...props} />);

        expect(wrapper.state().options.xAxis.type).toBe('category');
    });

    test('should render legend labels correctly', () => {
        chartOptions.yOptions[0] = { y: 'Price', type: 'line', caption: '{CCY}' };
        chartOptions.yOptions.push({ y: 'Notional', type: 'line', caption: '' });
        chartOptions.yOptions.push({ y: 'Margin', type: 'line', caption: 'free text' });

        const props = { dataSource: { data: [] }, settings: chartOptions, configItems: [{ name: 'CCY', value: 'USD' }] };
        const wrapper = shallow(<HighChartWidget {...props} />);

        expect(wrapper.state().options.legend.labelFormatter.call({ name: 'Price' })).toBe('USD');
        expect(wrapper.state().options.legend.labelFormatter.call({ name: 'Notional' })).toBe('Notional');
        expect(wrapper.state().options.legend.labelFormatter.call({ name: 'Margin' })).toBe('FREE TEXT');
    });

    test('should reflow chart when resize event for component exists', () => {
        const markResizeEventAsConsumedSpy = sinon.spy();
        const chartReflowSpy = sinon.spy();
        highchartsStub = sinon.stub(Highcharts, 'chart').returns({ reflow: chartReflowSpy });
        const props = {
            id: '123',
            dataSource: { data: [] },
            settings: chartOptions,
            configItems: [{ name: 'CCY', value: 'USD' }, { name: 'DESK', value: 'EMEA' }],
            actions: { markResizeEventAsConsumed: markResizeEventAsConsumedSpy },
            container: { tab: { isActive: true } }
        };
        const wrapper = shallow(<HighChartWidget {...props} />);

        wrapper.setProps({ resizeEvents: [{ eventId: 'event1', componentId: '123' }] });

        expect(chartReflowSpy.called).toBe(true);
        expect(markResizeEventAsConsumedSpy.calledWith('event1')).toBe(true);
    });

    test('should produce tooltip HTML with no additional item', () => {
        chartOptions.tooltip = { precision: 4 };
        const props = { dataSource: { data: [] }, settings: chartOptions, configItems: [] };
        const tooltipContext = { y: 10.546668, series: { name: 'Column1' }, x: 'X axis label' };
        const wrapper = shallow(<HighChartWidget {...props} />);

        expect(wrapper.state().options.tooltip.formatter.call(tooltipContext)).toEqual(['X axis label', '<br/>', 'Column1: <b>10.5467</b>']);
    });

    test('should produce tooltip HTML with no additional item where Y is a string', () => {
        chartOptions.tooltip = { precision: 4 };
        const props = { dataSource: { data: [] }, settings: chartOptions, configItems: [] };
        const tooltipContext = { y: 'tomatoes', series: { name: 'Column1' }, x: 'X axis label' };
        const wrapper = shallow(<HighChartWidget {...props} />);

        expect(wrapper.state().options.tooltip.formatter.call(tooltipContext)).toEqual(['X axis label', '<br/>', 'Column1: <b>tomatoes</b>']);
    });

    test('should produce tooltip for each axis when tooltip split and X axis is date', () => {
        const arbitraryDate = moment('2018-01-01').valueOf();
        const props = { dataSource: { data: [{ Ticker: '2019-05-05' }] }, settings: chartOptions, configItems: [] };
        const tooltipContext = { points: [{ x: arbitraryDate, y: 110, series: { name: 'series 1' } }, { x: arbitraryDate, y: 220, series: { name: 'series 2' } }], x: arbitraryDate };
        const wrapper = shallow(<HighChartWidget {...props} />);

        expect(wrapper.state().options.tooltip.formatter.call(tooltipContext)).toEqual(['01 Jan 2018', 'series 1: <b>110</b>', 'series 2: <b>220</b>']);
    });

    test('should produce tooltip for each axis when tooltip split and X axis is category', () => {
        const category = 'pants';
        const props = { dataSource: { data: [{ Ticker: 'pants' }] }, settings: chartOptions, configItems: [] };
        const tooltipContext = { points: [{ x: category, y: 110, series: { name: 'series 1' } }, { x: category, y: 220, series: { name: 'series 2' } }], x: category };
        const wrapper = shallow(<HighChartWidget {...props} />);

        expect(wrapper.state().options.tooltip.formatter.call(tooltipContext)).toEqual(['pants', 'series 1: <b>110</b>', 'series 2: <b>220</b>']);
    });

    test('should map config names in tooltip series names', () => {
        const category = 'pants';
        chartOptions.yOptions.push({ y: 'series1', type: 'line', caption: 'Caption {series1}', position: 'Right' });
        chartOptions.yOptions.push({ y: 'series2', type: 'line', caption: 'Caption {series2}', position: 'Left' });
        const props = { dataSource: { data: [{ Ticker: 'pants' }] }, settings: chartOptions, configItems: [{ name: 'series1', value: 'Notional' }, { name: 'series2', value: 'P/L' }] };
        const tooltipContext = { points: [{ x: category, y: 110, series: { name: 'series1' } }, { x: category, y: 220, series: { name: 'series2' } }], x: category };
        const wrapper = shallow(<HighChartWidget {...props} />);

        expect(wrapper.state().options.tooltip.formatter.call(tooltipContext)).toEqual(['pants', 'CAPTION NOTIONAL: <b>110</b>', 'CAPTION P/L: <b>220</b>']);
    });

    test('should have correct options when dataSource has plotLines', () => {
        chartOptions.plotLines = { enabled: true };
        const props = { dataSource: { data: [], chartOptions: { plotLines: { x: [2.3, 5] } } }, settings: chartOptions, configItems: [] };
        const wrapper = shallow(<HighChartWidget {...props} />);

        expect(wrapper.state().options.xAxis.plotLines).toEqual([{ color: '#ce3948', value: 2.3, width: 2 }, { color: '#ce3948', value: 5, width: 2 }]);
    });

    test('should not blow up shop if chartOptions not there', () => {
        chartOptions.plotLines = { enabled: true };
        const props = { dataSource: { data: [] }, settings: chartOptions, configItems: [] };
        const wrapper = shallow(<HighChartWidget {...props} />);

        expect(wrapper.state().options.xAxis.plotLines).toBeUndefined();
    });

    test('should enable zoom for datetime axis', () => {
        chartOptions.zoom = { enabled: true };
        chartOptions.x = 'PriceDate';
        const props = { dataSource: { data: [{ Ticker: 'SPX', Notional: 100, 'P/L': 200, PriceDate: '2019-01-01' }] }, settings: chartOptions, configItems: [] };
        const wrapper = shallow(<HighChartWidget {...props} />);

        expect(wrapper.state().options.chart.zoomType).toBe('x');
    });

    test('should assign rgba color to series', () => {
        chartOptions.yOptions.push({ y: 'P/L', type: 'line', caption: '', position: 'Right', color: { r: '55', g: '55', b: '55', a: '0.5' } });
        const props = { dataSource: { data: [{ Ticker: 'SPX', Notional: 100, 'P/L': 200, Maturity: 555 }, { Ticker: 'FTSE', Notional: 300, 'P/L': 300, Maturity: 588 }] }, settings: chartOptions, title: 'Chart Title', configItems: null };
        const wrapper = shallow(<HighChartWidget {...props} />);

        expect(wrapper.state().options.series[1]).toEqual({ name: 'P/L', data: [['SPX', 200], ['FTSE', 300]], type: 'line', yAxis: 1, color: 'rgba(55, 55, 55, 0.5)' });
    });

    test('should attempt to zoomOut chart when container double clicked', () => {
        const zoomOutSpy = sinon.spy();
        const stopPropagationSpy = sinon.spy();
        highchartsStub = sinon.stub(Highcharts, 'chart').returns({ zoomOut: zoomOutSpy });
        const props = { dataSource: { data: [{ Ticker: 'SPX', Notional: 100, 'P/L': 200, Maturity: 555 }, { Ticker: 'FTSE', Notional: 300, 'P/L': 300, Maturity: 588 }] }, settings: chartOptions, title: 'Chart Title', configItems: null };
        const wrapper = shallow(<HighChartWidget {...props} />);

        wrapper.find('HighChartWidget__ChartContainer').props().onDoubleClick({ stopPropagation: stopPropagationSpy });
        
        expect(zoomOutSpy.called).toBeTruthy();
        expect(wrapper.state().options.chart.resetZoomButton.theme).toEqual({ display: 'none'});
    });
});