/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import styled from 'styled-components';
import Header from "./Header";
import CategoriesMenu from "./CategoriesMenu";
import Card from './Card';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import * as favouritesActions from '../../../actions/favouritesActions';
import * as filteredAppsAction from '../../../actions/filteredAppsActions';
import * as dashboardActions from '../../../actions/dashboardActions';
import * as appActions from '../../../actions/appActions';
import AppDeleteModal from '../../dashboard/dashboard/AppDeleteModal';
import '../../../css/media.css';
import DashboardNotificationContainer from './../../dashboard/dashboard/DashboardNotificationContainer';
import { PropTypes } from 'prop-types';
import CardsGrid from './../../common/CardsGrid';



export class DashboardsPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            appToDelete: null,
            sort: 'az',
            searchTerm: '',
            category: props.match.params.category
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.apps !== this.props.apps) {
            this.props.actions.filterAndSort(this.props.apps, this.state.category, this.state.searchTerm, this.state.sort);
        }

        if (this.props.match.params.category !== this.state.category) {
            this.setState({ category: this.props.match.params.category });
            this.props.actions.filterAndSort(this.props.apps, this.props.match.params.category, this.state.searchTerm, this.state.sort);
        }
    }

    componentWillUnmount() {
        this.props.actions.resetFilteredApps(this.props.apps, this.state.sort);
    }

    setAppToDelete = app => this.setState({ appToDelete: app });

    deleteApp = () => {
        this.props.actions.deleteApp(this.state.appToDelete.key);
        this.props.actions.showDashboardNotification({ type: 'info', message: `App ${this.state.appToDelete.name} deleted` });
        this.setAppToDelete(null);
    }

    searchTextChanged = searchTerm => {
        this.setState({ searchTerm });
        this.props.actions.filterAndSort(this.props.apps, this.state.category, searchTerm, this.state.sort);
    }

    sortChanged = sort => {
        this.setState({ sort });
        this.props.actions.sort(sort);
    };

    resolveCategories = () => {
        const distinctCategories = new Set();
        this.props.apps.forEach(app => app.region && distinctCategories.add(app.region));
        return Array.from(distinctCategories.values()).map(value => ({ label: value, value, subcategories: []}));
    }

    onFavourite = (appKey, unfavourite) => {
        if(unfavourite) {
            this.props.actions.unfavouriteApp(this.props.userId, appKey);
        } else {
            this.props.actions.favouriteApp(this.props.userId, appKey);
        }
    }

    render() {
        const { match, filteredApps, userId } = this.props;
        return (
            <Container>
                {/*<CategoriesMenu categories={this.resolveCategories()} category={match.params.category} subCategory={match.params.subCategory} />*/}
                <CardsSection>
                    <Header onSearchTextChanged={this.searchTextChanged} onSortChanged={this.sortChanged} defaultSort={this.state.sort} />
                    <h3>Sample Apps </h3><br/>
                    <CardsGrid className="cards-grid">
                        {filteredApps.map(app => (<Card key={app.key} app={app} userId={userId} onDelete={this.setAppToDelete} onFavourite={this.onFavourite} />))}
                    </CardsGrid>
                </CardsSection>
                <AppDeleteModal app={this.state.appToDelete} onOk={this.deleteApp} onCancel={(() => this.setAppToDelete(null))} />
                <DashboardNotificationContainer />
            </Container>
        );
    }
}

DashboardsPanel.propTypes = {
    apps: PropTypes.array,
    filteredApps: PropTypes.array,
    userId: PropTypes.string,
    actions: PropTypes.object,           
};

const Container = styled.div`
    padding: 20px;
    height: 100%;
    width: 100%;
     display: grid;
    // grid-template-columns: minmax(10%, 250px) 1fr;
    // grid-gap: 30px;
     background-image:linear-gradient(#262626 50%,#330033);
`;
const CardsSection = styled.div`
    //position: relative;
`;


function mapStateToProps(state) {
    return {
        apps: state.apps,
        filteredApps: state.filteredApps,
        userId: state.admin.userId
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...filteredAppsAction, ...favouritesActions, ...dashboardActions, ...appActions }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardsPanel);

