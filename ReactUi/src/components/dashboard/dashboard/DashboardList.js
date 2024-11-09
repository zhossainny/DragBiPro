import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from "react-router-dom";
import faStar from "@fortawesome/free-regular-svg-icons/faStar";
import faTrash from "@fortawesome/free-regular-svg-icons/faTrashAlt";
import DashboardIcon from '../../common/DashboardIcon';
import composedUserHelper from './../../utils/UserHelper';

export class Dashboardlist extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            collapsed: true
        };

        this.toggleGroupVisibility = this.toggleGroupVisibility.bind(this);
        this.isFavouriteDashboard = this.isFavouriteDashboard.bind(this);
    }

    componentDidUpdate() {
        if (this.state.collapsed && !this.props.collapsed) {
            this.setState({ collapsed: false });
        }
    }

    getNoDataPlaceholder() {
        return (<DisabledRow>No available dashboards</DisabledRow>);
    }

    toggleGroupVisibility() {
        this.setState({ collapsed: !this.state.collapsed });
    }

    isFavouriteDashboard(dashboard) {
        return dashboard && this.props.favourites.includes(dashboard.key);
    }

    resolveUrl(dashboard) {
        let prefix = this.props.userId + "-";

        if (dashboard.tags && dashboard.tags.shared === "false" && dashboard.key.startsWith(prefix)) {
            let key = dashboard.key.replace(prefix, "");
            return "/dashboard/" + this.props.userId + "/" + key;
        } else {
            return "/dashboard/" + dashboard.key;
        }
    }

    render() {
        const rows = this.props.dashboards.map((dashboard) => {
            let url = this.resolveUrl(dashboard);

            return (<ListItem key={dashboard.key}>
                <ListRow>
                    <AppNameDiv>
                        <AppLink target="_blank" to={url}>{dashboard.name}</AppLink>
                        <DashboardIcon icon={faTrash} className={!this.props.isAdminOn(dashboard.key) ? 'disabled' : ''} value={dashboard} onClick={this.props.onDeleteDashboard} />
                        <DashboardIcon icon={faStar} className={this.isFavouriteDashboard(dashboard) ? 'favourite' : ''} value={dashboard} onClick={this.props.onFavouritesChanged} />
                        <Description>{dashboard.description}</Description>
                    </AppNameDiv>
                </ListRow>
            </ListItem>);
        });
        return (
            <div>
                <HeaderContainer onClick={this.toggleGroupVisibility}>
                    <HeaderSmall onClick={this.toggleGroupVisibility}>{this.props.caption}</HeaderSmall>
                    <CollapseIcon className={this.state.collapsed ? "fa fa-angle-down" : "fa fa-angle-up"}
                        onClick={this.toggleGroupVisibility} />
                </HeaderContainer>
                {!this.state.collapsed && <List>
                    {rows.length > 0 ? rows : this.getNoDataPlaceholder()}
                </List>}
            </div>);
    }
}

Dashboardlist.propTypes = {
    dashboards: PropTypes.array.isRequired,
    userId: PropTypes.string.isRequired,
    caption: PropTypes.string.isRequired,
    favourites: PropTypes.array,
    collapsed: PropTypes.bool,
    onFavouritesChanged: PropTypes.func,
    onDeleteDashboard: PropTypes.func
};

const CollapseIcon = styled.i`
    margin-left: 5px;
    color: #42526eab;
    font-weight: 600 !Important;
    float: right;
    margin-top: 12px;
    margin-right: 25px;
    font-size: 14pt !Important;
`;

const HeaderSmall = styled.h2`
    font-size: 1em;
    font-weight: 400;
    color: #42526E;
    display: inline-block;
    margin-left: 20px;
    margin-top: 15px;
    margin-bottom: 15px;
`;

const Description = styled.div`
    color: #b1b5bb;
    text-decoration: none;
    float: right;
    font-size: 12px;
    padding-top: 3px;
`;

const HeaderContainer = styled.div`
    width: 98%;
    height: 40px;
    background: #5b52540a;
    margin-bottom: 10px;
      &:hover{
        background: #5b525414;
        cursor: pointer;
    }
`;

const List = styled.ol`
    width: 100%;    
    padding-right: 2%;
`;

const ListItem = styled.li`
    list-style-type: none;
`;

const AppNameDiv = styled.div`
    margin-left: 10px;
    padding-right: 5%;
    display: inline-block;
    color: #42526E;
    width: 100%;
    &:hover{
        text-decoration: underline;
    }
`;

const ListRow = styled.div`
    padding-top: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid #e2e0e0;
`;

const AppLink = styled(Link)`
    color: #42526E;
    text-decoration: none;
`;

const DisabledRow = styled.label`
    font-weight: 400;
    margin-left: 20px;
    color: darkgray;
`;

export default composedUserHelper(Dashboardlist);
