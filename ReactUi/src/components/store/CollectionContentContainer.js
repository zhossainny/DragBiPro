import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import * as appActions from "../../actions/appActions";
import * as storeActions from "../../actions/storeActions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import Spacer from "../common/Spacer";
import DeleteButton from "../appPermissions/DeleteButton";
import * as config from "../../configuration/config";
import FileUploadForm from "./FileUploadForm";

class CollectionContentContainer extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            prefix: null,
            showFileUploadForm: false
        };

        this.goBack = this.goBack.bind(this);
        this.uploadFile = this.uploadFile.bind(this);
        this.cancelFileUpload = this.cancelFileUpload.bind(this);
    }

    componentDidMount() {
        if (this.props.collection)
            this.props.actions.loadCollectionContents(this.props.collection, 'DEV', null);
    }

    directoryClickHandler(entry) {
        let path = this.state.prefix ? this.state.prefix + entry : entry;
        this.props.actions.loadCollectionContents(this.props.collection, 'DEV', path);
        this.setState({ prefix: path });
    }

    onDeleteFile(entry) {
        let path = this.state.prefix ? this.state.prefix + entry : entry;
        this.props.actions.deleteCollectionFile(this.props.collection, 'DEV', path);
    }

    parseLocalFile(files) {
        if (!files || files.length === 0) return;
        let reader = new FileReader();
        let fileName = files[0].name;
        reader.onload = () => {
            this.saveFile(reader.result, fileName);
        };
        reader.readAsBinaryString(files[0]);
    }

    saveFile(fileContent, name) {
        this.setState({ file: { name: name, content: fileContent }, showFileUploadForm: true });
    }

    uploadFile(directory) {
        if (!this.state.file) return;
        let filePath = this.state.file.name;
        let prefix = this.state.prefix;
        if (directory) {
            if (!directory.toString().endsWith('/'))
                directory = directory + '/';
            filePath = directory + filePath;
            prefix = prefix ? prefix + directory : directory;
        }
        if (this.state.prefix) {
            filePath = this.state.prefix + filePath;
        }
        this.props.actions.saveCollectionFile(this.props.collection, filePath, this.state.file.content);
        this.setState({ file: null, showFileUploadForm: false, prefix: prefix });
    }

    cancelFileUpload() {
        this.setState({ file: null, showFileUploadForm: false });
    }


    goBack() {
        if (!this.state.prefix) return;
        let prefix = this.state.prefix;
        let path = this.state.prefix.split('/').filter(Boolean);
        if (path.length === 1) {
            prefix = null;
        } else {
            path = path.slice(0, path.length - 1);
            prefix = path.join('/') + '/';
        }
        this.props.actions.loadCollectionContents(this.props.collection, 'DEV', prefix);
        this.setState({ prefix: prefix });
    }

    createContentRows() {
        let rawFileNames = this.props.collectionContents.concat([]);
        rawFileNames.sort();
        let dirs = rawFileNames.filter(x => !!x.toString().endsWith('/'));
        let files = rawFileNames.filter(x => !x.toString().endsWith('/'));
        let allFiles = dirs.concat(files);
        return allFiles.map(entry => {
            let url = config.packageStoreUri(this.props.collection, "DEV", this.state.prefix ? this.state.prefix + entry : entry);
            let isDirectory = entry.toString().endsWith('/');
            return (
                <Row key={entry}>
                    <Cell align="left">
                        {entry && !isDirectory && <FileLink target="_blank" href={url} download>{entry}</FileLink>}
                        {entry && isDirectory && <DirLink onClick={() => this.directoryClickHandler(entry)}>{entry}</DirLink>}
                    </Cell>
                </Row>
            );
        });
    }

    render() {
        if (this.props.error) {
            return (<Content>
                <ErrorMessage>Error loading collection: {this.props.error}</ErrorMessage>
            </Content>);
        }
        return (
            <Content>
                <Header>{this.props.collection.toUpperCase()} Contents</Header>
                <HeaderSmall>{this.state.prefix}</HeaderSmall>
                {this.state.prefix && <NavigationControl onClick={this.goBack}><i className="fa fa-arrow-left" aria-hidden="true" /><GoBackLabel>Go Back</GoBackLabel></NavigationControl>}
                <Table>
                    <tbody>
                        {this.createContentRows()}
                    </tbody>
                </Table>
                <FileUploadForm name={"fileUpload"} show={this.state.showFileUploadForm} onOk={this.uploadFile} onCancel={this.cancelFileUpload} />
            </Content>);
    }
}

CollectionContentContainer.propTypes = {
    collection: PropTypes.string,
    error: PropTypes.string,
    collectionContents: PropTypes.array
};

const Content = styled.div`
    padding: 50px;
    padding-top: 30px;
    height: calc(100% - 132px);
    width: 95%;
    margin: 30px auto;
    background-color:white;
    border: 1px solid #e1e1e1;
    border-radius: 3px; 
`;

const Header = styled.h2`
    font-size: 1.25em;
    font-weight: 400;
    margin-bottom: 10px;
    padding-top: 20px;
    color: #d1551d;
`;

const HeaderSmall = styled.h3`
    margin-top: 0;
    font-size:1.0em;
    font-weight: 400;
    font-family: Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif;
    color: #80848ce0;   
    margin-bottom: 15px; 
`;

const ErrorMessage = styled.h2`
    font-size: 1.25em;
    font-weight: 400;
    margin-bottom: 20px;
    padding-top: 20px;
    color: red;
    display: inline-block;
`;

const NavigationControl = styled.span`
    padding-top: 10px;
    margin-right: 20px 50px 20px 0px;
    color: #565656;
    padding-left: 5px;
`;

const GoBackLabel = styled.label`
    vertical-align: text-top;
    margin-left: 5px;
    cursor: pointer;
    font-weight: 500;
`;

const UploadControl = styled.label`
    float: right;
    margin-bottom: 10px;
    margin-top: -20px;
`;

const Row = styled.tr`
    font-size:0.9em;
    color: #565656;  
`;

const Table = styled.table`
    display: block;
    height: calc(100% - 76px);
    overflow: auto;   
    border-collapse: collapse;

    tbody,tr, td {
        display: block;
    }
    
    td {
        width: 100%;
    }
`;

const Cell = styled.td`
    text-align: center;
    padding-top: 10px;
    padding-bottom: 10px;
    padding-left: 10px;
    border-top: 1px solid #e2e0e0;
    text-align : ${props => props.align ? props.align : 'center'};
`;

const FileLink = styled.a`
    color: #42526E;
    text-decoration: none;
`;

const DirLink = styled.a`
    color: #d1551d;
    text-decoration: none;
    cursor: pointer;
`;

function mapStateToProps(state) {
    return {
        collectionContents: state.store.contents,
        error: state.store.error,
        userId: state.admin.userId
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...appActions, ...storeActions }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CollectionContentContainer);



