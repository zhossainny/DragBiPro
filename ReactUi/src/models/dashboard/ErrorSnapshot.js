import DataSnapshot from "./DataSnapshot";

class ErrorSnapshot extends DataSnapshot {
    constructor(url, errorMessage) {
        super(url, null, Math.floor(Math.random() * 100));
        this._error = errorMessage;
    }

    getError() {
        return this._error;
    }
}

export default ErrorSnapshot;