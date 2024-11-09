import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import AppDeleteModal from './AppDeleteModal';

describe('AppDeleteModal tests', () => {
    test('should display confirmation for deletion', () => {
        const props = { onOk: sinon.spy(), show: true, onCancel: sinon.spy(), app: { key: 'dash-key', name: 'punk'} };
        const wrapper = shallow(<AppDeleteModal {...props} />);

        expect(wrapper.find('h5').text()).toBe('Are you sure you want to delete punk?');
    });

    test('should fire OK handler', () => {
        const okSpy = sinon.spy();
        const props = { onOk: okSpy, show: true, onCancel: sinon.spy(), app: { key: 'dash-key', name: 'punk'} };
        const wrapper = shallow(<AppDeleteModal {...props} />);

        wrapper.find('Modal').prop('onOK')();
        expect(okSpy.called).toBe(true);
    });

    test('should fire Cancle handler', () => {
        const cancelSpy = sinon.spy();
        const props = { onOk: sinon.spy(), show: true, onCancel: cancelSpy, app: { key: 'dash-key', name: 'punk'} };
        const wrapper = shallow(<AppDeleteModal {...props} />);

        wrapper.find('Modal').prop('onCancel')();
        expect(cancelSpy.called).toBe(true);
    });
});
