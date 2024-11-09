/* eslint-disable react/prop-types */
import React from 'react';
import * as mathjs from 'mathjs';
import { scaleNumber, memoizedScale0, memoizedMin, memoizedMax } from './../../../../functions/dashboard/agGridUtils';
import styled from 'styled-components';

class DataBarCellRenderer extends React.Component {
    constructor(props) {
        super(props);
        if (!props.node.group && !this.props.node.rowPinned) {
            // magic number 24 is the default grid cell padding on both sides
            const absoluteMax = props.column.actualWidth - 24;
            const rangeMin = memoizedMin(props.dataSet);
            const rangeMax = memoizedMax(props.dataSet);

            const scaledValue = mathjs.floor(scaleNumber(props.value, absoluteMax, rangeMin, rangeMax));
            const scaled0 = mathjs.floor(memoizedScale0(absoluteMax, rangeMin, rangeMax, props.dataSet));

            this.state = { dataBarProps: this.determineBarPosition(scaled0, scaledValue) };
        }
    }

    determineBarPosition(scaled0, scaledValue) {
        const red = 'rgba(241, 92, 128, 0.6)';
        const green = 'rgba(144, 237, 125, 0.6)';

        if (scaled0 < scaledValue) {
            return {
                left: scaled0,
                width: scaledValue - scaled0,
                color: green
            };
        }

        if (scaled0 > scaledValue) {
            return {
                left: scaledValue,
                width: scaled0 - scaledValue,
                color: red
            };
        }

        if (scaled0 === 0) {
            return {
                left: 0,
                width: 1,
                color: green
            };
        }

        return {
            left: scaledValue - 1,
            width: 1,
            color: red
        };
    }

    render() {
        return (!this.props.node.group && !this.props.node.rowPinned) ?
            (<CellContainer rowHeight={this.props.rowHeight}>
                <DataBar {...this.state.dataBarProps} />
                <span>{this.props.valueFormatted || this.props.value}</span>
            </CellContainer>) : (this.props.valueFormatted || this.props.value);

    }
}

const CellContainer = styled.div`
    position: relative;
    width: 100%;
    height: ${props => `${props.rowHeight - 2}px`};

    span {
        position: absolute;
        right: 0;
    }
`;

const DataBar = styled.div`
    position: absolute;
    height: calc(100% - 2px);
    border-radius: 2px;
    left: ${props => `${props.left}px`};
    width: ${props => `${props.width}px`};
    background-color: ${props => props.color};
`;

export default DataBarCellRenderer;