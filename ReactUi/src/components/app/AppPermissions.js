import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import PermissionsTable from '../appPermissions/PermissionsContainer';

class AppPermissions extends React.Component {

    render() {
        let allUsers = this.props.allUsers.filter(u => !this.props.userMembers.some(m => m.id === u.id));
        let allGroups = this.props.allGroups.filter(u => !this.props.groupMembers.some(m => m.id === u.id));


        return (<React.Fragment>
            <PermissionsTable title="Group Access"
                principalType="group"
                members={this.props.groupMembers}
                allPrincipals={allGroups}
                appKey={this.props.appKey} />
            <PermissionsTable title="User Access"
                principalType="user"
                members={this.props.userMembers}
                allPrincipals={allUsers}
                appKey={this.props.appKey} />
        </React.Fragment>);
    }
}

AppPermissions.propTypes = {
    appKey: PropTypes.string.isRequired,
    allUsers: PropTypes.array.isRequired,
    allGroups: PropTypes.array.isRequired,
    userMembers: PropTypes.array.isRequired,
    groupMembers: PropTypes.array.isRequired
};

export default AppPermissions;