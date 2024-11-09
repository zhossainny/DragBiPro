import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Select from 'react-select';

import FormField from './FormField';

class FormSelect extends React.Component{
    constructor(props, context){
        super(props, context);

        this.state = {
            selectedOption : ""
        };

        this.onOptionChange = this.onOptionChange.bind(this);
    }

    onOptionChange(selectedOption){
        this.setState({ selectedOption });
    }

    render(){
        const { selectedOption } = this.state;
        let options = this.props.items.map(i=> {return  {value: i, label:i};});

        return(
            <FormField label={this.props.label}>
                <CategoryList
                    name="form-field-name"
                    value={selectedOption}
                    onChange={this.onOptionChange}
                    options={options}/>
            </FormField>
        );
    }
}

const CategoryList = styled(Select)`
    font-size:13px;
    font-family: Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif;
    color: #42526E;
`;

FormSelect.propTypes ={
    label : PropTypes.string.isRequired,
    items : PropTypes.array.isRequired
};

export default FormSelect;