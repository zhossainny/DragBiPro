import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import AppAbout from './AppAbout';
import AppVersions from './AppVersions';
import AppPermissions from './AppPermissions';
import AppReleases from './AppReleases';

class AppPage extends React.Component{

    constructor(props, context) {
        super(props, context);

        this.state = {
            selectedOption:"about"
        };

        this.onTabChange = this.onTabChange.bind(this);
    }

    onTabChange(e) {
        this.setState({
             selectedOption: e.target.value
        });

        this.props.onTabChange(e.target.value);
    }

    render(){
        return(
            <Container>
                <HeaderDiv>
                    <Spacer/>
                    <Tabs>
                        <TabInput id="tab1" value="about" type="radio" name="tabs" checked={this.state.selectedOption==="about"} onChange={this.onTabChange} />
                        <TabLabel htmlFor="tab1">About</TabLabel>
                        
                        <TabInput id="tab2" value="versions" type="radio" name="tabs" checked={this.state.selectedOption==="versions"} onChange={this.onTabChange}/>
                        <TabLabel htmlFor="tab2">Versions</TabLabel>
                        
                        <TabInput id="tab3" value="permissions" type="radio" name="tabs" checked={this.state.selectedOption==="permissions"} onChange={this.onTabChange}/>
                        <TabLabel htmlFor="tab3">Permissions</TabLabel>
                        
                        <TabInput id="tab4" value="releases" type="radio" name="tabs" checked={this.state.selectedOption==="releases"} onChange={this.onTabChange}/>
                        <TabLabel htmlFor="tab4">Releases</TabLabel>
                    </Tabs>
                </HeaderDiv>
                <ContentDiv>
                    {this.state.selectedOption=="about" ? <AppAbout app={this.props.app} users={this.props.allUsers} onSaveSummary={this.props.onSaveSummary}/> : null}
                    {this.state.selectedOption=="versions" ? <AppVersions versions={this.props.versions} app={this.props.app}/> : null}
                    {this.state.selectedOption=="permissions" ? <AppPermissions 
                                                                    allUsers={this.props.allUsers}
                                                                    allGroups={this.props.allGroups}
                                                                    userMembers={this.props.userMembers} 
                                                                    groupMembers={this.props.groupMembers} 
                                                                    appKey={this.props.app.key}/> 
                                                              : null}
                    {this.state.selectedOption=="releases" ? <AppReleases app={this.props.app}/> : null}
                    </ContentDiv>
            </Container>            
        );

    }
}

AppPage.propTypes ={
    app: PropTypes.object.isRequired,
    versions: PropTypes.array.isRequired,
    allUsers : PropTypes.array.isRequired,
    allGroups : PropTypes.array.isRequired,
    userMembers : PropTypes.array.isRequired,
    groupMembers : PropTypes.array.isRequired,
    onSaveSummary : PropTypes.func.isRequired,
    onTabChange : PropTypes.func
};

const Container = styled.div`
    height: 100%;
    width: 100%;
    margin-left: 60px;
`;

const HeaderDiv = styled.div`
    height:135px;
    width: 100%;
    display: table;
    background-color: white;
    border-bottom: 1px solid #e1e1e1;
`;

const ContentDiv = styled.div`
    height:80%;
`;

const Spacer = styled.div`
    height:100%;
    width: 20px;
    display: table-cell;
`;


const Tabs = styled.div`
    height:100%;
    width: 600px;
    margin-left: 100px;
    vertical-align: bottom;
    display: table-cell;
`;


const TabHeader = styled.span`
    padding-top: 15px;
    padding-bottom: 20px;
    width: 50px;
    margin: 15px;
    border-bottom: 4px solid orange;
    vertical-align: bottom;
    display: table-cell;
`;

const TabInput = styled.input`
    display: none;
    border-bottom: 1px solid #000;

    &:checked+label{
        color: #555;
        font-weight:600;
        border-bottom: 2px solid orange;
    }
`;

const TabLabel = styled.label`
    display: inline-block;
    margin: 0 0 -1px;
    padding: 12px 50px;
    font-family:Roboto,"Helvetica Neue", Helvetica, Arial, sans-serif;
    font-weight:400;
    font-style: normal;
    text-align: center;
    color: #8c8a8a;
    border: 1px solid transparent;

    &:hover{
        color: #888;
        cursor: pointer;
        font-weight:600;
    }
`;


export default AppPage;