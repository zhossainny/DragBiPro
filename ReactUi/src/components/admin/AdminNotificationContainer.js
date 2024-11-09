import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Notification from "../common/Notification";
import * as adminActions from "../../actions/adminActions";

class AdminNotificationContainer extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.onClearNotification = this.onClearNotification.bind(this);
    }

    onClearNotification() {
        this.props.actions.clearAdminNotification();
    }

    render() {
        let show = Object.keys(this.props.notification).length !== 0;

        return (
            <Notification show={show} type={this.props.notification.error ? "error" : "info"} onClearNotification={this.onClearNotification}>
                {this.props.notification.message}
            </Notification>
        );
    }
}

AdminNotificationContainer.propTypes = {
    notification: PropTypes.object,
    actions: PropTypes.object
};

function mapStateToProps(state) {
    return {
        notification: state.admin.notification
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({...adminActions}, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminNotificationContainer);