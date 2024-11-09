import React from 'react';
import Modal from '../../../common/Modal';
import { PropTypes } from 'prop-types';
import FormCaption from '../../../common/FormCaption';
import PropName from '../../../common/PropName';
import ColorPicker from '../../../common/ColorPicker';
import Spacer from './../../../common/Spacer';
import ButtonSmallWhite from './../../../common/ButtonSmallWhite';

class GroupRowFormatEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = { ...props.options };
    }

    colorChangedHandler = (propName, value) => {
        this.setState({ backgroundColor: value });
    }

    onOk = () => {
        this.props.onOk({ ...this.state });
    }

    onCancel = () => {
        this.setState({ backgroundColor: this.props.options ? this.props.options.backgroundColor : null });
        this.props.onCancel();
    }

    reset = () => {
        this.setState({ backgroundColor: null });
    }

    render() {
        return (
            <Modal show={this.props.show}
                onOK={this.onOk}
                onCancel={this.onCancel}
                width={'400px'}>
                <FormCaption>Group Row Formatting</FormCaption>
                <ButtonSmallWhite onClick={this.reset}>Reset</ButtonSmallWhite>
                <Spacer horizontalSpacing={0} verticalSpacing={20} />
                <PropName>Background</PropName>
                <ColorPicker onColorChanged={this.colorChangedHandler}
                    name={'color'}
                    color={this.state.backgroundColor} />
            </Modal>
        );
    }

}

GroupRowFormatEditor.propTypes = {
    show: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
    onOk: PropTypes.func.isRequired,
    options: PropTypes.object,
    onPropertiesChanged: PropTypes.func
};

export default GroupRowFormatEditor;