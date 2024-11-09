import React from 'react';
import styled from 'styled-components';

class PlusIcon extends React.Component{


    render(){
        return(
            <Div>
                <IconSvg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g fill="#B1B1B1" fillRule="evenodd"><path d="M13.272 13.272h9.344a1.387 1.387 0 0 0-.01-2.772h-9.334V9.337 1.384a1.387 1.387 0 0 0-2.772.01V10.5H1.394C.617 10.5 0 11.12 0 11.886c0 .771.618 1.386 1.38 1.386h9.16l-.04 9.334c0 .777.62 1.394 1.386 1.394a1.38 1.38 0 0 0 1.386-1.38v-6.733-2.637z"/></g></IconSvg>
            </Div>
        );
    }
}

const Div = styled.div`
    text-align: center;
    display: table-cell;
    width:60px;
    height:60px;
`;

const IconSvg = styled.svg`
    padding-top: 20px;
    padding-bottom: 10px;
    display: block;
    font-size: 1.5em;
    color: inherit;
    width: 100%
`;

export default PlusIcon;