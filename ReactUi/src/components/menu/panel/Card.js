import React from 'react';
import styled from 'styled-components';
import thumbnail from '../../../images/thumbnail.png';
import { faTrashAlt, faStar } from '@fortawesome/free-solid-svg-icons/index';
import { faStar as faStarAlt } from '@fortawesome/free-regular-svg-icons/index';
import DashboardIcon from '../../common/DashboardIcon';
import composedUserHelper from '../../utils/UserHelper';
import { PropTypes } from 'prop-types';
import { Link } from 'react-router-dom';


export const Card = props => {
    function lastUpdateBy() {
        if (props.app.tags.updatedBy) {
            return props.app.tags.updatedBy.split(' (')[0];
        }

        return '';
    }

    function deleteCard() {
        props.onDelete(props.app);
    }

    function favouriteCard() {
        if(props.hasFavourited(props.app.key)) {
            props.onFavourite(props.app.key, true);
        } else {
            props.onFavourite(props.app.key);
        }
    }

    function appUrl() {
        if (props.app.tags.shared === 'false') {
            return `/dashboard/${props.userId}/${props.app.key}`;
        }

        return `/dashboard/${props.app.key}`;
    }

    return (
        <Article>
            <div className="view-container">
                <Thumbnail src={thumbnail} />
                <div className="view-text">
                    <div>View</div>
                </div>
                <AppLink to={appUrl()} />
            </div>
            <About>
                <Details>
                    <Name>{props.app.name}</Name>
                    <Author>by <Span>{lastUpdateBy()}</Span></Author>
                </Details>
                <Icons>
                    {props.onDelete && <DashboardIcon icon={faTrashAlt} className={!props.isAdminOn(props.app.key) ? 'disabled' : ''} value={props.app.key} onClick={deleteCard} fixedWidth />}
                    {props.onFavourite && <DashboardIcon icon={props.hasFavourited(props.app.key) ? faStar : faStarAlt} fixedWidth onClick={favouriteCard} />}
                </Icons>
            </About>
        </Article>
    );
};

Card.propTypes = {
    app: PropTypes.object.isRequired,
    userId: PropTypes.string.isRequired,
    isAdminOn: PropTypes.func.isRequired,
    hasFavourited: PropTypes.func.isRequired,
    onDelete: PropTypes.func,
    onFavourite: PropTypes.func
};

const Thumbnail = styled.img`
    height: 100%;
    width: 100%;
`;

const Name = styled.p`
    flex: 0 0 70%;
    overflow: hidden;
    margin: 0;
    font-size: 1em;
    font-weight:500;
    padding: 10px 0px 0px 10px;
    color: white;
`;

const Author = styled.p`
    flex: 0 0 30%;
    overflow: hidden;
    margin: 0;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 0.75em;
    padding: 5px 0px 5px 10px;
    color: #3da5de;
`;

const Details = styled.div`
    display: flex;
    flex-direction: column;
    overflow: hidden;
    flex: 0 0 80%;
    justify-content: space-between;
`;

const Span = styled.span`
    color:#3da5de;
    font-weight:600;
    padding-left: 3px;
`;

const Icons = styled.div`
    display: inline-flex;
    margin-top: 10px;
    flex: 0 0 20%;
`;

const About = styled.div`
    display: flex;
    flex-direction: row;
    flex: 0 0 30%;
`;

const AppLink = styled(Link)`
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
`;

const Article = styled.article`
    display: flex;
    margin: 8px;
    flex-direction: column;
    border-radius: 3px;
    background: #190019;
    box-shadow: 0 2px 8px 0 #b6b6b6;

    .view-container {
        position: relative;
        flex: 0 0 70%;
        border-bottom:1px solid #e5e5e5;

        &:hover {
            cursor: pointer;

            img {
                opacity: .3;
            }

            .view-text {
                opacity: 1;
            }
        }

        .view-text {
            transition: .5s ease;
            opacity: 0;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;

            div {
            background-color: #dd3b5fe0;
            color: white;
            font-size: 1em;
            padding: 12px 24px;
            border-radius: 3px;
            }
        }
    }
    
`;

export default composedUserHelper(Card);

