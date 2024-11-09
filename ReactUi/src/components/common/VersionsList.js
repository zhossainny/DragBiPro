import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import * as config from '../../configuration/config';

class VersionsList extends React.Component{

    render(){
        let versionRows =this.props.versions.map((version) =>{
            return (<ListItem key={version.tag}>
                        <ListRow paddingTop={this.props.paddingTop} paddingBottom={this.props.paddingBottom}>
                            <RowItem>
                                <AppLink target="_blank" href={config.packageUriFromVersion(this.props.app.appKey, this.props.app.appType, version.tag)}>{version.tag}
                                </AppLink>
                            </RowItem>
                            <RowItem>{version.description}</RowItem>
                            <RowItem>{version.timestamp}</RowItem>
                            <RowItem>Euan Finlayson</RowItem>
                        </ListRow>
                    </ListItem>);});
        return(<List>
                {versionRows}
            </List>
        );
    }
}


VersionsList.propTypes ={
    app : PropTypes.object.isRequired,
    versions : PropTypes.array.isRequired,
    paddingTop: PropTypes.string.isRequired,
    paddingBottom : PropTypes.string.isRequired
};

const List = styled.ol`
    margin-top: 25px;
    padding-left: 0px;
`;

const ListItem = styled.li`
    list-style-type: none;
`;

const ListRow = styled.div`
    padding-top: ${props=> props.paddingTop};
    padding-bottom: ${props=> props.paddingBottom};
    border-top: 1px solid #e2e0e0;
    display: table;
    table-layout: fixed;
    width: 100%;
`;

const RowItem = styled.div`
    font-size:inherit;
    color: #565656;
    display: table-cell;
    width: 20%;
    padding-left: 10px;
    overflow: hidden;
    text-overflow:ellipsis; 
    white-space: nowrap;
`;

const AppLink = styled.a`
    color:#6d90ba;
    text-decoration: none;

    &:hover{
        text-decoration: underline;
    }
`;


export default VersionsList;