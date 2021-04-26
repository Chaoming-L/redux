const loggerMiddleware = (store) => (next) => (action) => {
  console.log("prev_store", store.getState());
  next(action);
  console.log("next_store", store.getState());
};

export default loggerMiddleware;
