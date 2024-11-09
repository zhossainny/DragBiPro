import React from 'react';
import PropTypes from 'prop-types';

class NewTabAnchor extends React.Component{

    render(){
        return <a target="_blank"  rel="noopener noreferrer" href={this.props.uri}>{this.props.children}</a>;
    }
}

NewTabAnchor.propTypes = {
    uri : PropTypes.string.isRequired,
    children : PropTypes.node
};

export default NewTabAnchor;