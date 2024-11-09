import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as notificationActions from '../../actions/appActions';

import {buildCategoryList} from '../../functions/appFunctions';
import Modal from '../common/Modal';
import AppNewForm from './AppNewForm';

class AppNew extends React.Component{

    constructor(props, context){
        super(props, context);

        this.close = this.close.bind(this);
        this.save = this.save.bind(this);
        this.formChanged = this.formChanged.bind(this);

        this.state={
            appData: {}
        };
    }

    close(){
        this.props.onClose();
    }

    save(){    
        this.close();
        let app = this.state.appData;
        let subcategory = app.subcategory === "None" ? "" :  "\\" +  app.subcategory;


        let appMeta = {
            key: app.key,
            name : app.name,
            appType : app.appType,
            description : app.description,
            tags : {"category": app.category + subcategory}
        };

        this.props.actions.createApp(appMeta);
    }

    formChanged(data){
        this.setState({
            appData : data
        });
    }

    render(){
        return (
            <Modal show={this.props.show} onCancel={this.close} onOK={this.save}>
                <Container>
                    <Header>Create New App</Header>
                    <AppNewForm onFormChanged={this.formChanged} categories={this.props.appCategories}/>
                </Container>
            </Modal>);
    }
}

AppNew.propTypes ={
    actions : PropTypes.object.isRequired,
    show : PropTypes.bool,
    onClose : PropTypes.func,
    appCategories : PropTypes.array
};

const Container = styled.div`
    padding-left: 20px;
`;

const Header = styled.h3`
    font-size=1em;
    font-weight: 400;
    font-family: Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif;
    color: #42526E;   
    margin-bottom: 20px; 
`;

function mapStateToProps(state, props){
    let categories = buildCategoryList(state.apps);

    return{
        notification : state.notification,
        appCategories : categories
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(notificationActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AppNew);
