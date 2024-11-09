import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Notification from "../../common/Notification";
import * as dashboardActions from "../../../actions/dashboardActions";

class DashboardNotificationContainer extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.onClearNotification = this.onClearNotification.bind(this);
    }

    onClearNotification() {
        this.props.actions.clearDashboardNotification();
    }

    render() {
        let show = Object.keys(this.props.notification).length !== 0;

        return (
            <Notification show={show} type={this.props.notification.type} onClearNotification={this.onClearNotification}>
                {this.props.notification.message}
            </Notification>
        );
    }
}

DashboardNotificationContainer.propTypes = {
    notification: PropTypes.object,
    actions: PropTypes.object
};

function mapStateToProps(state) {
    return {
        notification: state.dashboard.notification
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({...dashboardActions}, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardNotificationContainer);