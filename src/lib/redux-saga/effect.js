export function take(actionType) {
  return {
    type: "TAKE",
    payload: { actionType },
  };
}

export function fork(saga) {
  return {
    type: "FORK",
    payload: { saga },
  };
}

export function call(fn, ...args) {
  return {
    type: "CALL",
    payload: { fn, args },
  };
}

export function put(action) {
  return {
    type: "PUT",
    payload: { action },
  };
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
