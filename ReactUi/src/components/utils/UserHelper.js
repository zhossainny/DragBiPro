/* eslint-disable react/prop-types */
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

const withUserHelper = ComponentToWrap => {
    return class UserHelper extends React.Component {
        isAdminOn = key => {
            return this.props.appsByRole && Array.isArray(this.props.appsByRole.Admin) && this.props.appsByRole.Admin.find(app => app.key === key);
        };

        hasFavourited = key => {
            return this.props.favourites.includes(key);
        }

        render() {
            return <ComponentToWrap {...this.props} isAdminOn={this.isAdminOn} hasFavourited={this.hasFavourited} />;
        }
    };
};

const mapStateToProps = state => {
    return {
        appsByRole: state.appsByRole,
        favourites: state.favourites
    };
};
const composedUserHelper = compose(connect(mapStateToProps, null), withUserHelper);

export default composedUserHelper;
