/* eslint-disable react/jsx-boolean-value */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import AppTableRow from './AppTableRow';
import Select from 'react-select';

import DropDownButton from './DropDownButton';

class AppPermissionsTable extends React.Component{
    constructor(props, context) {
        super(props, context);

        this.state = {
            dropDownValue : "ReadOnly",
            selectedOption : null
        };

        this.deleteRow = this.deleteRow.bind(this);
        this.handleSelectedChange = this.handleSelectedChange.bind(this);
        this.dropDownChange = this.dropDownChange.bind(this);
        this.onAddApp = this.onAddApp.bind(this);
    }

    dropDownChange(value){
        this.setState({
            dropDownValue : value
        });
    }

    onAddApp(){
        this.props.addApp(
            {
                role: this.state.dropDownValue,
                app:  this.state.selectedOption.value,
                type: 'add'
            });
        this.setState({
            selectedOption : null
        });
    }

    deleteRow(value){
        this.props.deleteApp(
            {
                role: '',
                app:  value,
                type: 'delete'
            });
    }

    handleSelectedChange (newOption){
        this.setState({ selectedOption: newOption });
    }

    isRowEnabled(app) {
        let userApps = this.props.currentUserApps;
        for(let i = 0; i < userApps.length; i++) {
            if (userApps[i].key === app.key) {
               return true;
            }
        }
        return false;
    }

    createRows(){
        return this.props.selectedUserApps.map(app=>{
            const rowEnabled = this.isRowEnabled(app);
            return (
                <AppTableRow
                    app={app}
                    key={app.key}
                    enabled={rowEnabled}
                    isCheckBoxChecked={this.props.isCheckboxChecked}
                    onDeleteRow={this.deleteRow}
                    onMemberPermissionChange={this.props.onMemberPermissionChange}
                />
            );
        });
    }

    render(){
        let rows = this.createRows();
        let availableApps = this.props.lookupValues.map(app =>{
            return {
                value: app,
                label: app.name
            };
        });

        return (<Content>
                    <Header>{this.props.title}</Header>
                    <div>
                        {this.props.children}
                    </div>
                    <Table id="adminTable" className="table table-hover">
                        <tbody>
                            <TypeAheadTr>
                                <TypeAheadTd colSpan="4">
                                <TypeAhead
                                    placeholder={this.props.placeholder}
                                    name="form-field-name"
                                    value={this.state.selectedOption}
                                    onChange={this.handleSelectedChange}
                                    options={availableApps}
                                    openOnClick={true}
                                />
                                </TypeAheadTd>
                                <DropDownTd>
                                    <DropDownButton onChange={this.dropDownChange}/>
                                    <Button disabled={!this.state.selectedOption} onClick={this.onAddApp}>Add</Button>
                                </DropDownTd>
                            </TypeAheadTr>
                            <tr>
                                <TableHeader align="left">Name</TableHeader>
                                <TableHeader>Admin</TableHeader>
                                <TableHeader>Read/Write</TableHeader>
                                <TableHeader>Read Only</TableHeader>
                                <TableHeader>Delete App</TableHeader>
                            </tr>
                            {rows}                  
                        </tbody>
                    </Table>
                </Content>
        );
    }
}

const TypeAhead = styled(Select)`
    width: 100%;
    margin-bottom: 5px;
    margin-top: 5px;
    margin-left: 5px;
`;

const TypeAheadTr = styled.tr`
    background-color: #f1f1f1;
    border-top: 1px solid #e1e1e1;
`;

const TypeAheadTd = styled.td`
    padding-left: 10px;
`;

const DropDownTd = styled.td`
    width: 200px;
    padding: 11px 4px 4px 4px !important;
`;

const Content = styled.div`
    padding: 30px;
    padding-top: 10px;
    margin-top: 20px;
    background-color:white;
    border: 1px solid #e1e1e1;
    border-radius: 4px;
    display:table;
    width:100%;
`;

const Header = styled.h2`
    font-size: 1.25em;
    font-weight:400;
    color: #42526E;
    display: inline-block;
`;

const Table = styled.table`
    width: 100%;    
    border-collapse: collapse;
`;


const TableHeader = styled.th`
    font-weight: 600;
    font-size: 0.85em;
    color: #565656;
    padding-bottom: 5px;
    text-align: ${props=> props.align ? props.align : 'center' };
`;

const Button = styled.button`
    display: inline-block;
    border: 1px solid #c9c9c9;
    border-radius: 4px;
    padding: 10px 10px 10px 10px;
    background-color: #ffffff;
    cursor: pointer;
    white-space: nowrap;
    width: 60px;
    font-weight: 400;
    font-size: 0.85em;
    margin-left: 10px;
`;

export default AppPermissionsTable;

AppPermissionsTable.propTypes = {
    title: PropTypes.string,
    placeholder: PropTypes.string,
    children : PropTypes.node,
    lookupValues: PropTypes.array,
    currentUserApps: PropTypes.array,
    selectedUserApps: PropTypes.array,
    isCheckboxChecked: PropTypes.func,
    onMemberPermissionChange: PropTypes.func,
    addApp: PropTypes.func,
    deleteApp: PropTypes.func
};