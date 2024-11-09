import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import * as appActions from '../../actions/appActions';
import * as appSelectors from '../../selectors/appSelector';

import Content from '../common/Content';
import AppsPageContent from './AppsPageContent';


import {buildCategoryList} from '../../functions/appFunctions';

class AppsPageContainer extends React.Component{
    constructor(props, context) {
        super(props, context);
        this.state = {
            searchText : "",
            showAppInfo : false,
            showNewAppModal : false,
            app : {}
        };

        this.showNewAppModal = this.showNewAppModal.bind(this);
        this.onModalClose = this.onModalClose.bind(this);
        this.onSearchTextEntered = this.onSearchTextEntered.bind(this);
    }

    onSearchTextEntered(value){
        this.setState({
            searchText: value
        });
    }

    showNewAppModal(){
        this.setState({
            showNewAppModal : true
        });
    }

    onModalClose(){
        this.setState({
            showNewAppModal:  false
        });
    }

    render(){
        return(
            <Content>
                <AppsPageContent/>
            </Content>
        );
    }
}


AppsPageContainer.propTypes = {
    apps: PropTypes.array.isRequired,
    categories : PropTypes.array.isRequired,
    selectedCategory : PropTypes.string,
    selectedSubcategory : PropTypes.string
};

function mapStateToProps(state, ownProps) {
    let apps = state.apps
    .filter(a=> a.appType==="WEBAPP" || a.appType==="EXCEL")
    .sort(function(a, b){
        if(a.name.toLowerCase() < b.name.toLowerCase()) return -1;
        if(a.name.toLowerCase() > b.name.toLowerCase()) return 1;
        return 0;
    });

    let categories =  buildCategoryList(apps);

    let firstCategory = categories.length > 0 ? categories[0].name : "";
    let selectedCategory = ownProps.match.params.category ? ownProps.match.params.category : firstCategory;
    
    return{
        apps : appSelectors.addCategoryToApp(apps),
        selectedCategory : selectedCategory,
        selectedSubcategory : ownProps.match.params.subcategory,
        categories : categories
    };
}
    
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(appActions, dispatch)
    };
}
    
export default connect(mapStateToProps, mapDispatchToProps)(AppsPageContainer);
