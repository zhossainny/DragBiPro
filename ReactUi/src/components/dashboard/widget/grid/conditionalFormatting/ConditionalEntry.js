import React from 'react';
import PropTypes from 'prop-types';
import styled from "styled-components";
import Spacer from "../../../../common/Spacer";
import MultiSelect from './../../../../common/MultiSelect';

const conditions = ['Equals', 'Not Equal', 'Less than', 'Less than or equals', 'Greater than', 'Greater than or equal'];

class ConditionalEntry extends React.Component {

    constructor(props, context) {
        super(props, context);
    }

    conditionValueChanged(e, id) {
        let entry = this.props.conditionalFormat.entries.find(x => x.id === id);
        if (entry) {
            entry.value = e.target.value;
            entry.field = null;
            let formatCopy = Object.assign({}, this.props.conditionalFormat);
            this.props.onConditionalFormatChanged(formatCopy);
        }
    }

    conditionConditionChanged(e, id) {
        let entry = this.props.conditionalFormat.entries.find(x => x.id === id);
        if (entry) {
            entry.condition = e ? e.value : null;
            let formatCopy = Object.assign({}, this.props.conditionalFormat);
            this.props.onConditionalFormatChanged(formatCopy);
        }
    }

    conditionFieldChanged(e, id) {
        let entry = this.props.conditionalFormat.entries.find(x => x.id === id);
        if (entry) {
            entry.field = e ? e.value : null;
            entry.value = null;
            let formatCopy = Object.assign({}, this.props.conditionalFormat);
            this.props.onConditionalFormatChanged(formatCopy);
        }
    }

    deleteCondition(e, id) {
        let formatCopy = Object.assign({}, this.props.conditionalFormat);
        formatCopy.entries = formatCopy.entries.filter(cond => cond.id !== id);
        this.props.onConditionalFormatChanged(formatCopy);
    }

    render() {
        let columnOptions = this.props.columnNames.map(x => { return { label: x, value: x }; });
        let conditionOptions = conditions.map(x => { return { label: x, value: x }; });
        let entry = this.props.entry;
        let i = this.props.counter;
        return (
            <div key={entry.id}>
                <PropName>Condition</PropName>
                <MultiSelect
                    width={'60%'}
                    name={'condition'}
                    value={{ label: entry.condition, value: entry.condition }}
                    onChange={e => this.conditionConditionChanged(e, entry.id)}
                    options={conditionOptions} />
                <Spacer horizontalSpacing={0} verticalSpacing={5} />
                {!entry.field && <span>
                    <PropName>Value</PropName>
                    <InputText name="value"
                        placeholder={'enter a value or select a field'}
                        value={entry.value}
                        onChange={(e) => this.conditionValueChanged(e, entry.id)} />
                </span>}
                <Spacer horizontalSpacing={0} verticalSpacing={5} />
                <PropName>Field</PropName>
                <MultiSelect
                    width={'60%'}
                    name={'field'}
                    value={{ label: entry.field, value: entry.field }}
                    onChange={e => this.conditionFieldChanged(e, entry.id)}
                    options={columnOptions} />
                <DeleteButtonContainer>
                    <button className="header-button"
                        onClick={(e) => this.deleteCondition(e, entry.id)}
                        style={{
                            float: 'inherit',
                            height: '20px',
                            fontSize: '12px',
                            marginTop: '2px'
                        }}>
                        <i className="fa fa-trash-o" aria-hidden="true" />
                    </button>
                </DeleteButtonContainer>
                {i + 1 !== this.props.conditionalFormat.entries.length && <Spacer horizontalSpacing={0} verticalSpacing={20} />}
            </div>
        );
    }
}

ConditionalEntry.propTypes = {
    columnNames: PropTypes.array,
    entry: PropTypes.object,
    conditionalFormat: PropTypes.object,
    counter: PropTypes.number,
    onConditionalFormatChanged: PropTypes.func
};

const PropName = styled.label`
    margin-top: 5px;
    min-width: 70px;
    font-size:12px;
    font-weight: 400;
    font-family: Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif;
    color: white;   
`;

const DeleteButtonContainer = styled.div`
    display: inline-block;
    height: 26px;
    margin-left: 10px;
    vertical-align: top;
    margin-top: 2px;
    background-color:#262626;
`;

const InputText = styled.input`
    padding: 3px;
    width: 60%;
    display: inline-block;
    border: 1px solid #ccc;
    border-radius: 3px;
    box-sizing: border-box;
    font-size:13px;   
    font-family: Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif;
    color: white;
`;

export default ConditionalEntry;

