import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import SearchBox from './SearchBox';

describe('SearchBox tests', () => {
    let clock;

    beforeEach(() => clock = sinon.useFakeTimers());

    test('should not display close icon when initially rendered', () => {
        const props = {};
        const wrapper = shallow(<SearchBox {...props}/>);

        expect(wrapper.find('SearchBox__SearchIcon').props().color).toBe('#d1d1d1');
        expect(wrapper.find('SearchBox__CloseIcon').length).toBe(0);
    });

    test('should trigger onTextChanged after a debounce', () => {
        const textChangedSpy = sinon.spy();
        const props = { onTextChanged: textChangedSpy};
        const wrapper = shallow(<SearchBox {...props}/>);

        wrapper.find('SearchBox__SearchInput').simulate('change', { target: { value: 'search string'}});
        clock.tick(400);

        expect(textChangedSpy.calledWith('search string')).toBe(true);
    });

});