import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import VersionList from '../common/VersionsList';

class AppVersions extends React.Component{

    render(){
        return( <Content>
                    <VersionListContent>
                        <Header>Versions</Header>
                        <VersionsContainer>
                            <VersionList 
                                app={this.props.app}
                                versions={this.props.versions}
                                paddingTop="15px"
                                paddingBottom="15px"/>
                        </VersionsContainer>
                    </VersionListContent>
        </Content>);
    }
}

AppVersions.propTypes = {
    versions : PropTypes.array.isRequired,
    app : PropTypes.object.isRequired
};

const VersionListContent = styled.div`
    height:100%;
    display:table-cell;
    vertical-align:top;
`;

const Content = styled.div`
    padding: 30px;
    padding-top: 10px;
    height: 100%;
    width: 50%;
    margin-top: 50px;
    margin-left: auto;
    margin-right: auto;
    background-color:white;
    border: 1px solid #e1e1e1;
    border-radius: 4px;
    display:table;
`;

const Header = styled.h2`
    font-size: 1.25em;
    font-weight:400;
    color: #42526E;
    display: inline-block;
    margin-bottom: 30px;
`;

const VersionsContainer = styled.div`
    height: 300px;
`;


export default AppVersions;