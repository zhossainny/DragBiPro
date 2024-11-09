/* eslint-disable react/jsx-boolean-value,react/no-did-update-set-state,react/no-did-mount-set-state */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Dashboard from "./dashboard/Dashboard";
import { RingLoader } from 'react-spinners';
import '../../css/dashboard.css';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import * as dashboardActions from "../../actions/dashboardActions";
import DashboardNotificationContainer from "./dashboard/DashboardNotificationContainer";
import SadFace from "../../images/sad_face.png";


class DashboardPage extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            errorMessage: null
        };
    }

    componentDidMount() {
        let key = this.props.match.params.dashboardKey;
        let version = this.props.match.params.version;
        if (key) {
            this.props.actions.loadDashboard(key, version);
            this.setState({currentKey: key});
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.notification.message !== prevState.errorMessage && this.props.notification.message) {
            this.setState({errorMessage: this.props.notification.message});
        }
    }
    
    getSavedDashboard() {
        return  this.props.loadedDashboards.find(x => x.key === this.props.match.params.dashboardKey);
    }

    dashboardReadyToRender() {
        let newDashboard = !this.props.match.params.dashboardKey;
        return newDashboard || (!this.props.loading && this.getSavedDashboard());
    }

    dashboardLoadingFailed() {
        return !this.props.loading && this.props.match.params.dashboardKey && !this.getSavedDashboard();
    }

    render() {
        let readyToRender = this.dashboardReadyToRender();
        let failedToLoad = this.dashboardLoadingFailed();
        return (
            <Container>
                {this.props.loading && <LoadingSpinnerContainer>
                    <RingLoader loading={true}
                                color={"#F39318"}
                                size={100}
                                />
                    <LoadingText>LOADING</LoadingText>
                </LoadingSpinnerContainer>}
                <DashboardNotificationContainer/>
                {readyToRender && <Dashboard
                    savedDashboard={this.getSavedDashboard()}/>}
                {failedToLoad &&
                    <ErrorContainer>
                        <SadImageContainer src={SadFace}/>
                        <ErrorText>{this.state.errorMessage}</ErrorText>
                    </ErrorContainer>
                }
            </Container>
        );
    }
}

DashboardPage.propTypes = {
    loading: PropTypes.bool,
    loadedDashboards: PropTypes.array,
    match: PropTypes.object,
    actions: PropTypes.object,
    notification: PropTypes.object
};

const Container = styled.div`
    height: 100%;
    width: 100%;
`;

const SadImageContainer = styled.img`
    display: block;
    margin-left: auto;
    margin-right: auto;
`;

const LoadingText = styled.div`
    margin-left: 10px;
    margin-top: 40px;
    font-weight: 300;
    font-size: 1.5em;
    color: #fbbd6c;
`;

const LoadingSpinnerContainer = styled.div`
    position: relative;
    top: 50%;
    left: 50%;
    margin-top: -150px;
    margin-left: -75px;
`;

const ErrorContainer = styled.div`
    position: relative;
    top: 50%;
    left: 50%;
    margin-top: -150px;
    margin-left: -260px;
    text-align: center; 
    width: 500px;
`;

const ErrorText = styled.div`
    margin-left: 10px;
    margin-top: 20px;
    font-weight: 300;
    font-size: 1.5em;
    color: #929292;
`;



function mapStateToProps(state) {
    return {
        loadedDashboards: state.dashboard.loadedDashboards,
        loading: state.dashboard.loading,
        notification: state.dashboard.notification
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({...dashboardActions}, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardPage);

