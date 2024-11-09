/* eslint-disable react/jsx-no-bind */
import {connect} from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import styled from "styled-components";
import {bindActionCreators} from "redux";
import * as widgetActions from "../../../actions/dashboardWidgetActions";
import * as dashboardActions from "../../../actions/dashboardActions";
import '../../../css/dashboard.css';

class DashboardConfigurationItem extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            collapsed: false,
            item: null
        };

        this.checkboxChecked = this.checkboxChecked.bind(this);
        this.editButtonHandler = this.editButtonHandler.bind(this);
        this.configValueChanged = this.configValueChanged.bind(this);
        this.collapseExpandPanel = this.collapseExpandPanel.bind(this);
    }

    componentDidMount() {
        if (this.props.item && !this.state.item) {
            this.setState({
                item: this.props.item,
                collapsed: this.props.item.collapsed
            });
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if ((this.props.item && !this.state.item) || this.state.item.version !== this.props.item.version) {
            this.setState({item: this.props.item});
        }
    }

    editButtonHandler(e) {
        e.stopPropagation();
        this.props.onEditItem(this.state.item);
    }

    configValueChanged(e) {
        let value = e.target.value;
        let copy = Object.assign({}, this.state.item);
        copy.version = copy.version + 1;
        copy.value = value;
        this.setState({item: copy});
        this.props.onItemChanged(copy);
    }

    checkboxChecked(e) {
        let name = e.target.name;
        let value = e.target.checked;
        let copy = Object.assign({}, this.state.item);
        copy.version = copy.version + 1;
        if (copy.options) {
            let option = copy.options.find(opt => opt.value === name);
            if (option) {
                option.selected = value;
            }
        }
        let selectedItems = copy.options.filter(x => x.selected);
        copy.value = selectedItems.length === 0 ? null : selectedItems.map(x => x.value).join(',');
        this.setState({item: copy});
        this.props.onItemChanged(copy);
    }

    collapseExpandPanel(e) {
        let collapsed = !this.state.collapsed;
        let itemCopy = Object.assign({}, this.state.item);
        itemCopy.collapsed = collapsed;
        this.setState({
            collapsed: collapsed,
            item: itemCopy
        });
        this.props.onItemChanged(itemCopy, false);
    }

    getSingleValueEditor() {
        return <TextInput value={this.state.item.value}
                          onChange={this.configValueChanged}/>;
    }

    getDropDownEditor() {
        if (!this.state.item.options) return null;
        let options = this.state.item.options.map((option, i) => {
            return <option key={i} value={option}>{option}</option>;
        });
        return (<DropDown value={this.state.item.value}
                          onChange={this.configValueChanged}>
            {options}
        </DropDown>);
    }

    getCheckboxEditor() {
        if (!this.state.item.options) return null;
        let options = this.state.item.options.map((option, i) => {
            return (<CheckboxListItem key={i}>
                <input type="checkbox"
                       name={option.value}
                       checked={option.selected}
                       onChange={this.checkboxChecked}
                       value={option.selected}/>
                <CheckboxLabel>{option.value}</CheckboxLabel>
            </CheckboxListItem>);
        });
        return (<CheckboxList id="checkboxes">
            <ul>
                {options}
            </ul>
        </CheckboxList>);
    }

    render() {
        if (!this.state.item) return null;
        return (
           <Wrapper>
             <Header onClick={this.collapseExpandPanel}>
                 <HeaderLabel>{this.state.item.name}
                    <CollapseIcon className={this.state.collapsed ? "fa fa-angle-down" : "fa fa-angle-up"}/>
                 </HeaderLabel>
                 <ControlPanel>
                     <button className="dash-config-small-button" onClick={this.editButtonHandler}>
                         <i className="fa fa-pencil"/>
                     </button>
                 </ControlPanel>
             </Header>
               {!this.state.collapsed &&
               <Body>
                   {this.state.item.type === 'text' &&
                        this.getSingleValueEditor()
                   }
                   {this.state.item.type === 'dropDown' &&
                       this.getDropDownEditor()
                   }
                   {this.state.item.type === 'checkList' &&
                       this.getCheckboxEditor()
                   }
               </Body>}
           </Wrapper>
        );
    }
}

DashboardConfigurationItem.propTypes = {
    item: PropTypes.object,
    onEditItem: PropTypes.func,
    onItemChanged: PropTypes.func
};

const Wrapper = styled.div`
    display: inline-block; 
    margin: 5px 10px 5px 10px;
    width: 200px;  
    border-color: #ccc;
    border: 1px solid #ccc;
    font-size:12px;
    vertical-align: top;
    font-family: Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif;
`;

const Header = styled.div`
    color: white;
    display: block; 
    height: 24px;
    width: 100%;
    padding: 3px;
    background-color: black;
    &:hover {
        cursor: pointer;
    }
`;

const CollapseIcon = styled.i`
    margin-left: 5px;
    color: white;
`;

const HeaderLabel = styled.div`
    display: inline-block; 
    margin-left: 3px;
    margin-top: 1px;
`;

const CheckboxList = styled.div`
    max-height: 400px;
    overflow: auto;
`;

const CheckboxLabel = styled.div`
    margin-left: 7px;
    word-break: break-word;
`;

const CheckboxListItem = styled.li`
    display: inline-flex;
    margin-left: 10px;
    line-height: 20px;

    input {
        margin: auto 0;
    }
`;

const ControlPanel = styled.div`
    display: inline-block; 
    float: right;
    background-color: #262626;
    color:white;
`;

const Body = styled.div`
    display: block; 
    height: 100%;
    width: 100%;
    padding: 10px;
    background-color: #262626;
    color:white;
`;

const TextInput = styled.input`
    padding: 3px;
    width: 100%;
    min-width: 100px;
    display: inline-block;
    border: 1px solid #ccc;
    border-radius: 3px;
    box-sizing: border-box;
    font-size:13px;   
    font-family: Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif;
    color: white;
    background:#262626;
`;

const DropDown = styled.select`
    padding: 3px;
    width: 100%;
    min-width: 100px;
    display: inline-block;
    border: 1px solid #ccc;
    border-radius: 3px;
    box-sizing: border-box;
    font-size:13px;
    font-family: Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif;
    color: white;
    background-color:#262626;
`;

function mapStateToProps(state) {
    return {
        showHeaders: state.dashboard.showHeaders,
        dashboardSettingsVisible: state.dashboard.showSettings,
        refreshInterval: state.dashboard.refreshInterval
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({...widgetActions, ...dashboardActions}, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardConfigurationItem);

