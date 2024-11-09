import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import DashboardList from "./DashboardList";
import * as appActions from "../../../actions/appActions";
import * as dashboardActions from "../../../actions/dashboardActions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Spacer from "../../common/Spacer";
import DashboardNotificationContainer from "./DashboardNotificationContainer";
import DashboardFavouriteList from "./DashboardFavouriteList";
import AppDeleteModal from './AppDeleteModal';

export class DashboardOverviewContainer extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            showDeleteConfirmation: false,
            selectedDashboard: null
        };

        this.favouritesChanged = this.favouritesChanged.bind(this);
        this.showNotification = this.showNotification.bind(this);
    }

    favouritesChanged(dashboard) {
        if (!dashboard) return;
        let newFavs = [];
        if (!this.props.options.favourites.includes(dashboard.key)) {
            newFavs = this.props.options.favourites.concat([]);
            newFavs.push(dashboard.key);
            this.showNotification('info', dashboard.name + " Added to Favourites!");
        } else {
            newFavs = this.props.options.favourites.filter(fav => fav !== dashboard.key);
            this.showNotification('info', dashboard.name + " Removed from Favourites!");
        }
        let copy = Object.assign({}, this.props.options);
        copy.favourites = newFavs;
        this.props.onOptionsChanged(copy);
    }

    confirmDeleteDashboard = dashboard => {
        this.setState({ showDeleteConfirmation: true, selectedDashboard: dashboard });
    };

    cancelDeleteDashboard = () => {
        this.setState({ showDeleteConfirmation: false, selectedDashboard: null });
    };

    onDeleteDashboard = () => {
        this.props.actions.deleteApp(this.state.selectedDashboard.key);
        this.props.actions.showDashboardNotification({ type: 'info', message: `Dashboard ${this.state.selectedDashboard.name} deleted` });
        this.setState({ showDeleteConfirmation: false, selectedDashboard: null });
    };

    showNotification(type, message) {
        this.props.actions.showDashboardNotification({ type: type, message: message });
    }

    buildFavouriteDashboards(dashboards) {
        if (!this.props.options.showFavourites)
            return null;
        let favs = dashboards.filter(d => this.props.options.favourites.includes(d.key));
        if (favs.length === 0) return null;
        return [<DashboardFavouriteList
            caption={"Favourites"}
            userId={this.props.userId}
            dashboards={favs}
            onNotification={this.showNotification} />];
    }

    buildDashboardGroups(dashboards) {
        let dashboardGroups = [];
        let personal = [];
        let shared = [];
        for (let dash of dashboards) {
            if (dash.tags && dash.tags.shared === "true") {
                shared.push(dash);
            } else {
                personal.push(dash);
            }
        }
        let expandDashboardGroups = this.props.options.filter || this.props.options.tagFilter;
        if (this.props.options.groupByTags) {
            let tagMap = new Map();
            for (let dashboard of dashboards) {
                let tag = 'No Tag';
                if (dashboard && dashboard.tags && dashboard.tags.tag) {
                    tag = dashboard.tags.tag;
                }
                let taggedDashboards = tagMap.get(tag);
                if (taggedDashboards) {
                    taggedDashboards.push(dashboard);
                } else {
                    tagMap.set(tag, [dashboard]);
                }
            }

            for (let [tag, value] of tagMap) {
                dashboardGroups.push(
                    <DashboardList
                        key={tag}
                        caption={tag}
                        collapsed={!expandDashboardGroups}
                        favourites={this.props.options.favourites}
                        onFavouritesChanged={this.favouritesChanged}
                        onDeleteDashboard={this.confirmDeleteDashboard}
                        userId={this.props.userId}
                        dashboards={value} />);
            }
        } else {
            dashboardGroups = [
                <DashboardList
                    key={"Personal"}
                    caption={"Personal"}
                    collapsed={!expandDashboardGroups}
                    favourites={this.props.options.favourites}
                    onFavouritesChanged={this.favouritesChanged}
                    onDeleteDashboard={this.confirmDeleteDashboard}
                    userId={this.props.userId}
                    dashboards={personal} />,
                <DashboardList
                    key={"Shared"}
                    caption={"Shared"}
                    collapsed={!expandDashboardGroups}
                    favourites={this.props.options.favourites}
                    onFavouritesChanged={this.favouritesChanged}
                    onDeleteDashboard={this.confirmDeleteDashboard}
                    userId={this.props.userId}
                    dashboards={shared} />];
        }
        return dashboardGroups;
    }

    filterDashboards() {
        let dashboards = this.props.apps.filter(app => app.appType === "DASHBOARD");
        if (this.props.options.filter) {
            dashboards = dashboards.filter(dash => dash.name.toLowerCase().includes(this.props.options.filter.toLowerCase()));
        }
        if (this.props.options.tagFilter) {
            dashboards = dashboards.filter(dash => dash.tags && dash.tags.tag && dash.tags.tag === this.props.options.tagFilter);
        }
        return dashboards;
    }

    render() {
        if (!this.props.userId) return null;
        let dashboards = this.filterDashboards();
        let dashboardGroups = this.buildDashboardGroups(dashboards);
        let favouriteDashboards = this.buildFavouriteDashboards(dashboards);

        return (
            <Content>
                <Header>Available Dashboards</Header>
                <Spacer verticalSpacing={20} horizontalSpacing={0} />
                {this.props.options.showFavourites && favouriteDashboards}
                {this.props.options.showFavourites && <Spacer verticalSpacing={20} horizontalSpacing={0} />}
                {dashboardGroups}
                <DashboardNotificationContainer />
                <AppDeleteModal show={this.state.showDeleteConfirmation} dashboard={this.state.selectedDashboard} onOk={this.onDeleteDashboard} onCancel={this.cancelDeleteDashboard} />
            </Content>);
    }
}

DashboardOverviewContainer.propTypes = {
    options: PropTypes.object,
    groupByTags: PropTypes.bool,
    userId: PropTypes.string,
    onOptionsChanged: PropTypes.func,
    apps: PropTypes.array,
    actions: PropTypes.object
};

const Content = styled.div`
    padding: 30px;
    padding-top: 10px;
    height: 100%;
    width: 100%;
    margin-top: 50px;
    margin-left: 5%;
    margin-right: 5%;
    background-color:white;
    border: 1px solid #e1e1e1;
    border-radius: 4px;
    display:table;   
`;

const Header = styled.h2`
    font-size: 1.25em;
    font-weight: 400;
    padding-top: 20px;
    color: #42526E;
    display: inline-block;
`;

function mapStateToProps(state) {
    return {
        apps: state.apps,
        userId: state.admin.userId
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...appActions, ...dashboardActions }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardOverviewContainer);



