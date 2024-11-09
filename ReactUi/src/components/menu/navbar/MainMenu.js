import React from 'react';
import PropTypes from 'prop-types';
import { faCog, faDatabase, faStar, faHome, faUser } from '@fortawesome/free-solid-svg-icons/index';
import MainMenuItem from './MainMenuItem';
import styled from 'styled-components';
import { TAG_ADMIN, TAG_COLLECTIONS, TAG_FAVOURITES, TAG_PROFILE, TAG_HOME } from './../../../configuration/constants';

export class MainMenu extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            selectedTag: props.tag
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.tag !== this.props.tag) {
            this.setState({ selectedTag: this.props.tag });
        }
    }

    onMenuItemClick = tag => {
        if (this.state.selectedTag !== tag) {
            this.props.onClick(tag);
        }
    }

    render() {
        return (<Ul>
            <MainMenuItem
                key={TAG_HOME}
                value={TAG_HOME}
                onClick={this.onMenuItemClick}
                active={this.state.selectedTag === TAG_HOME}
                icon={faHome}
                label="Home" />
            <MainMenuItem
                key={TAG_FAVOURITES}
                value={TAG_FAVOURITES}
                onClick={this.onMenuItemClick}
                active={this.state.selectedTag === TAG_FAVOURITES}
                icon={faStar}
                label="Favourites" />
            <MainMenuItem
                key={TAG_COLLECTIONS}
                value={TAG_COLLECTIONS}
                onClick={this.onMenuItemClick}
                active={this.state.selectedTag === TAG_COLLECTIONS}
                icon={faDatabase}
                label="Collections" />
            <MainMenuItem
                key={TAG_ADMIN}
                value={TAG_ADMIN}
                onClick={this.onMenuItemClick}
                active={this.state.selectedTag === TAG_ADMIN}
                icon={faCog} 
                label="Admin" />
            <MainMenuItem
                key={TAG_PROFILE}
                value={TAG_PROFILE}
                onClick={this.onMenuItemClick}
                active={this.state.selectedTag === TAG_PROFILE}
                icon={faUser}
                label="My Profile" />
        </Ul>);
    }
}

MainMenu.propTypes = {
    onClick: PropTypes.func,
    tag: PropTypes.string.isRequired
};

const Ul = styled.ul`
    margin-top: 20px;
    font-weight: 400;
    font-size: 0.9em;
    list-style:none;
    padding: 0;
    position: relative;
`;
