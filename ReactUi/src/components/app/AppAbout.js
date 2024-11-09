import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import AppSummaryContainer from './AppSummaryContainer';
import AppEnvironment from './AppEnvironments';

class AppAbout extends React.Component{

    render(){
        let devTag = this.props.app.devLabel ? this.props.app.devLabel.VersionTag : "-.-.-.-";
        let devTimestamp = this.props.app.devLabel ? this.props.app.devLabel.Timestamp : "";
        let devUpdatedBy = this.props.app.devLabel ? fullName(this.props.app.devLabel.UpdatedBy, this.props.users) : "";

        let uatTag = this.props.app.uatLabel ? this.props.app.uatLabel.VersionTag : "-.-.-.-";
        let uatTimestamp = this.props.app.uatLabel ? this.props.app.uatLabel.Timestamp : "";
        let uatUpdatedBy = this.props.app.uatLabel ? fullName(this.props.app.uatLabel.UpdatedBy, this.props.users): "";

        let prodTag = this.props.app.prodLabel ? this.props.app.prodLabel.VersionTag : "-.-.-.-";
        let prodTimestamp = this.props.app.prodLabel ? this.props.app.prodLabel.Timestamp : "";
        let prodUpdatedBy = this.props.app.prodLabel ? fullName(this.props.app.prodLabel.UpdatedBy, this.props.users) : "";
 
        return(
            
            <Container>
                <AppSummaryContainer app={this.props.app} onSave={this.props.onSaveSummary}/>
                <AppEnvironment label="DEV" color="#77dd77" tag={devTag} timestamp={devTimestamp} updatedBy={devUpdatedBy}/>
                <AppEnvironment label="UAT" color="orange" tag={uatTag} timestamp={uatTimestamp} updatedBy={uatUpdatedBy}/>
                <AppEnvironment label="PROD" color="#ff6962" tag={prodTag} timestamp={prodTimestamp} updatedBy={prodUpdatedBy}/>
            </Container>
        );
    }
}

const Container = styled.div`
    display: table;
`;

function fullName(username, users){
    let user = users.find((u)=> u.id===username);

    return user.display;
}

AppAbout.propTypes ={
    app: PropTypes.object.isRequired,
    users : PropTypes.array.isRequired,
    onSaveSummary : PropTypes.func.isRequired
};

export default AppAbout;