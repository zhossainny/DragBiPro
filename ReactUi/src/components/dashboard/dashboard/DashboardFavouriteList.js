import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from "react-router-dom";

class DashboardFavouriteList extends React.Component{
    constructor(props, context) {
        super(props, context);
    }

    getNoDataPlaceholder() {
        return (<DisabledRow>No available dashboards</DisabledRow>);
    }

    render(){
        const rows = this.props.dashboards.map((dashboard) =>{
            let url = "/dashboard/" + dashboard.key;
            return (<ListItem key={dashboard.key}>
                <ListRow>
                    <AppNameDiv>
                        <AppLink target="_blank" to={url}>{dashboard.name}</AppLink>
                        <Description>{dashboard.description}</Description>
                    </AppNameDiv>
                </ListRow>
            </ListItem>);
        });
        return(
            <div>
                <HeaderSmall>{this.props.caption}</HeaderSmall>
                <List>
                    {rows.length > 0 ? rows : this.getNoDataPlaceholder()}
                </List>
            </div>);
    }
}

DashboardFavouriteList.propTypes = {
    dashboards: PropTypes.array.isRequired,
    userId: PropTypes.string.isRequired,
    caption: PropTypes.string.isRequired
};

const HeaderSmall = styled.h2`
    margin-top: 0;
    padding-top: 10px;
    font-size: 1em;
    font-weight: 400;
    margin-bottom: 20px;
    padding-top: 20px;
    color: #d1551d;
    display: inline-block;
`;

const Description = styled.div`
    color: #b1b5bb;
    text-decoration: none;
    float: right;
    font-size: 12px;
    padding-top: 3px;
`;

const List = styled.ol`
    width: 100%;    
    padding-right: 5%;
`;

const ListItem = styled.li`
    list-style-type: none;
`;

const AppNameDiv = styled.div`
    margin-left: 10px;
    padding-right: 3%;
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
    border-top: 1px solid #e2e0e0;
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

export default DashboardFavouriteList;
