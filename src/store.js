import { createStore, combineReducers, applyMiddleware } from "./lib/redux";
import { timeMiddleware, loggerMiddleware } from "./lib/middlewares";
import { createSagaMiddleware } from "./lib/redux-saga";

import counterReducer from "./reducers/counter";
import infoReducer from "./reducers/info";

import sagaRoot from "./sagaRoot";

const reducer = combineReducers({
  counter: counterReducer,
  info: infoReducer,
});

const saga = createSagaMiddleware();

const rewriteCreateStore = applyMiddleware(saga);

const store = createStore(reducer, {}, rewriteCreateStore);

saga.run(sagaRoot);

export default store;
