import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import AdvancedOptions from './AdvancedOptions';

describe('AdvancedOptions tests', () => {
    test('should build correct widget dropdown options', () => {
        const widgets = { 'widget1': { title: 'Widget 1' }, 'widget2': { title: 'Widget 2' } };
        const props = { settings: { columnNames: ['field 1', 'field 2'] }, configItems: [], widgets };
        const wrapper = shallow(<AdvancedOptions {...props} />);

        expect(wrapper.find('MultiSelect').first().props().options).toEqual([{ label: 'Widget 1', value: 'widget1' }, { label: 'Widget 2', value: 'widget2' }, { label: '-- none --', value: null }]);
    });

    test('should select correct widget option', () => {
        const widgets = { 'widget1': { title: 'Widget 1' }, 'widget2': { title: 'Widget 2' } };
        const props = { settings: { masterWidget: 'widget2', columnNames: ['field 1', 'field 2'] }, configItems: [], widgets };
        const wrapper = shallow(<AdvancedOptions {...props} />);

        expect(wrapper.find('MultiSelect').first().props().value).toEqual({ label: 'Widget 2', value: 'widget2' });
    });
});