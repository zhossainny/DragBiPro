import '@babel/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import { BrowserRouter as Router} from 'react-router-dom';

import App from './components/App';
import configureStore, {runSagas} from './store/configureStore';
import {loadApps, loadAppsByRole} from './actions/appActions';
import {loadCollections} from './actions/storeActions';
import {loadUsers, loadGroups, laodCurrentUser} from './actions/userActions';
import {ag_grid_licence} from './configuration/config';
import {LicenseManager} from "ag-grid-enterprise/main";
import {BrowserAuth} from './auth/browserAuth';
LicenseManager.setLicenseKey(ag_grid_licence);

const store = configureStore();

function initialLoad() {
       BrowserAuth.refreshAccessToken();
      runSagas();
      return Promise.all([
        store.dispatch(loadApps()),
        store.dispatch(loadUsers()),
        store.dispatch(loadGroups()),
        store.dispatch(laodCurrentUser()),
        store.dispatch(loadCollections()),
        store.dispatch(loadAppsByRole("Admin"))
      ]);
}

initialLoad().then(() => {
    console.log("loaded apps");
});




ReactDOM.render(
    <Router>
       <Provider store={store}>
        <App/>
      </Provider>
    </Router>,
    document.getElementById('app')
);

