import {LOCAL_FILE_PREFIX} from "../../configuration/constants";

class DataSnapshot {
    constructor(url, rawData, version = 0) {
        this._url = url;
        this._rawData = rawData;
        this._version = version;
        this._timestamp = Date.now();
    }

    getVersion() {
        return this._version;
    }

    getUrl() {
        return this._url;
    }

    getPayload() {
        if (this.getUrl().toString().endsWith(LOCAL_FILE_PREFIX)) {
            let parsedJson = JSON.parse(this._getRawData());
            if (!parsedJson) return null;
            return atob(parsedJson.data);
        }
        return this._rawData;
    }

    getTimeStamp() {
        return this._timestamp;
    }

    getFormattedTimeStamp() {
       return new Date(this._timestamp).toLocaleTimeString([], {hour12: false});
    }

    isFresh(threshold) {
        return (Date.now() - this.getTimeStamp())/1000 < threshold;
    }

    _getRawData() {
        return this._rawData;
    }
}

export default DataSnapshot;