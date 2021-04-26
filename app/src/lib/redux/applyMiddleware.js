import compose from "./compose";

export default function applyMiddleware(...middlewares) {
  return function rewriteCreateStoreFunc(oldCreateStore) {
    return function newCreateStore(reducer, initState) {
      // 生成store
      const store = oldCreateStore(reducer, initState);

      /*给每个 middleware 传下store，相当于 const logger = loggerMiddleware(store);*/
      /* const chain = [exception, time, logger]*/
      const chain = middlewares.map((middleware) => middleware(store));

      /* 实现 exception(time((logger(dispatch))))*/
      store.dispatch = compose(...chain)(store.dispatch);

      return store;
    };
  };
}
