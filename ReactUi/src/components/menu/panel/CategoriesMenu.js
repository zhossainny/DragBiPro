import React from 'react';
import styled from 'styled-components';
import CategoryMenu from "./CategoryMenu";
import { PropTypes } from 'prop-types';
import { Link } from 'react-router-dom';

const CategoriesMenu = props => {
    return (<Container>
        <Header>
            <Title>Types of Apps</Title>
            {props.category && <Clear to="/categories">clear</Clear>}
        </Header>
        <Menu>
            <CategoryMenu categories={props.categories} selectedCategory={props.category} selectedSubCategory={props.subCategory} />
        </Menu>
    </Container>);
};

CategoriesMenu.propTypes = {
    categories: PropTypes.array,
    category: PropTypes.string,
    subCategory: PropTypes.string
};


const Header = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 15px 15px;
    border-bottom: 1px solid #eff2f7;
`;

const Title = styled.h3`
    font-size: 1.4em;
    color: #742727;
    font-weight: 300;
    margin: auto 15px auto 0px;
    line-height: 35px;
`;

const Menu = styled.div`
    padding: 0px 15px;
    height: calc(100% - 66px);
    overflow-y: auto;
`;

const Container = styled.div`
    background: #FFDDAB;
    border-radius: 3px;
    overflow: hidden;
`;

const Clear = styled(Link)`
    margin: auto 0;
    cursor: pointer;
    font-size: 12px;
    color: inherit;

    &:hover {
        color: #ff7261;

    }
`;


// const catList = [
//     {
//         label: "Global", value: "GLOBAL", subcategories: [
//             { name: "Pricing" },
//             { name: "Correlation" },
//             { name: "Volatility" }
//         ]
//     },
//     {
//         label: "APAC", value: "apac", subcategories: []
//     },
//     {
//         label: "EMEA", value: "emea", subcategories: []
//     },
//     {
//         label: "NAM", value: "nam", subcategories: []
//     }
// ];


export default CategoriesMenu;
