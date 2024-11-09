import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import TableRow from './TableRow';
import Select from 'react-select';

import DropDownButton from './DropDownButton';

class PermissionsTable extends React.Component{
    constructor(props, context) {
        super(props, context);

        this.state ={
            selectedOption :[],
            dropDownValue : "ReadOnly",
            options : []
        };

        this.handleSelectedChange = this.handleSelectedChange.bind(this);
        this.isCheckBoxChecked = this.isCheckBoxChecked.bind(this);
        this.onAddMembers = this.onAddMembers.bind(this);
        this.deleteMemberRow = this.deleteMemberRow.bind(this);
        this.dropDownChange = this.dropDownChange.bind(this);
    }

    static getDerivedStateFromProps(props) {
        let options = props.allPrincipals.map(principal =>{
            return {
                value: principal.id,
                label: principal.name
            };
        }).sort((a,b) => a.label.localeCompare(b.label));

        return { options: options}
    }

    dropDownChange(value){
        this.setState({
            dropDownValue : value
        });
    }

    onAddMembers(){
        let members = this.state.selectedOption.map(opt=>{
            return{
                id: opt.value,
                role : this.state.dropDownValue.replace(" ", ""),
                type: this.props.principalType
            };
        });
        this.props.addMembers(members);
        this.setState({
            selectedOption :[]
        });
    }

    deleteMemberRow(value){
        this.props.deleteMember(value);
    }

    handleSelectedChange (selectedOptions){        
        this.setState({ selectedOption: [...selectedOptions] });
    }

    isCheckBoxChecked(id, role){
        return this.props.members.some(member=> 
            member.id.toLowerCase()===id.toLowerCase() && 
            member.role.toLowerCase()===role.toLowerCase());
    }

    createRows(){
        return this.props.members.map(member=>{
            return (
                <TableRow
                    member={member}
                    key={member.id}
                    isCheckBoxChecked={this.isCheckBoxChecked}
                    onDeleteRow={this.deleteMemberRow}
                    onMemberPermissionChange={this.props.onMemberPermissionChange}
                />
            );
        });
    }

    render(){
        let rows = this.createRows();

        return (<Content>
                    <Header>{this.props.title}</Header>
                    <Table id="adminTable" className="table table-hover">
                        <tbody>
                            <tr>
                                <TableHeader align="left">Name</TableHeader>
                                <TableHeader>Admin</TableHeader>
                                <TableHeader>Read/Write</TableHeader>
                                <TableHeader>Read Only</TableHeader>
                            </tr>
                            <TypeAheadTr>
                                <TypeAheadTd colSpan="4">
                                <TypeAhead
                                    name="form-field-name"
                                    value={this.state.selectedOption}
                                    isMulti
                                    onChange={this.handleSelectedChange}
                                    options={this.state.options}
                                    openOnClick={false}/>
                                </TypeAheadTd>
                                <DropDownTd>
                                    <DropDownButton value={this.state.dropDownValue} onChange={this.dropDownChange}/>
                                    <Button disabled={!this.state.selectedOption.length} onClick={this.onAddMembers}>Add</Button>
                                </DropDownTd>
                            </TypeAheadTr>
                            {rows}                  
                        </tbody>
                    </Table>
                </Content>
            
        );
    }
}

PermissionsTable.propTypes = {
    title : PropTypes.string.isRequired,
    members : PropTypes.array.isRequired,
    principalType : PropTypes.string.isRequired,
    allPrincipals : PropTypes.array.isRequired,
    addMembers : PropTypes.func.isRequired,
    deleteMember : PropTypes.func.isRequired,
    onMemberPermissionChange : PropTypes.func.isRequired
};

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

const  DropDown = styled.p`
    width: 50px;
    margin: 0px;
    padding: 4px;
`;

const Content = styled.div`
    padding: 15px;
    width: 100%;
    margin-top: 20px;
    background-color:white;
    border: 1px solid #e1e1e1;
    border-radius: 3px;
    overflow: auto;
    flex: 1 1 50%;
`;

const Header = styled.h2`
    font-size: 1.25em;
    font-weight:400;
    color: #42526E;
    margin-bottom: 15px;
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

export default PermissionsTable;