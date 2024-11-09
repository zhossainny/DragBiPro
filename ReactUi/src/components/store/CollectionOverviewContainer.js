import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import CollectionList from "./CollectionList";
import * as appActions from "../../actions/appActions";
import * as storeActions from "../../actions/storeActions";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {getCollectionMeta} from "../../functions/collectionUtils";

class CollectionOverviewContainer extends React.Component {

    componentDidMount() {
        this.props.actions.resetCollectionState();
    }

    createUserCollection() {
        if (!this.requestSubmitted) {
            this.props.actions.createUserCollection(getCollectionMeta(this.props.userId));
            this.requestSubmitted = true;
        }
    }

    render() {
        if (!this.props.userId) return null;
        let personal = [];
        let shared = [];
        let userCollection = this.props.collections.find(x => x.key.toLowerCase() === this.props.userId.toLowerCase() && !x.isRetired);
        if (userCollection) {
            personal = [userCollection];
            shared = this.props.collections.filter(x => x.key !== userCollection.key && !x.isRetired);
        } else {
            shared = this.props.collections;
            this.createUserCollection();
        }
        return (
            <Content>
                <Header>Available Collections</Header>
                <CollectionList caption={"Personal"} userId={this.props.userId} dashboards={personal}/>
                {shared.length > 0 && <CollectionList caption={"Public"} userId={this.props.userId} dashboards={shared}/>}
                {shared.length === 0 && <HeaderSmall>{'Please reach out to Dev to create Public collections.'}</HeaderSmall>}
            </Content>);
        }
}

CollectionOverviewContainer.propTypes = {
    userId: PropTypes.string,
    collections: PropTypes.array
};

const Content = styled.div`
    padding: 70px;
    padding-top: 30px;
    height: 100%;
    width: 80vw;
    margin-top: 50px;
    margin-left: auto;
    margin-right: auto;
    background-color:white;
    border: 1px solid #e1e1e1;
    border-radius: 4px;
    display:table;   
`;

const HeaderSmall = styled.h2`
    font-size: 1em;
    font-weight: 400;
    margin-bottom: 20px;
    padding-top: 20px;
    color: #d1551d;
    display: inline-block;
`;

const Header = styled.h2`
    font-size: 1.25em;
    font-weight: 400;
    margin-bottom: 20px;
    padding-top: 20px;
    color: #42526E;
    display: inline-block;
`;

function mapStateToProps(state) {
    return{
        collections : state.store.collections,
        userId: state.admin.userId
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({...appActions, ...storeActions}, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CollectionOverviewContainer);



