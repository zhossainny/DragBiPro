import React from 'react';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import Header from './Header';
import { MemoryRouter } from 'react-router';


describe('Panel Header tests', () => {
    test('should render create dashboard button', () => {
        const props = {};
        const wrapper = shallow(<Header {...props} />);

        expect(wrapper.find('Header__Button').props().to).toBe('/dashboard-new');
    });

    test('should set default sort', () => {
        const props = { defaultSort: 'az' };
        const wrapper = shallow(<Header {...props} />);

        expect(wrapper.find('Header__Select').props().value).toBe('az');
    });

    test('should be able to change sort', () => {
        const onSortChangedSpy = sinon.spy();
        const props = { defaultSort: 'az', onSortChanged: onSortChangedSpy };
        const wrapper = mount(<MemoryRouter><Header {...props} /></MemoryRouter>);

        wrapper.find('Header__Select').simulate('change', { target: { value: 'za' } });
        
        expect(onSortChangedSpy.calledWith('za')).toBe(true);
        expect(wrapper.update().find('Header__Select').props().value).toBe('za');
    });
});