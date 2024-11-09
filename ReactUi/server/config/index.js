const _ = require("lodash");

function config(environment){

    function getTpsBaseUrl(){
        switch(_.lowerCase(environment)) {
            case "prod":
                return "https://xxxxxxxxxxx.net";
            default:
                return "https://xxxxxxxxxxxxxx.net";
        }
    }

    this.getTpsCookieName = function(){
        switch(_.lowerCase(environment)) {
            case "prod":
                return "dd-token-prod";
            default:
                return "dd-token-ua";
        }
    };

    this.getTpsTokenUrl = function(){
        return getTpsBaseUrl(environment) + "/oauth/token";
    };

    this.getTpsAuthUrl = function() {
        return getTpsBaseUrl(environment) + "/oauth/authorize";
    };

    this.getClientToken = function(){
       return process.env.ClientToken;
    };

    this.getCertToken = function(){
        return process.env.CertToken;
    };

    this.getCertName = function(){
        return "deskdev-" + environment + ".pfx";
    };

    this.getCallbackUrl = function(){
        switch(_.lowerCase(environment)) {
	        case "cob":
                return "https://xxx.net/login";
            case "prod":
                return "https://xxxxxxx.net/login";
            case "uat":
                return "https://xxxx.net/login";
            case "dev":
                return "https://xxxxxxxxxx.net/login";
            case "local":
                return "https://localhost/login";
            default:
                throw new Error("environment " + environment + " not recognised");
        }
    };
}

module.exports = config;