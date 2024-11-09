import React, { useEffect } from 'react';
import CardsGrid from '../common/CardsGrid';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as favouritesActions from '../../actions/favouritesActions';
import { PropTypes } from 'prop-types';
import Card from '../menu/panel/Card';
import styled from 'styled-components';
import { RingLoader } from 'react-spinners';

export const Favourites = ({ apps, favourites, userId, actions }) => {
    const favouriteApps = apps.filter(app => favourites.includes(app.key));

    function unFavouriteApp(key) {
        actions.unfavouriteApp(userId, key);
    }

    return (
        <Container>
            {favouriteApps.length ?
                (<FavouritesGrid className="cards-grid">
                    {favouriteApps.map(app => (<Card key={app.key} app={app} userId={userId} onFavourite={unFavouriteApp} />))}
                </FavouritesGrid>) : ( userId ? <NoFavourites>No favourites to display...</NoFavourites> 
                                              : (<Loader>
                                                    <RingLoader loading color={"#F39318"} size={100} />
                                                </Loader>) )}
        </Container>);
};

const Container = styled.div`
    position: relative;
    width: 100%;
`;

const FavouritesGrid = styled(CardsGrid)`
    position: unset;
    padding: 30px;
    height: 100%;
`;

const NoFavourites = styled.span`
    display: inline-block;
    position: absolute;
    font-size: 24px;
    top: 20%;
    left: 50%;
    transform: translateX(-50%);
    padding: 20px 30px;
`;

const Loader = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`;

Favourites.propTypes = {
    apps: PropTypes.array,
    favourites: PropTypes.array,
    userId: PropTypes.string,
    actions: PropTypes.object
};

function mapStateToProps(state) {
    return {
        apps: state.apps,
        favourites: state.favourites,
        userId: state.admin.userId,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ ...favouritesActions }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Favourites);