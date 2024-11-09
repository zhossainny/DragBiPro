import * as config from '../configuration/config'
import {keys} from '../configuration/tpsPublicKeys'

export class IssuerKeyResolver {

    static getKey(){
        let environment = config.getEnvironment().toUpperCase();

        return keys[environment];
    }

}