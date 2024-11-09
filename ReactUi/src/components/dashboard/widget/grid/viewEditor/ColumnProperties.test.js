import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import ColumnProperties from './ColumnProperties';

describe('ColumnProperties tests', () => {
    test('should set Data Bar', () => {
        const propertiesChangedSpy = sinon.spy();
        const props = { selectedColumns: ['value_date'], columnProperties: { type: 'numeric', dataBars: false }, onPropertiesChanged: propertiesChangedSpy };
        const wrapper = shallow(<ColumnProperties {...props} />);

        expect(wrapper.find('BooleanToggle[name="dataBar"]').length).toBe(1);
        wrapper.find('BooleanToggle[name="dataBar"]').simulate('change', { target: { name: 'dataBar', value: true } });
        const expectedProps = { ...props.columnProperties, dirty: true, dataBar: true };
        expect(propertiesChangedSpy.calledWith(expectedProps)).toBe(true);
    });

    test('should set Absolute Sort', () => {
        const propertiesChangedSpy = sinon.spy();
        const props = { selectedColumns: ['value_date'], columnProperties: { type: 'numeric' }, onPropertiesChanged: propertiesChangedSpy };
        const wrapper = shallow(<ColumnProperties {...props} />);

        expect(wrapper.find('BooleanToggle[name="absoluteSort"]').length).toBe(1);
        wrapper.find('BooleanToggle[name="absoluteSort"]').simulate('change', { target: { name: 'absoluteSort', value: true } });
        const expectedProps = { ...props.columnProperties, dirty: true, absoluteSort: true };
        expect(propertiesChangedSpy.calledWith(expectedProps)).toBe(true);
    });

    test('should set Format USD', () => {
        const propertiesChangedSpy = sinon.spy();
        const props = { selectedColumns: ['value_date'], columnProperties: { type: 'numeric', formatDollar: true }, onPropertiesChanged: propertiesChangedSpy };
        const wrapper = shallow(<ColumnProperties {...props} />);

        expect(wrapper.find('BooleanToggle[name="formatDollar"]').length).toBe(1);
        wrapper.find('BooleanToggle[name="formatDollar"]').simulate('change', { target: { name: 'formatDollar', value: false } });
        const expectedProps = { ...props.columnProperties, dirty: true, formatDollar: false };
        expect(propertiesChangedSpy.calledWith(expectedProps)).toBe(true);
    });

    const dataBarForNonNumericColumns = columnType => test('should not have Data Bar option enabled for anything but percentage and numeric columns', () => {
        const props = { selectedColumns: ['value_date'], columnProperties: { type: columnType }, onPropertiesChanged: sinon.spy() };
        const wrapper = shallow(<ColumnProperties {...props} />);

        expect(wrapper.find('BooleanToggle[name="dataBar"]').length).toBe(0);
    });

    dataBarForNonNumericColumns('text');
    dataBarForNonNumericColumns('date');
});