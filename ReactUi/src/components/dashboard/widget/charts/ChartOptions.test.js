import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import ChartOptions from './ChartOptions';

describe('ChartOptions tests', () => {
    const baseProps = { columnNames: ['column1', 'column2'] };
    test('should render default legend settings', () => {
        const props = { ...baseProps, settings: { legend: { enabled: true }, yOptions: [] } };
        const wrapper = shallow(<ChartOptions {...props} />);

        expect(wrapper.find('BooleanToggle[name="legend.enabled"]').prop('checked')).toBeTruthy();
        expect(wrapper.find('BrowserSelect[name="legend.align"]').prop('value')).toBe('center');
        expect(wrapper.find('BrowserSelect[name="legend.layout"]').prop('value')).toBe('horizontal');
        expect(wrapper.find('BrowserSelect[name="legend.verticalAlign"]').prop('value')).toBe('bottom');
    });

    test('should not render if no columnNames provided', () => {
        const props = { settings: { legend: { enabled: true }, yOptions: [] } };
        const wrapper = shallow(<ChartOptions {...props} />);

        expect(wrapper.html()).toBe(null);
    });

    test('should change legend enabled settings', () => {
        const settingsChangedSpy = sinon.spy();
        const props = { ...baseProps, settings: { legend: { enabled: true }, yOptions: [] }, onSettingsChanged: settingsChangedSpy };
        const wrapper = shallow(<ChartOptions {...props} />);

        wrapper.find('BooleanToggle[name="legend.enabled"]').simulate('change', { target: { name: 'legend.enabled', value: false } });
        const expectedSettings = { ...props.settings };
        expectedSettings.legend.enabled = false;
        expect(settingsChangedSpy.calledWith(expectedSettings)).toBe(true);
    });

    test('should change legend layout settings', () => {
        const settingsChangedSpy = sinon.spy();
        const props = { ...baseProps, settings: { legend: { enabled: true }, yOptions: [] }, onSettingsChanged: settingsChangedSpy };
        const wrapper = shallow(<ChartOptions {...props} />);

        wrapper.find('BrowserSelect[name="legend.layout"]').simulate('change', { target: { name: 'legend.layout', value: 'vertical' } });
        const expectedSettings = { ...props.settings };
        expectedSettings.legend.layout = 'vertical';
        expect(settingsChangedSpy.calledWith(expectedSettings)).toBe(true);
    });

    test('should change legend align settings', () => {
        const settingsChangedSpy = sinon.spy();
        const props = { ...baseProps, settings: { legend: { enabled: true }, yOptions: [] }, onSettingsChanged: settingsChangedSpy };
        const wrapper = shallow(<ChartOptions {...props} />);

        wrapper.find('BrowserSelect[name="legend.align"]').simulate('change', { target: { name: 'legend.align', value: 'right' } });
        const expectedSettings = { ...props.settings };
        expectedSettings.legend.align = 'right';
        expect(settingsChangedSpy.calledWith(expectedSettings)).toBe(true);
    });

    test('should change legend verticalAlign settings', () => {
        const settingsChangedSpy = sinon.spy();
        const props = { ...baseProps, settings: { legend: { enabled: true }, yOptions: [] }, onSettingsChanged: settingsChangedSpy };
        const wrapper = shallow(<ChartOptions {...props} />);

        wrapper.find('BrowserSelect[name="legend.verticalAlign"]').simulate('change', { target: { name: 'legend.verticalAlign', value: 'middle' } });
        const expectedSettings = { ...props.settings };
        expectedSettings.legend.verticalAlign = 'middle';
        expect(settingsChangedSpy.calledWith(expectedSettings)).toBe(true);
    });

    test('should change tooltip additional items', () => {
        const settingsChangedSpy = sinon.spy();
        const props = { ...baseProps, settings: { yOptions: [] }, onSettingsChanged: settingsChangedSpy };
        const wrapper = shallow(<ChartOptions {...props} />);

        wrapper.find('MultiSelect').simulate('change', [{ label: 'xxx', value: 'column1' }]);
        const expectedSettings = { ...props.settings };
        expectedSettings.tooltip = { additionalItems: ['column1'] };
        expect(settingsChangedSpy.calledWith(expectedSettings)).toBe(true);
    });

    test('should change tooltip precision', () => {
        const settingsChangedSpy = sinon.spy();
        const props = { ...baseProps, settings: { yOptions: [] }, onSettingsChanged: settingsChangedSpy };
        const wrapper = shallow(<ChartOptions {...props} />);

        wrapper.find('PropValue[name="tooltip.precision"]').simulate('change', { target: { name: 'tooltip.precision', value: "6" } });
        const expectedSettings = { ...props.settings };
        expectedSettings.tooltip = { precision: 6 };
        expect(settingsChangedSpy.calledWith(expectedSettings)).toBe(true);
    });

    test('should change tooltip precision to 0', () => {
        const settingsChangedSpy = sinon.spy();
        const props = { ...baseProps, settings: { yOptions: [], tooltip: { precision: 4 } }, onSettingsChanged: settingsChangedSpy };
        const wrapper = shallow(<ChartOptions {...props} />);

        wrapper.find('PropValue[name="tooltip.precision"]').simulate('change', { target: { name: 'tooltip.precision', value: "0" } });
        const expectedSettings = { ...props.settings };
        expectedSettings.tooltip = { precision: 0 };
        expect(settingsChangedSpy.calledWith(expectedSettings)).toBe(true);
    });

    test('should change tooltip precision to none', () => {
        const settingsChangedSpy = sinon.spy();
        const props = { ...baseProps, settings: { yOptions: [], tooltip: { precision: 4 } }, onSettingsChanged: settingsChangedSpy };
        const wrapper = shallow(<ChartOptions {...props} />);

        wrapper.find('PropValue[name="tooltip.precision"]').simulate('change', { target: { name: 'tooltip.precision', value: "" } });
        const expectedSettings = { ...props.settings };
        expectedSettings.tooltip = { precision: null };
        expect(settingsChangedSpy.calledWith(expectedSettings)).toBe(true);
    });

    test('should change plotLines enabled settings', () => {
        const settingsChangedSpy = sinon.spy();
        const props = { ...baseProps, settings: { yOptions: [] }, onSettingsChanged: settingsChangedSpy };
        const wrapper = shallow(<ChartOptions {...props} />);

        wrapper.find('BooleanToggle[name="plotLines.enabled"]').simulate('change', { target: { name: 'plotLines.enabled', value: true } });
        const expectedSettings = { ...props.settings };
        expectedSettings.plotLines = { enabled: true };
        expect(settingsChangedSpy.calledWith(expectedSettings)).toBe(true);
    });

    test('should change crosshair enabled settings', () => {
        const settingsChangedSpy = sinon.spy();
        const props = { ...baseProps, settings: { yOptions: [] }, onSettingsChanged: settingsChangedSpy };
        const wrapper = shallow(<ChartOptions {...props} />);

        wrapper.find('BooleanToggle[name="crosshair.enabled"]').simulate('change', { target: { name: 'crosshair.enabled', value: true } });
        const expectedSettings = { ...props.settings };
        expectedSettings.crosshair = { enabled: true };
        expect(settingsChangedSpy.calledWith(expectedSettings)).toBe(true);
    });

    test('should change tooltip split settings', () => {
        const settingsChangedSpy = sinon.spy();
        const props = { ...baseProps, settings: { yOptions: [] }, onSettingsChanged: settingsChangedSpy };
        const wrapper = shallow(<ChartOptions {...props} />);

        wrapper.find('BooleanToggle[name="tooltip.split"]').simulate('change', { target: { name: 'tooltip.split', value: true } });
        const expectedSettings = { ...props.settings };
        expectedSettings.tooltip = { split: true };
        expect(settingsChangedSpy.calledWith(expectedSettings)).toBe(true);
    });

    test('should change zoom settings', () => {
        const settingsChangedSpy = sinon.spy();
        const props = { ...baseProps, settings: { yOptions: [] }, onSettingsChanged: settingsChangedSpy };
        const wrapper = shallow(<ChartOptions {...props} />);

        wrapper.find('BooleanToggle[name="zoom.enabled"]').simulate('change', { target: { name: 'zoom.enabled', value: true } });
        const expectedSettings = { ...props.settings };
        expectedSettings.zoom = { enabled: true };
        expect(settingsChangedSpy.calledWith(expectedSettings)).toBe(true);
    });
});
