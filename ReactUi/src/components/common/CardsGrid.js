
import styled from 'styled-components';

const CardsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    grid-auto-rows: 300px;
    grid-gap: 70px;
    height: calc(100% - 115px);
    width: 100%;
    position: absolute;
    overflow-y: auto;
`;

export default CardsGrid;