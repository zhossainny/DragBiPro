import React from 'react';
import PropTypes from 'prop-types';

import PermissionsTable from '../appPermissions/PermissionsContainer';

class CollectionPermissions extends React.Component {


    render() {
        let allUsers = this.props.allUsers.filter(u => !this.props.userMembers.some(m => m.id === u.id));
        let allGroups = this.props.allGroups.filter(u => !this.props.groupMembers.some(m => m.id === u.id));


        return (
            <React.Fragment>
                <PermissionsTable title="Group Access"
                    principalType="group"
                    addMembersHandler={this.props.addMembersHandler}
                    deleteMembersHandler={this.props.deleteMembersHandler}
                    updateMembersHandler={this.props.updateMembersHandler}
                    members={this.props.groupMembers}
                    allPrincipals={allGroups}
                    appKey={this.props.collection} />
                <PermissionsTable title="User Access"
                    principalType="user"
                    addMembersHandler={this.props.addMembersHandler}
                    deleteMembersHandler={this.props.deleteMembersHandler}
                    updateMembersHandler={this.props.updateMembersHandler}
                    members={this.props.userMembers}
                    allPrincipals={allUsers}
                    appKey={this.props.collection} />
            </React.Fragment>);
    }
}

CollectionPermissions.propTypes = {
    collection: PropTypes.string.isRequired,
    allUsers: PropTypes.array.isRequired,
    allGroups: PropTypes.array.isRequired,
    userMembers: PropTypes.array.isRequired,
    groupMembers: PropTypes.array.isRequired,
    addMembersHandler: PropTypes.func,
    deleteMembersHandler: PropTypes.func,
    updateMembersHandler: PropTypes.func
};

export default CollectionPermissions;