import React from 'react';
import PropTypes from 'prop-types';
import styled from "styled-components";
import {Table} from "react-bootstrap";

class AdminGroupTable extends React.Component {

    constructor(props, context) {
        super(props, context);
    }

    render() {
        let groupRows = this.props.groups.map((group, index) => {
            return (
                <tr key={group.display}>
                    <GroupCell>{index + 1}</GroupCell>
                    <GroupCell>{group.display}</GroupCell>
                </tr>
            );
        });

        return (
            <Content>
                <Table className="table table-hover">
                    <thead>
                    <tr>
                        <TableHeader>#</TableHeader>
                        <TableHeader>Group name</TableHeader>
                    </tr>
                    </thead>
                    <tbody>
                    {groupRows}
                    </tbody>
                </Table>
            </Content>
        );
    }
}

AdminGroupTable.propTypes = {
    groups: PropTypes.array
};

export default AdminGroupTable;


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

const GroupCell = styled.td`
    font-size: 0.8em;
    color: #565656;
`;

const TableHeader = styled.th`
    font-weight: 600;
    font-size: 0.85em;
    color: #565656;
    padding-bottom: 5px;
`;