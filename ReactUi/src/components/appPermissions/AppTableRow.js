import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import DeleteButton from './DeleteButton';

class AppTableRow extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.onRadioButtonChange = this.onRadioButtonChange.bind(this);
    }

    onRadioButtonChange(e) {
        this.props.onMemberPermissionChange({
            role: e.target.value,
            app:  this.props.app,
            type: 'change'
        });
    }

    render() {
        const {app, enabled} = this.props;
        return (
            <Row>
                <Cell align="left">
                    {app.name}
                </Cell>
                <Cell>
                    {enabled && <input
                        type="radio"
                        value="Admin"
                        name={app.key}
                        checked={this.props.isCheckBoxChecked(app.key, "admin")}
                        onChange={this.onRadioButtonChange}/>}
                </Cell>
                <Cell>
                    {enabled && <input
                        type="radio"
                        value="ReadWrite"
                        name={app.key}
                        checked={this.props.isCheckBoxChecked(app.key, "readwrite")}
                        onChange={this.onRadioButtonChange}/>}
                </Cell>
                <Cell>
                    {enabled && <input
                        type="radio"
                        value="ReadOnly"
                        name={app.key}
                        checked={this.props.isCheckBoxChecked(app.key, "readonly")}
                        onChange={this.onRadioButtonChange}/>}
                </Cell>
                <Cell>
                    {enabled && <DeleteButton value={app} onClick={this.props.onDeleteRow}/>}
                </Cell>
            </Row>
        );
    }

}

const Row = styled.tr`
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

AppTableRow.propTypes = {
    enabled: PropTypes.bool,
    app: PropTypes.object.isRequired,
    isCheckBoxChecked: PropTypes.func.isRequired,
    onDeleteRow: PropTypes.func.isRequired,
    onMemberPermissionChange: PropTypes.func.isRequired
};

export default AppTableRow;