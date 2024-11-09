import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from "react-router-dom";
import SearchBox from "../../menu/panel/SearchBox";
import Spacer from "../../common/Spacer";
import CheckInput from './../../common/CheckInput';

class DashboardNavBar extends React.Component{
    constructor(props, context) {
        super(props, context);

        this.state ={
            visibleCategory : ""
        };

        this.onSearchTextEntered = this.onSearchTextEntered.bind(this);
        this.onToggleCategory = this.onToggleCategory.bind(this);
        this.groupByTagsCheckboxHandler = this.groupByTagsCheckboxHandler.bind(this);
        this.showFavouritesCheckboxHandler = this.showFavouritesCheckboxHandler.bind(this);
    }

    onToggleCategory(categoryName){
        this.setState({
            visibleCategory : categoryName
        });
    }

    groupByTagsCheckboxHandler(e) {
        let value = e.target.checked;
        let copy = Object.assign({}, this.props.options);
        copy.groupByTags = value;
        this.props.onOptionsChanged(copy);
    }

    showFavouritesCheckboxHandler(e) {
        let value = e.target.checked;
        let copy = Object.assign({}, this.props.options);
        copy.showFavourites = value;
        this.props.onOptionsChanged(copy);
    }

    onSearchTextEntered(value){
        let copy = Object.assign({}, this.props.options);
        copy.filter = value;
        this.props.onOptionsChanged(copy, false);
    }

    tagFilterChanged(tag){
        if (!tag) return;
        let copy = Object.assign({}, this.props.options);
        copy.tagFilter = tag === 'All' ? null : tag;
        this.props.onOptionsChanged(copy, false);
    }

    buildTagMenuItems() {
        let tagMenuItems = [];
        let tags = ['All'].concat(this.props.tags);
        for (let tag of tags) {
            tagMenuItems.push(
                <TagMenuLabel
                    key={tag}
                    onClick={() => this.tagFilterChanged(tag)}
                    active={tag === this.props.options.tagFilter || (!this.props.options.tagFilter && tag === 'All')}>{tag}
                </TagMenuLabel>);
        }
        return tagMenuItems;
    }

    render(){
        return(
            <NavBar className="sub-nav">
                <h3 className="nav-header">Dashboards</h3>;
                <SearchBox placeholder={"Filter Dashboards.."} onTextChanged={this.onSearchTextEntered}/>
                <MenuItemText to={"/newApp"}>
                    <MenuItemIcon className="fa fa-th-large" aria-hidden="true"/>
                    New Dashboard
                </MenuItemText>
                <Spacer verticalSpacing={15} horizontalSpacing={0}/>
                <CheckInput marginLeft={'27px !important'}
                            width={'20px'}
                            type="checkbox"
                            id={'groupCheck'}
                            name="groupingByTag"
                            className="widgetSettingCheckbox"
                            onChange={this.groupByTagsCheckboxHandler}
                            checked={this.props.options.groupByTags}
                            value={this.props.options.groupByTags}/>
                <CheckboxLabel htmlFor="groupCheck">Group by Tags</CheckboxLabel>
                <Spacer verticalSpacing={5} horizontalSpacing={0}/>
                <CheckInput marginLeft={'27px !important'}
                            width={'20px'}
                            type="checkbox"
                            id={'favCheck'}
                            name="groupingByTag"
                            className="widgetSettingCheckbox"
                            onChange={this.showFavouritesCheckboxHandler}
                            checked={this.props.options.showFavourites}
                            value={this.props.options.showFavourites}/>
                <CheckboxLabel htmlFor="favCheck">Show Favourites</CheckboxLabel>
                <Spacer verticalSpacing={30} horizontalSpacing={0}/>
                {this.buildTagMenuItems()}
            </NavBar>
        );
    }
}

DashboardNavBar.propTypes = {
    onOptionsChanged: PropTypes.func,
    options: PropTypes.object,
    tags: PropTypes.array
};

const NavBar = styled.nav`
    background:#444954;
    height:100%;
    display:table-cell;
    vertical-align:top;
    overflow:hidden;
    border-right: 1px solid #e5e5e5;
    user-select:none;
    width:230px;
    min-width:230px;
`;

const MenuItemIcon = styled.i`
    margin-right: 10px;
    font-size: 16px;
`;

const CheckboxLabel = styled.label`
    font-weight: 400;
    vertical-align: middle;
    margin-top: 2px;
    margin-left: 2px;
    font-family: Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif;
    color: #b1b5bb;
    font-size: 12px;
`;


const TagMenuLabel = styled.label`   
    font-weight:400;
    font-style: normal;     
    margin-top:5px;
    margin-bottom:5px;
    font-size:1.15em;
    width:12rem;
    border-radius: 3px;
    display: inline-block;
    color: ${props => props.active ? '#d1551d' : '#dddddd'};
    width:100%;
    text-decoration: none;
    display:block;
    padding-top: 10px; 
    padding-bottom: 10px;  
    padding-left: 30px;  
    &:hover  {
        background-color:#383d47;      
        color: ${props => props.active ? '#d1551d' : '#dddddd'};
        cursor: pointer;
    }
`;

const MenuItemText = styled(Link)`   
    font-weight:400;
    font-style: normal;     
    margin-top:5px;
    margin-bottom:5px;
    font-size:1.2em;
    width:12rem;
    border-radius: 3px;
    display: inline-block;
    color:#dddddd;   
    width:100%;
    text-decoration: none;
    display:block;
    padding-top: 10px; 
    padding-bottom: 10px;  
    padding-left: 30px;  
    &:hover  {
        background-color:#383d47;      
        color:#dddddd;  
    }
`;
export default DashboardNavBar;
