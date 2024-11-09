import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Spacer = ({horizontalSpacing, verticalSpacing}) => {

    return(
        <SpacerDiv horizontalSpacing={horizontalSpacing} verticalSpacing={verticalSpacing} />
    );
};

Spacer.propTypes = {
    horizontalSpacing : PropTypes.number.isRequired,
    verticalSpacing : PropTypes.number.isRequired
};

const SpacerDiv = styled.div`
    margin-top: ${props => props.verticalSpacing + "px"};
    margin-right: ${props => props.horizontalSpacing + "px"};
`;

export default Spacer;
