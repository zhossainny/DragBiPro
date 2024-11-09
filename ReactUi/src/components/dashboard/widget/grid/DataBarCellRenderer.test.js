import React from 'react';
import { shallow } from 'enzyme';
import DataBarCellRenderer from './DataBarCellRenderer';

describe('DataBarCellRenderer tests', () => {
    test('should display formatted value for group nodes', () => {
        const props = { node: { group: true }, valueFormatted: '$23K' };
        const wrapper = shallow(<DataBarCellRenderer {...props} />);

        expect(wrapper.text()).toBe('$23K');
    });

    test('should display raw value for pinned rows', () => {
        const props = { node: { group: false, rowPinned: 'bottom' }, valueFormatted: '$23K' };
        const wrapper = shallow(<DataBarCellRenderer {...props} />);

        expect(wrapper.text()).toBe('$23K');
    });

    test('should display raw value for group nodes when no formatted value', () => {
        const props = { node: { group: true }, value: 22.5 };
        const wrapper = shallow(<DataBarCellRenderer {...props} />);

        expect(wrapper.text()).toBe('22.5');
    });

    test('should scale number when 0 falls between the ranges', () => {
        const props = { node: { group: false }, valueFormatted: '$23', column: { actualWidth: 200 }, value: 22.55, dataSet: [-120, -30, 12, 22.55, 55] };
        const wrapper = shallow(<DataBarCellRenderer {...props} />);

        expect(wrapper.state().dataBarProps.left).toBe(120);
        expect(wrapper.state().dataBarProps.width).toBe(23);
        expect(wrapper.state().dataBarProps.color).toBe('rgba(144, 237, 125, 0.6)');
    });

    test('should scale number when 0 falls at right extreme', () => {
        const props = { node: { group: false }, valueFormatted: '-$23', column: { actualWidth: 200 }, value: -22.55, dataSet: [-120, -30, -12, -22.55, -55] };
        const wrapper = shallow(<DataBarCellRenderer {...props} />);

        expect(wrapper.state().dataBarProps.left).toBe(158);
        expect(wrapper.state().dataBarProps.width).toBe(18);
        expect(wrapper.state().dataBarProps.color).toBe('rgba(241, 92, 128, 0.6)');
    });

    test('should scale number when 0 falls at left extreme', () => {
        const props = { node: { group: false }, valueFormatted: '$23', column: { actualWidth: 200 }, value: 22.55, dataSet: [120, 30, 12, 22.55, 55] };
        const wrapper = shallow(<DataBarCellRenderer {...props} />);

        expect(wrapper.state().dataBarProps.left).toBe(0);
        expect(wrapper.state().dataBarProps.width).toBe(17);
        expect(wrapper.state().dataBarProps.color).toBe('rgba(144, 237, 125, 0.6)');
    });
});