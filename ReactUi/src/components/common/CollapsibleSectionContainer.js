import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const CollapsibleSectionContainer = props => {
    const { children, expanded, headerText } = props;
    const [isExpanded, setExpanded] = useState(expanded);
    function toggleExpanded() {
        setExpanded(!isExpanded);
    }

    return (
        <SectionContainer {...props}>
            <Header onClick={toggleExpanded}>
                <h4>{headerText}</h4>
                <i className={isExpanded ? 'fa fa-angle-up' : 'fa fa-angle-down'} />
            </Header>
            {isExpanded ? children : ''}
        </SectionContainer>
    );
};

const SectionContainer = styled.div`
    margin-top: ${props => props.marginTop || 'initial'};
    margin-bottom: ${props => props.marginBottom || 'initial'};
    border-radius: 3px;
    padding: 10px;
    background: #262626;
    color:white;
`;

const Header = styled.div`
    display: flex;
    cursor: pointer;

    i {
        margin-left: auto;
        font-size: 26px;
        color: white;
    }

    h4 {
        font-size: 14px;
        color: white;
        margin: 6px 0
    }
`;

CollapsibleSectionContainer.propTypes = {
    children: PropTypes.node,
    headerText: PropTypes.string,
    expanded: PropTypes.bool
};

export default CollapsibleSectionContainer;

