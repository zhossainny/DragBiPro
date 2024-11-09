import React from 'react';
import styled from 'styled-components';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons/index';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome/index";
import PropTypes from 'prop-types';
import * as _ from 'lodash';



class SearchBox extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            focus: false,
            searchTerm: ''
        };
    }

    componentDidMount() {
        this.debouncedTextChanged = _.debounce(value => this.props.onTextChanged(value), 400);
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevState.searchTerm !== this.state.searchTerm) {
            this.debouncedTextChanged(this.state.searchTerm);
        }
    }

    onTextChanged = e => this.setState({ searchTerm: e.target.value });

    onFocus = e => this.setState({ focus: true });

    onBlur = e => this.setState({ focus: false });

    onClearSearch = () => this.setState({ searchTerm: '' });

    render() {
        let fillColor = this.state.focus ? "#b1b1b1" : "#d1d1d1";
        return (<Search>
            <SearchInput onFocus={this.onFocus} onBlur={this.onBlur} type="search" id="search" placeholder="Search existing apps below" value={this.state.searchTerm} onChange={this.onTextChanged} autoComplete="off" spellCheck="off" autoCorrect="off" />
            <SearchIcon icon={faSearch} color={fillColor} />
            {this.state.searchTerm && <CloseIcon icon={faTimes} color={fillColor} onClick={this.onClearSearch} />}
        </Search>);
    }
}

SearchBox.propTypes = {
    onTextChanged: PropTypes.func.isRequired,
    placeholder: PropTypes.string
};

const Search = styled.div`
    position: relative;
    flex-grow: 1;
    margin-right: auto;
    max-width: 400px;
    min-width: 150px;
`;

const SearchInput = styled.input`
    margin: 0px;
    width: 100%;
    height: 45px;
    border:1px solid #e5e5e5;
    border-radius:3px;
    font-size: 0.95em;
    color: white; 
    background:black;
    padding: 10px 10px 10px 40px;
    display : block;
    &:focus {
        outline: none;
        border:1px solid #d1d1d1;
    }
    &::placeholder {
        color: #b1b1b1;
        font-weight: 500;
    }
    &:focus::placeholder{
        color: #a1a1a1; 
    }
`;

const SearchIcon = styled(FontAwesomeIcon)`
    position: absolute;
    top: 16px;
    left: 12px;
`;

const CloseIcon = styled(FontAwesomeIcon)`
    position: absolute;
    top: 16px;
    right: 12px;
    &:hover {
        cursor: pointer;
    }
`;

export default SearchBox;