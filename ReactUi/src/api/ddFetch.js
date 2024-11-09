import "isomorphic-fetch";
import {BrowserAuth as auth} from "../auth/browserAuth";
import {internalDomains, getUiUrl} from "../configuration/config";

export default function (url, options) {
    let hostname = new URL(url).hostname;
    let scheme = new URL(url).protocol;

    if(scheme ===  "http:" || !internalDomains().some(domain=> hostname.endsWith(domain))){
       // console.log("fetching: "+url)
        return fetch(url, options);
    }

    if(!auth.isTokenValid()){
        let logoutUrl = getUiUrl() + "/logout";

        window.location.href = logoutUrl+ "?location="+ window.location.href;
    }else{
        const authOptions = Object.assign({}, options, {
            headers: {
                ...options.headers,
                Authorization: "Bearer " + auth.getAccessToken()
            },
            credentials: 'omit'
        });
        return fetch(url, authOptions);
    }
}