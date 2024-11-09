import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import GridOptions from './GridOptions';

describe('GridOptions tests', () => {
    test('should be able to change Caption', () => {
        const settingsChangedSpy = sinon.spy();
        const props = { settings: { propB: 'vvv' }, onSettingsChanged: settingsChangedSpy };
        const wrapper = shallow(<GridOptions {...props} />);

        wrapper.find('PropValue[name="caption"]').simulate('change', { target: { name: 'caption', value: 'some caption' } });

        expect(settingsChangedSpy.calledWith({ propB: 'vvv', caption: 'some caption' })).toBe(true);
    });

    test('should be able to change Font Size', () => {
        const settingsChangedSpy = sinon.spy();
        const props = { settings: { propB: 'vvv' }, onSettingsChanged: settingsChangedSpy };
        const wrapper = shallow(<GridOptions {...props} />);

        wrapper.find('BrowserSelect[name="fontSize"]').simulate('change', { target: { name: 'fontSize', value: 'l' } });

        expect(settingsChangedSpy.calledWith({ propB: 'vvv', fontSize: 'l' })).toBe(true);
    });

    test('should be able to change Decimal Places', () => {
        const settingsChangedSpy = sinon.spy();
        const props = { settings: { propB: 'vvv' }, onSettingsChanged: settingsChangedSpy };
        const wrapper = shallow(<GridOptions {...props} />);

        wrapper.find('PropValue[name="decimalPrecision"]').simulate('change', { target: { name: 'decimalPrecision', value: 6 } });

        expect(settingsChangedSpy.calledWith({ propB: 'vvv', decimalPrecision: 6 })).toBe(true);
    });

    test('should be able to change Row Height', () => {
        const settingsChangedSpy = sinon.spy();
        const props = { settings: { propB: 'vvv' }, onSettingsChanged: settingsChangedSpy };
        const wrapper = shallow(<GridOptions {...props} />);

        wrapper.find('PropValue[name="rowHeight"]').simulate('change', { target: { name: 'rowHeight', value: 20 } });

        expect(settingsChangedSpy.calledWith({ propB: 'vvv', rowHeight: 20 })).toBe(true);
    });

    test('should be able to change Format USD', () => {
        const settingsChangedSpy = sinon.spy();
        const props = { settings: { propB: 'vvv' }, onSettingsChanged: settingsChangedSpy };
        const wrapper = shallow(<GridOptions {...props} />);

        wrapper.find('BooleanToggle[name="formatDollar"]').simulate('change', { target: { name: 'formatDollar', value: true } });

        expect(settingsChangedSpy.calledWith({ propB: 'vvv', formatDollar: true })).toBe(true);
    });

    test('should be able to change Total Row', () => {
        const settingsChangedSpy = sinon.spy();
        const props = { settings: { propB: 'vvv' }, onSettingsChanged: settingsChangedSpy };
        const wrapper = shallow(<GridOptions {...props} />);

        wrapper.find('BooleanToggle[name="totals.enabled"]').simulate('change', { target: { name: 'totals.enabled', value: true } });

        expect(settingsChangedSpy.calledWith({ propB: 'vvv', totals: { enabled: true } })).toBe(true);
    });

    test('should be able to change Total Row from old model', () => {
        const settingsChangedSpy = sinon.spy();
        const props = { settings: { propB: 'vvv', showTotals: true }, onSettingsChanged: settingsChangedSpy };
        const wrapper = shallow(<GridOptions {...props} />);

        expect(wrapper.instance().props.settings.totals).toEqual({ enabled: true });
        wrapper.find('BooleanToggle[name="totals.enabled"]').simulate('change', { target: { name: 'totals.enabled', value: false } });

        expect(settingsChangedSpy.calledWith({ propB: 'vvv', showTotals: true, totals: { enabled: false } })).toBe(true);
    });

    test('should be able to change pin total row', () => {
        const settingsChangedSpy = sinon.spy();
        const props = { settings: { propB: 'vvv', totals: { enabled: true } }, onSettingsChanged: settingsChangedSpy };
        const wrapper = shallow(<GridOptions {...props} />);

        wrapper.find('BooleanToggle[name="totals.pinToBottom"]').simulate('change', { target: { name: 'totals.pinToBottom', value: true } });

        expect(settingsChangedSpy.calledWith({ propB: 'vvv', totals: { enabled: true, pinToBottom: true } })).toBe(true);
    });

    test('should be able to change row model to tree data', () => {
        const settingsChangedSpy = sinon.spy();
        const props = { settings: { propB: 'vvv' }, onSettingsChanged: settingsChangedSpy };
        const wrapper = shallow(<GridOptions {...props} />);

        wrapper.find('BooleanToggle[name="treeData.enabled"]').simulate('change', { target: { name: 'treeData.enabled', value: true } });

        expect(settingsChangedSpy.calledWith({ propB: 'vvv', treeData: { enabled: true } })).toBe(true);
    });

    test('should be able to select property for tree data path', () => {
        const settingsChangedSpy = sinon.spy();
        const props = { settings: { propB: 'vvv' }, columnNames: ['column x'], onSettingsChanged: settingsChangedSpy };
        const wrapper = shallow(<GridOptions {...props} />);

        props.settings.treeData = { enabled: true };
        wrapper.setProps(props);

        wrapper.find('BrowserSelect[name="treeData.pathProperty"]').simulate('change', { target: { name: 'treeData.pathProperty', value: 'column x' } });

        expect(settingsChangedSpy.calledWith({ ...props.settings, ...{ treeData: { enabled: true, pathProperty: 'column x' } } })).toBe(true);
    });
});