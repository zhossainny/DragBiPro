import React from 'react';
import PropTypes from 'prop-types';


class Notification extends React.Component{
    
    constructor(props, context){
        super(props,context);
    }

    componentDidUpdate() {
        setTimeout(() => {
            if(this.props.show){
                this.props.onClearNotification();      
            }
        }, 5000);
    }

    render(){
        let show = this.props.show ? "show" : "";
        if (this.props.type) {
            show = show + " " + this.props.type;
        }
        return (<div id="snackbar" className={show}>{this.props.children}</div>);
    }
}

Notification.propTypes ={
    type: PropTypes.string,
    children : PropTypes.node,
    show : PropTypes.bool.isRequired,
    onClearNotification : PropTypes.func.isRequired
};

export default Notification;