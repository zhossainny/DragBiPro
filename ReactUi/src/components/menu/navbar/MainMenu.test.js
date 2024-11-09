import React from 'react';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import { MainMenu } from './MainMenu';
import MainMenuItem from './MainMenuItem';


describe('MainMenu tests', () => {
    test('should render full menu', () => {
        const props = { tag: '' };
        const wrapper = shallow(<MainMenu {...props} />);

        expect(wrapper.find(MainMenuItem).at(0).props().active).toBe(true);
        expect(wrapper.state().selectedTag).toBe('');
        
        expect(wrapper.find(MainMenuItem).at(1).props().active).toBe(false);
        expect(wrapper.find(MainMenuItem).at(2).props().active).toBe(false);
        expect(wrapper.find(MainMenuItem).at(3).props().active).toBe(false);
        expect(wrapper.find(MainMenuItem).at(4).props().active).toBe(false);
    });

    test('should fire handler when selectedTag changes', () => {
        const onClickSpy = sinon.spy();
        const props = { tag: 'dashboards', onClick: onClickSpy };
        const wrapper = shallow(<MainMenu {...props} />);

        wrapper.find(MainMenuItem).at(3).simulate('click', 'admin');
        expect(onClickSpy.calledWith('admin'));

        wrapper.setProps({ tag:  'admin'});
        expect(wrapper.state().selectedTag).toBe('admin');
    });
});


