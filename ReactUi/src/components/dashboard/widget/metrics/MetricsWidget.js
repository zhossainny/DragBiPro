/* eslint-disable react/no-did-mount-set-state,react/no-did-update-set-state */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import '../../../../../libs/charts/jquery.easypiechart.min';
import '../../../../css/easy-pie-chart.css';
import '../../../../css/metrics.css';
import pattern from '../../../../images/bg-pattern.png';
import Apexchart from './Apexchart1';


class MetricsWidget extends React.Component {

    constructor(props, context) {
        super(props, context);

        this._green = '#15ad00';
        this._blue = '#5d9cec';
        this._red = 'red';

        this.state = {
            color: this._blue,
            backgroundColor: null,
            metrics: [],
            revision: 0
        };
    }

    componentDidMount() {
        this.setState({backgroundColor: this.getBackgroundColor()});
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.dataSource.version !== this.state.revision && this.props.settings.type !== 'text') {
            this.setState({
                metrics: this.buildMetrics(),
                revision: this.props.dataSource.version
            });
        }
    }

    getContainerStyle() {
        let width = this.props.dataSource.data.length * 150;
        return {
            width: width + 'px',
            marginLeft: (width/2 * -1) + 'px'
        };
    }

    getBackgroundColor() {
        let color = this._blue;
        let background = '#262626';
        if (this.props.settings.colorFormat) {
            color = this.props.dataSource.data[0].raw < 0 ? this._red : this._green;
        }
        return this.props.settings.invertColors ? color : background;
    }

    getMetricColor(value) {
        let color = this._blue;
        if (this.props.settings.colorFormat) {
            color = value < 0 ? this._red : this._green;
        }
        return this.props.settings.invertColors ? 'white' : color;
    }

    getFontSize(){
        return this.props.settings.fontSize ? this.props.settings.fontSize : 'l';
    }

    buildMetrics() {
        let metricsCount = this.props.dataSource.data.length;
        return this.props.dataSource.data.map((value, i) => {
            return (
                <span key={i} className={'metric size-' + this.getFontSize()}>
                    <MainText style={{color: this.getMetricColor(value.raw)}}>
                        {value.formatted}
                    </MainText>
                    {metricsCount > 1 && i !== metricsCount - 1 &&
                    <Divider inverted={this.props.settings.invertColors}> / </Divider>}
                </span>
            );
        });
    }

    render() {
        if (this.props.dataSource.data.length === 0) {
            return(
                <Container>
                    <ErrorText>No Data</ErrorText>
                </Container>
            );
        }
        return (
            <Container style={{backgroundColor: this.state.backgroundColor}}><i className="fas fa-hand-holding-usd"></i>
                {this.props.settings.type === 'numeric' &&
                <MetricsContainer style={this.getContainerStyle()} className={'metric-container size-' + this.getFontSize()}>
                    <div id="chart1">
                        <Apexchart data={this.props.dataSource.data[0].raw}/>
                    </div>
                    <LabelContainer>
                        {this.state.metrics}
                    </LabelContainer>
                    <LabelContainer>
                        <Caption inverted={this.props.settings.invertColors} className={'metric-caption size-' + this.getFontSize()}>
                            {this.props.settings.caption ? this.props.settings.caption.toUpperCase() : ''}
                        </Caption>
                    </LabelContainer>
                </MetricsContainer>}
                {this.props.settings.type === 'text' &&
                <TextLabelContainer className={'metric size-' + this.getFontSize()}>
                    <TextLabel style={{color: this.state.color}}>
                        {this.props.dataSource.data[0].raw}
                    </TextLabel>
                </TextLabelContainer>}
            </Container>
        );
    }
}

MetricsWidget.propTypes = {
    dataSource: PropTypes.object,
    settings: PropTypes.object,
    title: PropTypes.string,
    id: PropTypes.string
};

const MainText = styled.label`
    font-weight: 400; 
    color: white;
    margin-bottom: 0px;
`;

const TextLabel = styled.label`
    font-weight: 400; 
    margin-bottom: 0px;
    text-align: center;
    width: 100%;
`;

const TextLabelContainer = styled.div`
    display: flex;
    align-items: center;
    height: 100%;
`;


const Caption = styled.label`
    font-weight: 400;  
    margin-bottom: 0px;
    color: ${props => props.inverted ? 'white' : '#9aa0ac'};
`;

const ErrorText = styled.div`
    margin-left: 10px;
    margin-top: 20px;
    font-weight: 300;
    font-size: 1.5em;
    color: red;
`;

const Divider = styled.label`
    font-weight: 400;
    margin-left: 15px;
    margin-right: 10px;
    margin-bottom: 0px;
    color: ${props => props.inverted ? 'white' : '#9aa0ac'};
`;

const Container = styled.div`
    padding: 20px;
    height: 100%;
    width: 100%;
    background-color: #5d9cec;   
    background-image: url(${pattern});
    background-size:100% 100%;
`;

const LabelContainer = styled.div`

`;

const MetricsContainer = styled.div`  
    display: block;
    top: 50%;
    left: 50%;  
    position: relative;
    text-align: center;
`;

export default MetricsWidget;
