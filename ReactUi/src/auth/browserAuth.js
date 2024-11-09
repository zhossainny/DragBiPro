import * as config from "../configuration/config";
import {IssuerKeyResolver as keyResolver} from "./issuerKeyResolver";
import cookie from "cookie";
import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_NAME = 'dd-access-token';

export class BrowserAuth {

    static refreshAccessToken(){
        const cookies = cookie.parse(document.cookie);
        const cookieName = config.getAuthCookieName();

        if(Object.keys(cookies).some(c=> c === cookieName)){
           let tokenName = this.getAccessTokenName();

            window.localStorage[tokenName] = cookies[cookieName];

            document.cookie = cookie.serialize(cookieName, cookies[cookieName],{expires : new Date("Thu, 01 Jan 1970 00:00:00 UTC")});
        }
    }

    static getAccessToken(){
        let tokenName = this.getAccessTokenName();

        return window.localStorage.getItem(tokenName);
    }

    static getAccessTokenName(){
        return ACCESS_TOKEN_NAME + "-" + config.getEnvironment();
    }

    static isTokenValid(){
        try{
            let publicKey = keyResolver.getKey();
            return jwt.verify(this.getAccessToken(), publicKey, {clockTolerance: 10})
        }
        catch(error){
            console.error("unable to verify access token", error);
            return false;
        }
    }
}

