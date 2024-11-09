import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Plot from '../../../../../node_modules/react-plotly.js/react-plotly';

class PlotlyChartWidget extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            chartData: null,
            revision: 0
        };
    }

    componentDidMount() {
        window.addEventListener('resize', () => {
            this.setState({revision: this.state.revision + 1});
        });
        this.buildChartDataSeries();
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.dataSource.version !== prevProps.dataSource.version) {
            this.buildChartDataSeries();
        }
    }

   buildChartDataSeries() {
        if (!this.props.dataSource.data) return;
        let _this = this;
        let options = this.props.settings;
        let rowObjects = this.props.dataSource.data;
        let multi = options.series && !options.series.toString().startsWith("--");
        let data = [];
        if (multi) {
            let names = new Set();
            rowObjects.map(row => names.add(row[options.series]));
            for (let seriesName of names) {
                let filteredRows = rowObjects.filter(row => row[options.series] === seriesName);
                let multiSeries = {
                    type: options.type,
                    name: seriesName,
                    x: filteredRows.map(function(row) {
                        return row[options.x.toString()];
                    }),
                    y: filteredRows.map(function(row) {
                        return row[options.y.toString()];
                    })
                };
                data.push(multiSeries);
            }
        } else{
            let singleSeries = {
                type: options.type,
                name: options.y,
                x: rowObjects.map(function(row) {
                    return row[options.x.toString()];
                }),
                y: rowObjects.map(function(row) {
                    return row[options.y.toString()];
                })
            };

            data = [singleSeries];
        }
        _this.setState({
            chartData: data,
            revision: _this.state.revision + 1
        });
    }

    render() {
        return (
            <Container>
                {this.state.chartData && <Plot
                    revision={this.state.revision}
                    data={this.state.chartData}
                    layout={{
                        autosize: true,
                        useResizeHandler: true,
                        title: this.props.title.toUpperCase()}}
                    style={{width: "100%", height: "100%"  }}
                />}
            </Container>
        );
    }
}

PlotlyChartWidget.propTypes = {
    dataSource: PropTypes.object,
    settings: PropTypes.object,
    title: PropTypes.string
};

const Container = styled.div`
    padding: 20px;
    height: 100%;
    width: 100%;
    background-color: white;
`;
