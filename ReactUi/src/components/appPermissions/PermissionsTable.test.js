import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import PermissionsTable from './PermissionsTable';

describe('Permissions table tests', () => {
    test('should be able to add users', () => {
        const addMembersSpy = sinon.spy();
        const props = { members: [], principalType: 'user', addMembers: addMembersSpy, title: 'User Access', allPrincipals: [], deleteMember: sinon.spy(), onMemberPermissionChange: sinon.spy() };
        const wrapper = shallow(<PermissionsTable {...props} />);

        wrapper.find('PermissionsTable__TypeAhead').simulate('change', [{ label: 'Kamen Staykov', value: 'ks29437' }, { label: 'Kamen Staykov Clone', value: 'ks29437-clone' }]);
        wrapper.find('PermissionsTable__Button').simulate('click');

        expect(addMembersSpy.calledWith([{ id: 'ks29437', role: 'ReadOnly', type: 'user' }, { id: 'ks29437-clone', role: 'ReadOnly', type: 'user' }])).toBe(true);
        expect(wrapper.state().selectedOption).toEqual([]);
    });
});
