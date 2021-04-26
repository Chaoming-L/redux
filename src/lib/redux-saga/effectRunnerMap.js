import proc from "./proc";

// 简单判断是不是promise
function isPromise(obj) {
  return obj && typeof obj.then === "function";
}

function runTakeEffect(env, payload, cb) {
  env.channel.take(cb, payload.actionType);
}

function runForkEffect(env, { fn }, cb) {
  const taskIterator = fn(); // 运行fn得到一个迭代器

  proc(env, taskIterator); // 直接将taskIterator给proc处理

  cb(); // 直接调用cb，不需要等待proc的结果
}

function runPutEffect(env, { action }, cb) {
  const result = env.dispatch(action); // 直接dispatch(action)

  cb(result);
}

function runCallEffect(env, { fn, args }, cb) {
  const result = fn.apply(null, args);

  if (isPromise(result)) {
    return result.then((data) => cb(data)).catch((error) => cb(error, true));
  }

  cb(result); 
}

const effectRunnerMap = {
  TAKE: runTakeEffect,
  FORK: runForkEffect,
  PUT: runPutEffect,
  CALL: runCallEffect,
};

export default effectRunnerMap;
