import React from 'react';
import PropTypes from 'prop-types';
import styled from "styled-components";

class ConditionalFormatListItem extends React.Component {

    constructor(props, context) {
        super(props, context);
    }

    getFormatSummary(format) {
        if (!format) return null;
        let summary = '';
        let entry = format.entries[0];
        summary = summary + entry.condition + ' ' + (entry.field ? entry.field : entry.value);
        summary = summary + '...';
        return summary;
    }

    render() {
        let format = this.props.format;
        let summary = this.getFormatSummary(format);
        let this_ = this;
        return (
            <div style={{marginBottom: '10px'}}>
                <ConditionalFormatCaption>{(this_.props.counter+1) + ') ' + format.name}</ConditionalFormatCaption>
                <ButtonEditFormat className="header-button"
                                  onClick={(e) =>this_.props.editCondition(format.id)}>
                    <i className="fa fa-pencil" aria-hidden="true"/>
                </ButtonEditFormat>
                <ButtonDeleteFormat className="header-button"
                                    onClick={(e) =>this_.props.deleteCondition(format.id)}>
                    <i className="fa fa-trash-o" aria-hidden="true"/>
                </ButtonDeleteFormat>
                <ConditionalFormatSummary style={{display: 'block'}}>{summary}</ConditionalFormatSummary>
                {format.color && <ColorDisplay style={{
                    background: `rgba(${ format.color.r }, ${ format.color.g }, ${ format.color.b }, ${ format.color.a })`
                }}/>}
                {format.backgroundColor && <ColorDisplay style={{
                    marginLeft: '10px',
                    background: `rgba(${ format.backgroundColor.r }, ${ format.backgroundColor.g }, ${ format.backgroundColor.b }, ${ format.backgroundColor.a })`
                }}/>}
            </div>
        );
    }
}

ConditionalFormatListItem.propTypes = {
    format: PropTypes.object,
    counter: PropTypes.number,
    editCondition: PropTypes.func,
    deleteCondition: PropTypes.func
};

const ConditionalFormatSummary = styled.label`
    font-weight: 400;
    color: gray;
    display: inline-block;
    font-family: Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif;
`;

const ConditionalFormatCaption = styled.label`
    padding-top: 2px;
    margin-top: 5px;
    min-width: 200px;
    font-size:12px;
    font-weight: 500;
    font-family: Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif;
    color: #42526E;   
`;

const ButtonEditFormat = styled.button`
    float: inherit;
    height: 23px !important;
    font-size: 14px !important;
    position: absolute;
    margin-top: 4px;
    margin-left: 10px;
`;

const ButtonDeleteFormat = styled(ButtonEditFormat)`
    margin-left: 45px;
`;

const ColorDisplay = styled.div`
    width: 14px;
    height: 14px;
    border-radius: 2px;
    display: inline-block;   
`;

export default ConditionalFormatListItem;

