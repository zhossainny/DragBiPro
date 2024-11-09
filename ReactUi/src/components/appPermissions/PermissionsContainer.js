import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import * as appActions from '../../actions/appActions';

import PermissionsTable from './PermissionsTable';
import TableRow from './TableRow';


class PermissionsContainer extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.addMembers = this.addMembers.bind(this);
        this.deleteMember = this.deleteMember.bind(this);
        this.updateMember = this.updateMember.bind(this);
    }

    addMembers(members){
        if (this.props.addMembersHandler) {
            this.props.addMembersHandler(this.props.appKey, members);
        } else {
            this.props.actions.addMembers(this.props.appKey, members);
        }
    }

    deleteMember(member){
        if (this.props.deleteMembersHandler) {
            this.props.deleteMembersHandler(this.props.appKey, member);
        } else {
            this.props.actions.deleteMember(this.props.appKey, member);
        }
    }

    updateMember(member){
        if (this.props.updateMembersHandler) {
            this.props.updateMembersHandler(this.props.appKey, member);
        } else {
            this.props.actions.updateMember(this.props.appKey, member);
        }
    }

    render() {
        return (            
            <PermissionsTable
                            title={this.props.title} 
                            members={this.props.members} 
                            allPrincipals={this.props.allPrincipals} 
                            addMembers={this.addMembers} 
                            deleteMember={this.deleteMember}
                            principalType={this.props.principalType}
                            onMemberPermissionChange={this.updateMember} />
        );
    }
}


PermissionsContainer.propTypes = {
    title : PropTypes.string.isRequired,
    appKey: PropTypes.string.isRequired,
    members: PropTypes.array.isRequired,
    principalType : PropTypes.string.isRequired,
    allPrincipals : PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired,
    addMembersHandler: PropTypes.func,
    deleteMembersHandler: PropTypes.func,
    updateMembersHandler: PropTypes.func
};

function mapStateToProps(state, ownProps) {
    return{};
}
    
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({...appActions}, dispatch)
    };
}
    
export default connect(mapStateToProps, mapDispatchToProps)(PermissionsContainer);
