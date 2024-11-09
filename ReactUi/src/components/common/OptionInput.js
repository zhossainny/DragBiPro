import styled, { css } from 'styled-components';
import React from 'react';
import { PropTypes } from 'prop-types';


const OptionInput = props => {
    return <Container {...props}>{props.children}</Container>;
};

OptionInput.propTypes = {
    children: PropTypes.node
};

const Container = styled.div`
    display: flex;
    margin-bottom: ${props => props.marginBottom || '10px'};
    margin-top: ${props => props.marginTop || '0px'};
    ${props => props.disabled && css`
        pointer-events: none;
    `};
`;

export default OptionInput;