import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';


class AppsPageContent extends React.Component{

    render(){
        return(<Container>{this.props.children}</Container>);
    }
}

AppsPageContent.propTypes = {
    children : PropTypes.node
};

const Container = styled.div`
    width: 100%;
    height: 100%;
    display: table;
`;


export default AppsPageContent;