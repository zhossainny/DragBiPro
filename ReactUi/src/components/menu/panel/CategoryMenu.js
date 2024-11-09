import React from 'react';
import PropTypes from 'prop-types';
import CategoryMenuItem from "./CategoryMenuItem";
import styled from 'styled-components';

export default class CategoryMenu extends React.Component {

    constructor(props, context) {
        super(props, context);
    }

    menu() {
        return this.props.categories.map(category => {
            let showSubcategories = category.value === this.props.selectedCategory;

            return (<CategoryMenuItem
                key={category.value}
                value={category.value}
                name={category.label}
                active={showSubcategories}
                subcategories={category.subcategories} />);
        });
    }

    render() {
        return (<ExpandingList>{this.menu()}</ExpandingList>);
    }
}

const ExpandingList = styled.ul`
    font-weight: 400;
    font-size: 0.95em;
    list-style:none;
    padding: 0;
`;

CategoryMenu.propTypes = {
    categories: PropTypes.array.isRequired,
    selectedCategory: PropTypes.string,
};


