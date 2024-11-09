import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import faSave from '@fortawesome/free-solid-svg-icons/faSave';
import ExcelLogo from '../../images/excel-logo.svg';
import ReactLogo from '../../images/react-logo.svg';

import Dropzone from 'react-dropzone';

class FormFileUpload extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            files: [],
            uploadText: "Drop file or click to upload",
            showExcelIcon: false,
            showReactIcon: false
        };

        this.onFileDrop = this.onFileDrop.bind(this);
    }

    onFileDrop(files) {
        let isExcelFile = new RegExp(".(xls|xlsm|xlsb|xlsx)$").test(files[0].name);
        let isBundleFile = files[0].name.endsWith(".js");
        let isZipFile = files[0].name.endsWith(".zip");

        this.setState({
            files,
            uploadText: files[0].name,
            showExcelIcon: isExcelFile,
            showReactIcon: isBundleFile
        });

        let fileType = isExcelFile ? "EXCEL" : isBundleFile ? "JAVASCRIPT" : "ZIP";
        files[0].fileType = fileType;

        this.props.onFileUploaded(files[0]);
    }

    render() {
        return (
            <Upload onDrop={this.onFileDrop} multiple={false}>
                <UploadContents>
                    {this.state.showExcelIcon && <Icon src={ExcelLogo} />}
                    {this.state.showReactIcon && <Icon src={ReactLogo} />}
                    {!this.state.files.length && <SaveIcon icon={faSave} size="4x" />}
                    <Text>{this.state.uploadText}</Text>
                </UploadContents>
            </Upload>
        );
    }
}

FormFileUpload.propTypes = {
    onFileUploaded: PropTypes.func.isRequired
};

const Upload = styled(Dropzone)`
    width: 100%;
    height: 150px;
    margin-bottom: 15px;
    border-width: 1px;
    border-color: #ccc;
    border-style: dashed;
    border-radius: 3px;
    display: table; 
`;

const UploadContents = styled.div`
    display: table-cell; 
    text-align:center;
    vertical-align: middle;
`;

const Icon = styled.img`
    height: 64px;
`;

const SaveIcon = styled(FontAwesomeIcon)`
    color: #42526E; 
    opacity: 0.5;
`;

const Text = styled.p`
    color: #42526E;  
    opacity: 0.7;    
`;

export default FormFileUpload;