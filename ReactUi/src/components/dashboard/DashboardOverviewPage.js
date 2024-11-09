import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {uniq} from 'lodash';
import DashboardNavBar from "./navbar/DashboardNavBar";
import DashboardOverviewContainer from "./dashboard/DashboardOverviewContainer";
import {getCollectionMeta} from "../../functions/collectionUtils";
import {bindActionCreators} from "redux";
import * as appActions from "../../actions/appActions";
import * as storeActions from "../../actions/storeActions";
import * as dashboardActions from "../../actions/dashboardActions";
import {connect} from "react-redux";

class DashboardOverviewPage extends React.Component{
    constructor(props, context) {
        super(props, context);

        this.state = {
            searchText : "",
            showAppInfo : false,
            dashboardOptions: {
                filter: null,
                tagFilter: null,
                groupByTags: false,
                showFavourites: false,
                favourites: []
            },
            optionsLoaded: false,
            app : {}
        };

        this.optionsChanged = this.optionsChanged.bind(this);
    }

   componentDidMount(){
        this.restoreUserPreferences();
   }

    componentDidUpdate() {
        this.restoreUserPreferences();
    }

    getDashboardTags() {
        let tags = [];
        if (!this.props.apps) return tags;
        for (let app of this.props.apps) {
            if (app && app.appType === "DASHBOARD" && app.tags && app.tags.tag) {
                tags.push(app.tags.tag);
            }
        }
        if (this.state.tag)
            tags.push(this.state.tag);
        tags.sort();
        return uniq(tags);
    }

    restoreUserPreferences() {
        if (!this.state.optionsLoaded && Object.keys(this.props.preferences).length > 2) {
            let prefs = this.props.preferences;
            let copy = Object.assign({}, this.state.dashboardOptions);
            copy.groupByTags = prefs.groupByTags;
            copy.showFavourites = prefs.showFavourites;
            copy.favourites = prefs.favourites;
            this.setState({
                dashboardOptions: copy,
                optionsLoaded: true
            });
        }
    }

    optionsChanged(value, save = true) {
        this.setState({dashboardOptions: value});
        let prefCopy = Object.assign({}, this.props.preferences);
        prefCopy.groupByTags = value.groupByTags;
        prefCopy.showFavourites = value.showFavourites;
        prefCopy.favourites = value.favourites;
        if (save)
            this.props.actions.saveUserPreferences(getCollectionMeta(this.props.userId), prefCopy);
    }

    render(){
        return(
            <Container>
                <DashboardNavBar onOptionsChanged={this.optionsChanged} options={this.state.dashboardOptions} tags={this.getDashboardTags()}/>
                <DashboardOverviewContainer onOptionsChanged={this.optionsChanged} options={this.state.dashboardOptions} />
            </Container>
        );
    }
}


DashboardOverviewPage.propTypes = {
    userId: PropTypes.string,
    actions: PropTypes.object,
    apps: PropTypes.array,
    preferences: PropTypes.object
};

const Container = styled.div`
    height: 100%;
    width: 100%;
    display: flex;
    vertical-align: top;
`;

function mapStateToProps(state) {
    return{
        preferences : state.dashboard.preferences,
        userId: state.admin.userId,
        apps: state.apps
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({...appActions, ...storeActions, ...dashboardActions}, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardOverviewPage);



