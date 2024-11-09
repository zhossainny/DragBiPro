import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Creatable } from 'react-select';


class AppNewForm extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            key: "  ",
            formData: {
                name: "",
                key: "",
                appType: "NOTEBOOK",
                description: "",
                category: "",
                subcategory: ""
            }
        };

        this.onNameChange = this.onNameChange.bind(this);
        this.onAppTypeChange = this.onAppTypeChange.bind(this);
        this.onCategoryChange = this.onCategoryChange.bind(this);
        this.onDescriptionChanged = this.onDescriptionChanged.bind(this);
        this.onSubcategoryChange = this.onSubcategoryChange.bind(this);
    }

    onNameChange(event) {
        let formData = { ...this.state.formData };
        formData.key = event.target.value.split(" ").join("-").toLowerCase();
        formData.name = event.target.value;

        this.setState({
            key: formData.key,
            formData: formData
        });

        this.props.onFormChanged(formData);
    }    

    onDescriptionChanged(event) {
        let formData = { ...this.state.formData };
        formData.description = event.target.value;

        this.setState({
            formData: formData
        });

        this.props.onFormChanged(formData);
    }

    onCategoryChange(selectedOption) {
        let formData = { ...this.state.formData };
        formData.category = selectedOption ? selectedOption.value : null;

        this.setState({
            formData: formData
        });
    }

    onSubcategoryChange(selectedOption) {
        let formData = { ...this.state.formData };
        formData.subcategory = selectedOption ? selectedOption.value : null;

        this.setState({
            formData: formData
        });
    }

    onAppTypeChange(selectedOption) {
        let formData = { ...this.state.formData };
        formData.appType = selectedOption ? selectedOption.value : null;

        this.setState({
            formData: formData
        });      
    }

    buildCategories(props, category) {
        let categories = this.props.categories.map(category => {
            return {
                value: category.name,
                label: category.name
            };
        });

        if (category != "" && categories.findIndex(cat => cat.value === category) == -1) {
            categories = categories.concat({ value: category, label: category });
        }

        return categories;
    }

    buildSubcategories(props, category) {
        let subcategories = [{ value: "None", label: "None" }];

        let categoryIndex = this.props.categories.findIndex(cat => cat.name === category);

        if (categoryIndex > -1 && this.props.categories[categoryIndex].subCategories.length > 0) {
            let subOptions = this.props.categories[categoryIndex].subCategories.map(s => {
                return { value: s, label: s };
            });

            subcategories = subcategories.concat(subOptions);
        }

        let subcategory = this.state.formData.subcategory;

        if (subcategory != "None" && subcategory != "" && subcategories.findIndex(cat => cat.value === subcategory) == -1) {
            subcategories = subcategories.concat({ value: subcategory, label: subcategory });
        }

        return subcategories;
    }

    render() {
        let category = this.state.formData.category;

        let categories = this.buildCategories(this.props, category);

        let subcategories = this.buildSubcategories(this.props, category);

        return (
            <div>
                <FormField>
                    <Label><p>Name</p></Label>
                    <InputText
                        onChange={this.onNameChange}
                    />
                </FormField>
                <FormField>
                    <Label>Key</Label>
                    <InputText disabled value={this.state.key} onChange={this.onKeyChange} />
                </FormField>
                <FormField>
                    <Label>Category</Label>
                    <CategoryList
                        name="form-field-name"
                        value={this.state.formData.category}
                        onChange={this.onCategoryChange}
                        options={categories} />
                </FormField>
                <FormField>
                    <Label>Subcategory</Label>
                    <CategoryList
                        name="form-field-name"
                        value={this.state.formData.subcategory}
                        onChange={this.onSubcategoryChange}
                        options={subcategories} />
                </FormField>
                <FormField>
                    <Label>App Type</Label>
                    <CategoryList
                        value={this.state.formData.appType}
                        name="form-field-name"
                        onChange={this.onAppTypeChange}
                        options={AppTypeMappings} />
                </FormField>
                <FormField>
                    <Label>Description</Label>
                    <TextArea rows="5" cols="40" onChange={this.onDescriptionChanged} />
                </FormField>

            </div>
        );
    }
}

AppNewForm.propTypes = {
    onFormChanged: PropTypes.func.isRequired,
    categories: PropTypes.array.isRequired
};

const AppTypeMappings =
    [
        {
            label: 'Notebook',
            value: 'NOTEBOOK'
        },
        {
            label: 'Spreadsheet',
            value: 'EXCEL'
        },
        {
            label: 'Report',
            value: 'REPORT'
        },
        {
            label: 'Web App',
            value: 'WEBAPP'
        },
        {
            label: 'Exe',
            value: 'EXE'
        }
    ];

const FormField = styled.div`
    margin-bottom: 15px;
    width: 100%;
`;

const CategoryList = styled(Creatable) `
    font-size:13px;
    font-family: Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif;
    color: #42526E;
    width:300px;
`;

const List = styled.select`
    padding: 5px 10px;
    width: 300px;
    box-radius:3px;
    border: 1px solid #ccc;
    border-radius: 3px;
`;

const Key = styled.input`
    font-size:13px;
    font-family: Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif;
    color: #42526E;
    margin-bottom:5px;
    display:inline-block;
    border: 1px solid #ccc;
    width: 299px;
    height: 30px;
    border-radius: 3px;
`;

const InlineLabel = styled.span`
    font-size:13px;
    font-family: Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif;
    color: #42526E;
    margin-bottom:5px;
    margin-right: 30px;
`;

const Label = styled.div`
    font-size:13px;
    font-family: Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif;
    color: #42526E;
    margin-bottom:5px;

`;

const InputText = styled.input`
    padding: 8px 15px;
    margin: 0px 0;
    width: 300px;
    display: inline-block;
    border: 1px solid #ccc;
    border-radius: 3px;
    box-sizing: border-box;
    font-size:13px;
    font-family: Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif;
    color: #42526E;
`;

const TextArea = styled.textarea`
    padding: 8px 15px;
    margin: 0px 0;
    width: 300px;
    display: inline-block;
    border: 1px solid #ccc;
    border-radius: 3px;
    box-sizing: border-box;
    font-size:13px;
    font-family: Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif;
    color: #42526E;
    resize: none;
`;

export default AppNewForm;