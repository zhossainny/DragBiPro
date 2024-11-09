import React from 'react';
import PropTypes from 'prop-types';
import styled from "styled-components";

const DashboardVersionInfo = ({updatedBy, version, timestamp, shared}) => {
    let action = version === "0" ? "User: " : "User: ";
    return (
        <DashboardSubCaption>
            {action +  updatedBy}<br/>
            {timestamp}
            {/*{"v" + version + ".0" + (shared ? " (shared)" : "")}*/}
            </DashboardSubCaption>
    );
};

DashboardVersionInfo.propTypes = {
    updatedBy: PropTypes.string,
    timestamp: PropTypes.string,
    version: PropTypes.string,
    shared: PropTypes.bool
};

const DashboardSubCaption = styled.label`   
    margin: 20px 20px 0 0;
    float: right;
    font-size: 0.8em;
    font-weight: 400;
    color: darkgray;
    display: inline-block;
    text-align: right;
`;

export default DashboardVersionInfo;