import { createStore, combineReducers, applyMiddleware } from "./redux";
import {
  exceptionMiddleware,
  timeMiddleware,
  loggerMiddleware,
} from "./middlewares";
import counterReducer from "./reducers/counter";
import infoReducer from "./reducers/info";

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

const unsubscribe = store.subscribe(() => {
  let state = store.getState();
  console.log(state.counter.count);
  console.log(state.info);
});

// 可以取消
// unsubscribe()

/*自增*/
store.dispatch({
  type: "INCREMENT",
});
store.dispatch({
  type: "DECREMENT",
});
