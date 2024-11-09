import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import DeleteButton from './DeleteButton';

class TableRow extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.onRadioButtonChange = this.onRadioButtonChange.bind(this);
    }

    onRadioButtonChange(e) {
        this.props.onMemberPermissionChange({
            id:this.props.member.id,
            type: this.props.member.type,
            role : e.target.value
        });
    }

    render() {
        const { member } = this.props;
        return (
            <Row>
                <Cell align="left">
                    {member.name}
                </Cell>
                <Cell >
                    <input
                        type="radio"
                        value="Admin"
                        name={member.id}
                        checked={this.props.isCheckBoxChecked(member.id,"admin")}
                        onChange={this.onRadioButtonChange}/>
                </Cell>
                <Cell >
                    <input
                        type="radio"
                        value="ReadWrite"
                        name={member.id}
                        checked={this.props.isCheckBoxChecked(member.id,"readwrite")}
                        onChange={this.onRadioButtonChange}/>
                </Cell>
                <Cell>
                    <input
                        type="radio"
                        value="ReadOnly"
                        name={member.id}
                        checked={this.props.isCheckBoxChecked(member.id,"readonly")}
                        onChange={this.onRadioButtonChange}/>
                </Cell>
                <Cell>
                    <DeleteButton value={member} onClick={this.props.onDeleteRow}/>
                </Cell>
            </Row>
        );
    }

}

const Row =styled.tr`
    font-size:0.8em;
    color: #565656;  
`;

const Cell = styled.td`
    text-align: center;
    padding-top: 10px;
    padding-bottom: 10px;
    padding-left: 10px;
    border-top: 1px solid #e2e0e0;
    text-align : ${props => props.align ? props.align : 'center' };
`;

const Icon = styled.i`
    &:hover {
        color: red;
        cursor: pointer;
    }
`;

TableRow.propTypes = {
    member: PropTypes.object.isRequired,
    isCheckBoxChecked : PropTypes.func.isRequired,
    onDeleteRow : PropTypes.func.isRequired,
    onMemberPermissionChange : PropTypes.func.isRequired
};

export default TableRow;