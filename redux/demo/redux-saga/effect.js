const makeEffect = (type, payload) => ({
  type,
  payload,
});

export function take(actionType) {
  return makeEffect("TAKE", { actionType });
}

export function fork(fn) {
  return makeEffect("FORK", { fn });
}

export function call(fn, ...args) {
  return makeEffect("CALL", { fn, args });
}

export function put(action) {
  return makeEffect("PUT", { action });
}

export function takeEvery(actionType, saga) {
  function* takeEveryHelper() {
    while (true) {
      yield take(actionType);
      yield fork(saga);
    }
  }

  return fork(takeEveryHelper);
}
