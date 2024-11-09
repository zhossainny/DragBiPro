import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import NavBarSubMenu from './NavBarSubMenu';
import { faAngleRight, faAngleDown } from "@fortawesome/free-solid-svg-icons/index";

class CategoryMenuItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            expanded: props.active
        };
    }

    componentDidUpdate() {
        if (!this.props.active && this.state.expanded) {
            this.setState({ expanded: false });
        }
    }

    onCategoryChange = e => {
        if(this.props.active) {
            e.preventDefault();
            e.stopPropagation();
        }
        this.setState(prevState => ({ expanded: !prevState.expanded }));
    }

    routeFromValue = () => {
        return `/categories/${this.props.value}`;
    }

    render() {
        return (<Li
            active={this.props.active}>
            <NavLink to={this.routeFromValue()} onClick={this.onCategoryChange}>
                <Icon icon={(this.state.expanded && this.props.subcategories.length) ? faAngleDown : faAngleRight} fixedWidth />
                {this.props.name}
            </NavLink>
            <NavBarSubMenu
                subcategories={this.props.subcategories}
                category={null}
                active={this.state.expanded} />
        </Li>);
    }
}

CategoryMenuItem.propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    subcategories: PropTypes.array.isRequired,
    active: PropTypes.bool.isRequired,
    onToggleCategory: PropTypes.func
};

const Li = styled.li`
    padding: 10px 0px 10px 15px;
    cursor: ${props => props.active ? 'pointer' : 'default'};  
    border-bottom: 1px dashed #d9d9d9;
    a {
        color: ${props => props.active ? '#ff7261' : '#3b3b3b'};
        &:hover {
        cursor: pointer;
        color: #ff7261;
        }
    }
`;

const Icon = styled(FontAwesomeIcon)`
    margin-right: 5px;
    color: #646464;
    pointer-events: none;
`;

export default CategoryMenuItem;