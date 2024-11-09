/* eslint-disable react/jsx-no-bind */
import React from 'react';
import '../../node_modules/toastr/build/toastr.min.css';

import AppsPageContainer from './apps/AppsPageContainer';
import AdminPageTabbed from './admin/AdminPageTabbed';
import Notification from './common/AppNotificationContainer';
import { Switch, Route, Redirect, BrowserRouter as Router } from 'react-router-dom';
import styled from 'styled-components';
import '../css/navbar.css';
import '../css/snackbar.css';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import DashboardPage from "./dashboard/DashboardPage";
import DashboardPermissionContainer from "./dashboard/dashboard/DashboardPermissionContainer";
import StorePage from "./store/StorePage";
import CollectionPage from "./store/CollectionPage";
//import AppNavBar from "./menu/navbar/AppNavBar";
import DashboardsPanel from './menu/panel/DashboardsPanel';
import Favourites from './favourites/Favourites';

class App extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            tag: ''
        };
    }

    onSelectionChanged = tag => this.setState({ tag })

    redirectToHome = () => {
        return <Redirect to="/home" />;
    }

    render() {
        return (
            <AppBody>
                {/*<AppNavBar onSelectionChanged={this.onSelectionChanged}/>*/}
                <Switch>
                    <Route exact path="/" component={DashboardsPanel} />
                    <Route path="/browse/dashboards" component={DashboardsPanel}/>
                    <Route path="/categories/:category?/:subCategory?" component={DashboardsPanel} />
                    <Route path="/admin" component={AdminPageTabbed} />
                    <Route path="/collections/:collection" component={CollectionPage} />
                    <Route path="/collections" component={StorePage} />
                    <Route path="/favourites" component={Favourites}/>
                    <Route path="/dashboard/permissions/:appKey" component={DashboardPermissionContainer} />
                    <Route path="/dashboard/:userId/:dashboardKey" component={DashboardPage} />
                    <Route path="/dashboard/:dashboardKey" component={DashboardPage} />
                    <Route path="/history/dashboard/:userId/:dashboardKey/:version" component={DashboardPage} />
                    <Route path="/history/dashboard/:dashboardKey/:version" component={DashboardPage} />
                    <Route path="/newApp" component={DashboardPage} />
                </Switch>
                <Notification />
            </AppBody>
        );
    }
}

const AppBody = styled.div`
    height: 100vh;
    display: flex;
`;

export default App;
