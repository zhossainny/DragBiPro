import React, { Component } from 'react';
import ReactApexChart from 'react-apexcharts';

class Apexchart1 extends Component {

    constructor(props) {
        super(props);

        this.state = {
            apexBarChartOpt: {
                chart: {
                    type: 'line',
                    foreColor: '#9f9ea4',
                    height: 60,
                    sparkline: {
                        enabled: true
                    }
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    curve: 'smooth',
                    width: 3
                },
                colors: this.props.data<0? ['red']:['green'],
                marker: {
                    show: false
                },
                tooltip: {
                    fixed: {
                        enabled: false
                    },
                    x: {
                        show: false
                    },
                    y: {
                        title: {
                            formatter: function (seriesName) {
                                return ''
                            }
                        }
                    },
                    marker: {
                        show: false
                    }
                }
            }
        }
    }

    render() {
        const apexNegData = [{
            data: [-24, -66, -42, -88, -62, -24, -45, -12, -36, -10]
        }];

        const apexPosData = [{
            data: [24, 66, 42, 88, 62, 24, 45, 12, 36, 10]
        }];
        let finalData = this.props.data<0? apexNegData:apexPosData;
        return (
            <React.Fragment>
                <ReactApexChart options={this.state.apexBarChartOpt} series= {finalData} type="area" height="60" />
            </React.Fragment>
        );
    }
}

export default Apexchart1;