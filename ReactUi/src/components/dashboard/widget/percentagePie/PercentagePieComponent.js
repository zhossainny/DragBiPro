import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import '../../../../../libs/charts/jquery.easypiechart.min';
import '../../../../css/easy-pie-chart.css';
import Apexradial from './apexradial'

class PercentagePieComponent extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            version: null
        };

        this._green = '#15ad00';
        this._red = '#ff2222';
    }

    componentDidMount(prevProps, prevState) {
        this.createPie();
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.datasource && this.state.version !== this.props.datasource.version) {
            this.updatePie();
        }
    }

    createPie() {
        if (this.props.datasource) {
            let data = this.props.datasource.data[0];
            let chartContainer = $('#pieContainer' + this.props.id);
            chartContainer.easyPieChart({
                animate: {
                    duration: 800,
                    enabled: true
                },
                barColor: data.raw < 0 ? this._red : this._green,
                trackColor: 'rgba(200,200,200,0.4)',
                scaleColor: false,
                lineWidth: 7,
                lineCap: "round",
                size: 80
            });
            let chart = chartContainer.data('easyPieChart');
            if (chart) {
                chart.update(0);
                chart.update(Math.abs(data.formatted));
                $('span', chartContainer).text(data.formatted);
                this.setState({version: this.props.datasource.version});
            }
        }
    }

    updatePie() {
        if (this.props.datasource) {
            let data = this.props.datasource.data[0];
            let chartContainer = $('#pieContainer' + this.props.id);
            let chart = chartContainer.data('easyPieChart');
            chart.update(0);
            chart.update(Math.abs(data.formatted));
            $('span', chartContainer).text(data.formatted);
            this.setState({version: this.props.datasource.version});
        }
    }

    render() {
        let initialized = this.props.datasource.data && this.props.datasource.data.length > 0;
        return (
            <Container>
                {/*{initialized && <span id={'pieContainer' + this.props.id} className={'pieContainer'}>*/}
                {/*    <span className="percent" style={{paddingLeft: this.props.datasource.data[0].formatted.toString().length > 1 ? '0px' : '10px'}}>*/}
                {/*        {this.props.datasource.data[0].formatted}*/}
                {/*    </span>*/}
                {/*</span>}*/}
                {initialized && <Apexradial data={this.props.datasource.data[0].raw}/>}
                <Caption>{this.props.settings.caption ? this.props.settings.caption.toUpperCase() : ''}</Caption>
            </Container>
        );
    }
}

PercentagePieComponent.propTypes = {
    datasource: PropTypes.object,
    settings: PropTypes.object,
    id: PropTypes.string
};

const Container = styled.div`
    top: 50%;
    left: 50%;
    text-align: center; 
    margin-left:-20px;
    margin-top: -50px;
    position: absolute;
    background:#262626;
`;

const Caption = styled.label`
    font-weight: 400;
    font-size: 16px;
    color: #9aa0ac;
    padding: 2px 2px;
`;

export default PercentagePieComponent;
