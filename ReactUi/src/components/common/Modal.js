import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

class Modal extends React.Component {
  render() {
    if(!this.props.show) {
      return null;
    }

    return (
        <Backdrop>
            <ModalWindow height={this.props.height} width={this.props.width}>
                {this.props.children}
            <Footer className="footer">
                <Button disabled={this.props.disableOk} onClick={this.props.onOK}>
                    OK
                </Button>
                <Button onClick={this.props.onCancel}>
                    Cancel
                </Button>
            </Footer>  
            </ModalWindow>
        </Backdrop>
    );
  }
}

Modal.propTypes = {
    onCancel: PropTypes.func.isRequired,
    height: PropTypes.string,
    width: PropTypes.string,
    onOK: PropTypes.func.isRequired,
    show: PropTypes.bool,
    disableOk : PropTypes.bool,
    children: PropTypes.node
};

const Backdrop = styled.div`
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0,0,0,0.3);
    padding: 50px;
    z-index: 999;
`;

const ModalWindow = styled.div`
    background-color: #262626;
    border-radius: 5px;
    ${props=>props.width ? ' width: ' + props.width : 'width:400px'};
    ${props=>props.height > 0 ? ' height: ' + props.height : ''};
    margin: 0 auto;
    padding: 30px;
`;

const Footer = styled.div`
    position: relative;
    left: -5px;
    top: 10px;
    width: 100%;
    color: white;
    text-align: center;
    padding-top:10px;
    padding-bottom:10px;
`;

const Button = styled.button`
    background-color: #337ab7;
    border: none;
    border-radius: 3px;
    color: white;
    margin: 10px 5px 10px 20px;
    padding: 8px;
    text-decoration: none;
    display: inline-block;
    width: 120px;
    opacity: ${props=> props.disabled ? '0.7' : '1'}
    &:hover  {
        background-color: ${props=> props.disabled ? '#337ab7' : '#2d6fa8'};
        cursor: ${props=> props.disabled ? 'hand' : 'pointer'};
    }
`;

export default Modal;

