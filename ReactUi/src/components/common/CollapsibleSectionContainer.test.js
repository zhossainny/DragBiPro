import React from 'react';
import { shallow } from 'enzyme';
import CollapsibleSectionContainer from './CollapsibleSectionContainer';

describe('CollapsibleSectionContainer tests', () => {
    test('should render when expanded is false', () => {
        const props = { headerText: 'Some header text' };
        const wrapper = shallow(
        (<CollapsibleSectionContainer {...props} >
            <span/>
        </CollapsibleSectionContainer>));

        expect(wrapper.find('span').length).toBe(0);
        expect(wrapper.find('i.fa-angle-down').length).toBe(1);
        expect(wrapper.find('h4').text()).toBe('Some header text');
    });

    test('should render when expanded is true', () => {
        const props = { headerText: 'Some header text' };
        const wrapper = shallow(
        (<CollapsibleSectionContainer {...props} expanded>
            <span/>
        </CollapsibleSectionContainer>));

        expect(wrapper.find('span').length).toBe(1);
        expect(wrapper.find('i.fa-angle-up').length).toBe(1);
        expect(wrapper.find('h4').text()).toBe('Some header text');
    });
});