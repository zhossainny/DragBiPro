import React from 'react';

import AdminGroupEditorContainer from "./AdminGroupEditorContainer";
import AdminPermissionEditorContainer from "./AdminPermissionEditorContainer";
import styled from 'styled-components';
import Spacer from "../common/Spacer";

const AdminPermissionsTab = () => {
    return (
        <Content>
            <Header>User Groups</Header>
            <AdminGroupEditorContainer/>
            <Spacer horizontalSpacing={0} verticalSpacing={50}/>
            <Header>Bulk Permission Change</Header>
            <AdminPermissionEditorContainer/>
        </Content>
    );
};

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
    min-width:780px;
`;

const Header = styled.h3`
    font-size:1.2em;
    font-weight: 500;
    font-family: Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif;
    color: #42526E;   
    margin-bottom: 20px; 
`;

export default AdminPermissionsTab;