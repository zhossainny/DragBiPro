import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import '../../../../../libs/charts/jquery.easypiechart.min';
import '../../../../css/easy-pie-chart.css';
import PercentagePieComponent from "./PercentagePieComponent";

class PercentagePieWidget extends React.Component {

    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
            <Container>
                <PercentagePieComponent datasource={this.props.dataSource} id={this.props.id} settings={this.props.settings}/>
            </Container>
        );
    }
}

PercentagePieWidget.propTypes = {
    dataSource: PropTypes.object,
    settings: PropTypes.object,
    id: PropTypes.string
};

const Container = styled.div`
    padding: 20px;
    height: 100%;
    width: 100%;
    background:#262626;
`;

export default PercentagePieWidget;
