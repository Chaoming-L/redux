import { createStore, combineReducers, applyMiddleware } from "./lib/redux";
import { timeMiddleware, loggerMiddleware } from "./lib/middlewares";
import counterReducer from "./lib/reducers/counter";
import infoReducer from "./lib/reducers/info";
import createSagaMiddleware from "./lib/redux-saga/index";
import sagaRoot from "./sagaRoot";

const reducer = combineReducers({
  counter: counterReducer,
  info: infoReducer,
});

const saga = createSagaMiddleware();

const rewriteStore = applyMiddleware(timeMiddleware, loggerMiddleware, saga);

const store = createStore(reducer, {}, rewriteStore);

saga.run(sagaRoot);

export default store;
