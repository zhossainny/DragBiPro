/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/no-did-mount-set-state,react/no-did-update-set-state */
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import '../../../../../libs/charts/jquery.easypiechart.min';
import '../../../../css/easy-pie-chart.css';
import '../../../../css/metrics.css';
import { findConfigItemsInExpression } from '../../../../functions/utils';
import { getEnvironment } from '../../../../configuration/config';
import { REQUEST_SET_ENVIRONMENT, SET_TARGET_PATH } from './../../../../configuration/constants';

class IFrameWidget extends React.PureComponent {

    constructor(props, context) {
        super(props, context);
    }

    componentDidMount() {
        window.addEventListener('message', this.handleFrameMessage);
    }

    componentWillUnmount() {
        window.removeEventListener('message', this.handleFrameMessage);
    }

    resolveUrl = () => {
        let url = this.props.url;
        const matchingConfigItemsInUrl = findConfigItemsInExpression(this.props.url, this.props.configItems);
        matchingConfigItemsInUrl.forEach(match => {
            url = url.replace(`{${match.key}}`, match.value);
        });
        return url;
    }

    handleFrameMessage = e => {
        if (this.state.iFrameRef && this.state.iFrameRef.contentWindow === e.source) {
            switch (e.data.type) {
                case REQUEST_SET_ENVIRONMENT: {
                    this.postSetEnvironmentMessage();
                    break;
                }
                case SET_TARGET_PATH: {
                    this.setTargetPathSearchParam(e.data.message.targetPath);
                    break;
                }
                default:
                    alert(e.data);
            }
        }
    }

    postSetEnvironmentMessage() {
        const targetPath = new URLSearchParams(window.location.search).get('targetPath');
        this.state.iFrameRef.contentWindow.postMessage({ type: 'set-environment', message: { id: this.props.id, env: getEnvironment(), baseUri: `${window.location.protocol}//${window.location.host}`, targetPath } }, '*');
    }

    setTargetPathSearchParam(path) {
        let baseUrl = window.location.href;
        if (window.location.search) {
            baseUrl = baseUrl.replace(window.location.search, '');
        }

        const newUrl = `${baseUrl}?targetPath=${path}`;
        window.history.pushState({}, '', newUrl);
    }

    render() {
        return (
            <Container>
                <FrameContainer src={this.resolveUrl()} innerRef={frame => this.setState({ iFrameRef: frame })} key={this.props.forceRefreshCount} />
            </Container>
        );
    }
}

IFrameWidget.propTypes = {
    id: PropTypes.string,
    url: PropTypes.string,
    configItems: PropTypes.array,
    forceRefreshCount: PropTypes.number
};


const Container = styled.div`
    height: 100%;
    width: 100%;
`;

const FrameContainer = styled.iframe`
    height: 100%;
    width: 100%;
    border: none;
`;

export default IFrameWidget;
