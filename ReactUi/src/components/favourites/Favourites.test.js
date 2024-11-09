import React from 'react';
import { shallow } from 'enzyme';
import { Favourites } from './Favourites';
import Card from './../menu/panel/Card';
import sinon from 'sinon';

describe('Favourites test', () => {

    test('should only display cards that are favourited', () => {
        const props = { apps: [{ key: 'app1' }, { key: 'app2' }], favourites: ['app2'], userId: 'ksss1' };
        const wrapper = shallow(<Favourites {...props} />);

        expect(wrapper.find(Card).length).toBe(1);
        expect(wrapper.find(Card).props().app).toEqual({ key: 'app2' });
        expect(wrapper.find(Card).props().userId).toBe('ksss1');
    });

    test('should trigger action onFavourite card', () => {
        const unfavouriteAppSpy = sinon.spy();
        const props = { apps: [{ key: 'app1' }, { key: 'app2' }], favourites: ['app2'], userId: 'ksss1', actions: { unfavouriteApp: unfavouriteAppSpy } };
        const wrapper = shallow(<Favourites {...props} />);

        wrapper.find(Card).props().onFavourite('app2');

        expect(unfavouriteAppSpy.calledWith('ksss1', 'app2'));
    });

    test('should display message when no favourites', () => {
        const props = { apps: [{ key: 'app1' }, { key: 'app2' }], favourites: [], userId: 'ksss1' };
        const wrapper = shallow(<Favourites {...props} />);

        expect(wrapper.find(Card).length).toBe(0);
        expect(wrapper.find('Favourites__NoFavourites').dive().text()).toBe('No favourites to display...');
    });
});