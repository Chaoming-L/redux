const thunkMiddleware = (store) => (next) => (action) => {
  return typeof action === "function"
    ? action(store.dispatch, store.getState)
    : next(action);
};
