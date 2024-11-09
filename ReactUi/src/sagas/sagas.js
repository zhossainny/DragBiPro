import { fork, all } from 'redux-saga/effects';
import appsSaga from './appsSaga';
import usersSaga from './usersSaga';
import adminSaga from './adminSaga';
import dashboardSaga from './dashboardSaga';
import dashboardDataSaga from './dashboardDataProviderSaga';
import storeSaga from './storeSaga';
import favouritesSaga from './favouritesSaga';

export default function* root() {
    yield all([
        fork(appsSaga),
        fork(usersSaga),
        fork(adminSaga),
        fork(dashboardSaga),
        fork(dashboardDataSaga),
        fork(storeSaga),
        fork(favouritesSaga)
    ]);
}