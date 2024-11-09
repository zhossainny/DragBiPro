import {createStore, applyMiddleware} from 'redux';
import rootReducer from '../reducers';
import createSagaMiddleware from 'redux-saga';
import sagas from '../sagas/sagas';
import { composeWithDevTools } from 'redux-devtools-extension';

const sagaMiddleware = createSagaMiddleware();

export default function configureStore(initialState){
    const composeEnhancers = composeWithDevTools({ trace: true, traceLimit: 25 });
    return createStore(
        rootReducer,
        initialState,
        composeEnhancers(applyMiddleware(sagaMiddleware))
    );
}

export function runSagas(){  
    sagaMiddleware.run(sagas);
}