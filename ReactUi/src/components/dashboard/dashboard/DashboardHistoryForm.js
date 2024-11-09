/* eslint-disable react/no-did-update-set-state */
import React from 'react';
import PropTypes from 'prop-types';
import styled from "styled-components";
import '../../../css/dashboard.css';
import Modal from "../../common/Modal";
import FormField from "../../common/FormField";
import {Link} from "react-router-dom";
import Spacer from "../../common/Spacer";
import {getDashboardUserFriendlyVersion} from "../../../functions/utils";
import FormCaption from './../../common/FormCaption';

class DashboardHistoryForm extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.onOk = this.onOk.bind(this);
        this.onCancel = this.onCancel.bind(this);
    }

    onOk() {
        this.props.onOk(this.state.dashboardName);
    }

    onCancel() {
        this.props.onCancel(this.props.name);
    }

    render() {
        const rows = this.props.versions.map((version, i) =>{
            let url = "/history/dashboard/" + version.appKey;
            return (<ListItem key={i}>
                <ListRow>
                    <AppNameDiv>
                        <AppLink target="_blank" to={url + '/' + version.tag}>{'Version ' + getDashboardUserFriendlyVersion(version, this.props.versions)}</AppLink>
                        <Description>{version.description}</Description>
                    </AppNameDiv>
                </ListRow>
            </ListItem>);
        });

        return (
            <Modal show={this.props.show}
                   width={'510px'}
                   onOK={this.onOk}
                   onCancel={this.onCancel}>
                <FormCaption>Versions</FormCaption>
                <Spacer verticalSpacing={20} horizontalSpacing={0}/>
                <RowContainer style={{paddingLeft: '20px'}}>
                    {rows}
                </RowContainer>
            </Modal>
        );
    }
}

DashboardHistoryForm.propTypes = {
    show: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    versions: PropTypes.array.isRequired,
    onCancel: PropTypes.func.isRequired,
    onOk: PropTypes.func.isRequired
};

const Description = styled.div`
    color: #b1b5bb;
    text-decoration: none;
    float: right;
    font-size: 12px;
    padding-top: 3px;
`;

const RowContainer = styled.div`
    paddingLeft: '20px';
    max-height: 500px;
    overflow-y: auto;
    overflow-x: hidden;
`;


const ListItem = styled.li`
    list-style-type: none;
`;

const AppNameDiv = styled.div`
    margin-left: 10px;
    padding-right: 5%;
    display: inline-block;
    color: #42526E;
    width: 100%;
    &:hover{
        text-decoration: underline;
    }
`;

const ListRow = styled.div`
    padding-top: 10px;
    padding-bottom: 10px;
    border-top: 1px solid #e2e0e0;
`;

const AppLink = styled(Link)`
    color: #42526E;
    text-decoration: none;
`;

export default DashboardHistoryForm;

