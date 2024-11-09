import React from 'react';
import styled from 'styled-components';

const NotImplementedComponent = () => {

    return (
        <Container>
            <Header>Not implemented</Header>
        </Container>
    );
};

const Container = styled.div`
    padding-top: 15px;
    padding-left: 50px;
    padding-right:50px;
    height: 700px;
    width: 500px;
`;

const Header = styled.h3`
    font-size:1em;
    font-weight: 500;
    font-family: Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif;
    color: #42526E;   
    margin-bottom: 20px; 
`;

export default NotImplementedComponent;

