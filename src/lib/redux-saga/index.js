import { stdChannel } from "./channel";
import { runSaga } from "./runSaga";

const createSagaMiddleware = () => {
  const channel = stdChannel();
  let boundRunSaga;

  // 返回的是一个Redux中间件
  // 需要符合他的范式
  const sagaMiddleware = (store) => {
    // 将getState, dispatch, channel 通过bind传给runSaga
    boundRunSaga = runSaga.bind(null, {
      channel,
      dispatch: store.dispatch,
      getState: store.getState,
    });

    return (next) => (action) => {
      const result = next(action);

      // 将收到的 action 转发给 saga
      channel.put(action);

      return result;
    };
  };

  sagaMiddleware.run = (...args) => {
    boundRunSaga(...args);
  };

  return sagaMiddleware;
};

export default createSagaMiddleware;
