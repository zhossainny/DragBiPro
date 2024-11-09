import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {connect} from "react-redux";
import {Jumbotron} from "react-bootstrap";


class HomePageContainer extends React.Component{

    render(){
        let user = this.props.users.find((u)=> u.username &&
            u.username.toUpperCase()===this.props.currentUser.toUpperCase());
        return(<Container>
                <Jumbotron>
                    <Header>Welcome {user ? user.firstName : ""}</Header>
                </Jumbotron>
            </Container>);
    }
}

const Container = styled.div` 
    height: 100%;
    width: 100%;
    display: inline-block;
    margin-left: 60px;
    vertical-align: top;
`;

const Header = styled.h3`
    margin-left:50px;
    font-size:26px;
    font-weight: 500;
    font-family: Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif;
    color: #42526E;   
    margin-bottom: 20px; 
`;

HomePageContainer.propTypes = {
    users: PropTypes.array,
    currentUser: PropTypes.string
};


function mapStateToProps(state) {
    return{
        currentUser : state.admin.userId,
        users: state.users
    };
}

export default connect(mapStateToProps, (() => {return {};}))(HomePageContainer);
