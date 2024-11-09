import styled from 'styled-components';

const BrowserSelect = styled.select`
    padding: 3px;
    margin-bottom: ${props => props.marginBottom || 'initial'};
    min-width: 200px;
    width: 15%;
    display: inline-block;
    border: 1px solid #ccc;
    border-radius: 3px;
    box-sizing: border-box;
    font-size:13px;
    font-family: Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif;
    color: #42526E;
`;

export default BrowserSelect;