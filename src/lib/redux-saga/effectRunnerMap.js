import proc from "./proc";

function runTakeEffect(env, payload, next) {
  env.channel.take(next, payload.actionType);
}

function runForkEffect(env, { saga }, next) {
  // 运行fn得到一个迭代器
  const taskIterator = saga();
  proc(env, taskIterator);

  // 不需要等待proc的结果,直接调用next
  next();
}

function runCallEffect(env, { fn, args }, next) {
  const result = fn.apply(null, args);

  if (isPromise(result)) {
    return result
      .then((effect) => next(effect))
      .catch((error) => next(error, true));
  } else {
    next(result);
  }
}

function runPutEffect(env, { action }, next) {
  // 直接 store.dispatch(action)
  env.dispatch(action);
  next();
}

const effectRunnerMap = {
  TAKE: runTakeEffect,
  FORK: runForkEffect,
  PUT: runPutEffect,
  CALL: runCallEffect,
};

// 简单判断是不是promise
function isPromise(obj) {
  return obj && typeof obj.then === "function";
}

export default effectRunnerMap;
