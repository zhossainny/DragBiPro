import React from 'react';
import { shallow } from 'enzyme';
import GroupRowFormatEditor from './GroupRowFormatEditor';
import sinon from 'sinon';


describe('GroupRowFormatEditor test', () => {
    test('should display existing background color', () => {
        const initialColor = { r: 11, g: 211, b: 55, a: 1 };
        const props = { onOk: sinon.spy(), show: true, onCancel: sinon.spy(), options: { backgroundColor: initialColor } };
        const wrapper = shallow(<GroupRowFormatEditor {...props} />);

        expect(wrapper.find('ColorPicker').prop('color')).toEqual(initialColor);
    });

    test('should be able to change color', () => {
        const initialColor = { r: 11, g: 211, b: 55, a: 1 };
        const props = { onOk: sinon.spy(), show: true, onCancel: sinon.spy(), options: { backgroundColor: initialColor } };
        const wrapper = shallow(<GroupRowFormatEditor {...props} />);

        wrapper.find('ColorPicker').prop('onColorChanged')('color', { r: 10, g: 210, b: 52, a: 0.85 });

        expect(wrapper.find('ColorPicker').prop('color')).toEqual({ r: 10, g: 210, b: 52, a: 0.85 });
    });

    test('should emit event when color changed and press OK', () => {
        const initialColor = { r: 11, g: 211, b: 55, a: 1 };
        const onOkSpy = sinon.spy();
        const props = { onOk: onOkSpy, show: true, onCancel: sinon.spy(), options: { backgroundColor: initialColor } };
        const wrapper = shallow(<GroupRowFormatEditor {...props} />);

        wrapper.find('ColorPicker').prop('onColorChanged')('color', { r: 10, g: 210, b: 52, a: 0.85 });
        wrapper.find('Modal').prop('onOK')();

        expect(onOkSpy.calledWith({ backgroundColor: { r: 10, g: 210, b: 52, a: 0.85 } })).toBe(true);
    });

    test('should reset color to origin when Cancel', () => {
        const initialColor = { r: 11, g: 211, b: 55, a: 1 };
        const onCancelSpy = sinon.spy();
        const props = { onOk: sinon.spy(), show: true, onCancel: onCancelSpy, options: { backgroundColor: initialColor } };
        const wrapper = shallow(<GroupRowFormatEditor {...props} />);

        wrapper.find('ColorPicker').prop('onColorChanged')('color', { r: 10, g: 210, b: 52, a: 0.85 });
        expect(wrapper.find('ColorPicker').prop('color')).toEqual({ r: 10, g: 210, b: 52, a: 0.85 });

        wrapper.find('Modal').prop('onCancel')();

        expect(onCancelSpy.called).toBe(true);
        expect(wrapper.find('ColorPicker').prop('color')).toEqual(initialColor);
    });

    test('should reset color to null when Cancel and no original color', () => {
        const onCancelSpy = sinon.spy();
        const props = { onOk: sinon.spy(), show: true, onCancel: onCancelSpy };
        const wrapper = shallow(<GroupRowFormatEditor {...props} />);

        wrapper.find('ColorPicker').prop('onColorChanged')('color', { r: 10, g: 210, b: 52, a: 0.85 });
        expect(wrapper.find('ColorPicker').prop('color')).toEqual({ r: 10, g: 210, b: 52, a: 0.85 });

        wrapper.find('Modal').prop('onCancel')();

        expect(onCancelSpy.called).toBe(true);
        expect(wrapper.find('ColorPicker').prop('color')).toBe(null);
    });

    test('should reset color to null when Reset clicked', () => {
        const initialColor = { r: 11, g: 211, b: 55, a: 1 };
        const props = { onOk: sinon.spy(), show: true, onCancel: sinon.spy(), options: { backgroundColor: initialColor } };
        const wrapper = shallow(<GroupRowFormatEditor {...props} />);

        wrapper.find('ButtonSmallWhite').simulate('click');
        expect(wrapper.find('ColorPicker').prop('color')).toBe(null);
    });
});