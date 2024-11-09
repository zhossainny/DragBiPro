/* eslint-disable react/no-did-mount-set-state,react/no-did-update-set-state */
'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { SketchPicker } from 'react-color';
import styled from 'styled-components';
import * as _ from 'lodash';

class ColorPicker extends React.Component {
    constructor(props, context) {
        super(props, context);
        this._defaultColor = {
            r: '0',
            g: '0',
            b: '0',
            a: '1'
        };

        this.state = {
            displayColorPicker: false,
            color: this._defaultColor
        };

        this.handleClick = this.handleClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        if (this.state.color !== this.props.color && this.props.color)
            this.setState({ color: this.props.color });
    }

    componentDidUpdate() {
        if (!this.state.displayColorPicker && this.state.color !== this.props.color)
            this.setState({ color: this.props.color });
    }

    handleClick() {
        this.setState({ displayColorPicker: !this.state.displayColorPicker });
    }

    handleClose() {
        this.props.onColorChanged(this.props.name, this.state.color);
        this.setState({ displayColorPicker: false });
    }

    handleChange(color) {
        this.setState({ color: color.rgb });
    }

    render() {
        return (
            <Container>
                <ColorDisplay onClick={this.handleClick}>
                    <ColorBox color={this.state.color || this._defaultColor} />
                </ColorDisplay>
                {this.state.displayColorPicker ?
                    <Popover>
                        <Overlay onClick={this.handleClose} />
                        <SketchPicker color={this.state.color || this._defaultColor} onChange={this.handleChange} />
                    </Popover> : null}
            </Container>
        );
    }
}


const Container = styled.div`
    display: inline-block;
    vertical-align: middle;
`;

const ColorDisplay = styled.div`
    padding: 5px;
    background: #fff;
    border-radius: 3px;
    box-shadow: 0 0 0 1px rgba(0,0,0,.1);
    display: inline-block;
    cursor: pointer;
`;

const ColorBox = styled.div`
    width: 14px;
    height: 14px;
    border-radius: 3px;
    background: ${props => _.isObject(props.color) ? `rgba(${props.color.r}, ${props.color.g}, ${props.color.b}, ${props.color.a})` : props.color}
`;

const Popover = styled.div`
    position: absolute;
    z-index: 2;
`;

const Overlay = styled.div`
    position: fixed;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
`;


ColorPicker.propTypes = {
    name: PropTypes.string,
    color: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    onColorChanged: PropTypes.func
};

export default ColorPicker;