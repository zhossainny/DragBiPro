import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import SearchBox from "./SearchBox";
import { Link } from 'react-router-dom';
import logo from '../../../../src/images/logo.png'

const Header = ({onSearchTextChanged, onSortChanged, defaultSort}) => {
    const [ sort, setSort ] = useState(defaultSort);
    function sortChanged(e) {
        setSort(e.target.value);
        onSortChanged(e.target.value);
    }
    return (<Container>


        <Filter>
            <Image src={logo} width="84" height="30" alt="dragBi logo"/>
            <Title>Sort By</Title>
            <Select onChange={sortChanged} value={sort}>
                <Option value="az">Name A-Z</Option>
                <Option value="za">Name Z-A</Option>
            </Select>
        </Filter>
        <SearchBox onTextChanged={onSearchTextChanged} />
        <Title2> A Drag-n-Drop BI tool (Beta version)</Title2>
        <Button to="/newApp"><span>Try New App!</span></Button>
        <Button><span>Login</span></Button>
        <Button><span>Refresh</span></Button>
    </Container>);
};

Header.propTypes = {
    onSearchTextChanged: PropTypes.func,
    defaultSort: PropTypes.string,
    onSortChanged: PropTypes.func
};

const Container = styled.div`
   display: flex;
   padding: 20px;
   margin-bottom: 30px;   
   background: black;
   color:white;
   border-radius: 3px;
`;

const Filter = styled.div`
    display: inline-flex;
    flex: 1;
    min-width: 120px;
    max-width: 300px;
`;
const Image = styled.img`
    
    margin: auto;
    text-align: center;
`;
const Title = styled.p`
    flex: 0 1 80px;
    font-size: 0.95em;
    color: #797979;
    font-weight: 500;
    margin: auto;
    text-align: center;
`;
const Title2 = styled.p`
    font-size: 0.95em;
    color: #797979;
    font-weight: 500;
    margin: auto;
    text-align: center;
`;

const Select = styled.select`
    flex: 1 1 65%;
    width: 100%;
    padding: 12px 15px;
    margin: 0;
    border-radius: 3px;
    border:1px solid #e5e5e5;
    font-size: 0.95em;
    background-color:black;
    &:focus {
        outline: none;
        border:1px solid #d1d1d1;
    }
`;

const Option = styled.option`
    outline:none;
     &:focus {
        outline: none;
    }
`;

const Button = styled(Link)`
      display: inline-flex;
      margin: 0 10px;
      padding: 0 10px;
      text-decoration: none;
      background-color: #800080;
      color: white;
      font-size: 16px;
      border-radius: 3px;

      &:hover {
        color: white;
        background-color: #892f38;
      }

      span {
        margin: auto 0;
      }
`;

export default Header;