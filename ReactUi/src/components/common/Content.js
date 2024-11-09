import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';


class Content extends React.Component{

    render(){
        return(<Container>{this.props.children}</Container>);
    }
}

Content.propTypes = {
    children : PropTypes.node
};

const Container = styled.div`
    height: 100%;
    width: 100%;
    display: table-cell;
    vertical-align: top;
`;


export default Content;