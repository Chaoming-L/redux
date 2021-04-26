import { createStore, combineReducers, applyMiddleware } from "./lib/redux";
import {
  exceptionMiddleware,
  timeMiddleware,
  loggerMiddleware,
} from "./lib/middlewares";
import counterReducer from "./lib/reducers/counter";
import infoReducer from "./lib/reducers/info";

const reducer = combineReducers({
  counter: counterReducer,
  info: infoReducer,
});

const rewriteStore = applyMiddleware(
  exceptionMiddleware,
  timeMiddleware,
  loggerMiddleware
);

const store = createStore(reducer, {}, rewriteStore);

export default store;
