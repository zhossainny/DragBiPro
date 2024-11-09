import React from 'react';
import { PropTypes } from 'prop-types';
import FormCaption from '../../common/FormCaption';
import Spacer from '../../common/Spacer';
import Modal from '../../common/Modal';

const AppDeleteModal = props => {
    if (!props.app) {
        return null;
    }

    return (
        <Modal show
            onOK={props.onOk}
            onCancel={props.onCancel}
            width={'400px'}>
            <FormCaption>Delete App</FormCaption>
            <Spacer horizontalSpacing={0} verticalSpacing={20} />
            <h5 style={{ color: '#5A5A5A' }}>Are you sure you want to delete <b>{props.app.name}</b>?</h5>
        </Modal>
    );

}

AppDeleteModal.propTypes = {
    app: PropTypes.object,
    onCancel: PropTypes.func.isRequired,
    onOk: PropTypes.func.isRequired,
};

export default AppDeleteModal;