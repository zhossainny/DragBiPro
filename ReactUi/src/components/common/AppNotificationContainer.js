import React from 'react';
import PropTypes from 'prop-types';
import Notification from './Notification';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as notificationActions from '../../actions/appNotificationActions';

class AppNotificationContainer extends React.Component{
    constructor(props, context){
        super(props,context);

        this.onClearNotification = this.onClearNotification.bind(this);
    }

    onClearNotification(){
        this.props.actions.clearNotification();
    }

    render(){
        let show = Object.keys(this.props.notification).length !== 0;
        let appKey = show ? this.props.notification.app.key : "";

        return (<Notification show={show} type={"info"} onClearNotification={this.onClearNotification}>
                <div>Your app <AppKeyLink to={`/browse/app/${appKey}`}>{appKey}</AppKeyLink> has been created</div>
        </Notification>);
    }
}

AppNotificationContainer.propTypes={
    actions : PropTypes.object.isRequired,
    notification: PropTypes.object
};

export const AppKeyLink = styled(({active, children, ...props}) => React.createElement(Link, props, children))`
    text-decoration:none;
    color: #2FA7E0;
    &:hover{
        text-decoration: underline;
    }
`;


function mapStateToProps(state){
    return{
        notification : state.notification
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(notificationActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AppNotificationContainer);