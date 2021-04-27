import effectRunnerMap from "./effectRunnerMap";

export default function proc(env, iterator) {
  next();

  // next 函数就是用来执行 iterator
  function next(resultValue, isErr) {
    let result;

    if (isErr) {
      result = iterator.throw(resultValue);
    } else {
      // 没调用一次next,都消费一个yield
      result = iterator.next(resultValue);
    }

    if (!result.done) {
      digestEffect(result.value, next);
    }
  }

  function digestEffect(effect, _next) {
    // effect 其实就是 yield 后面的结果
    if (effect) {
      // 获取对应type的处理器，然后拿来处理当前effect
      const effectRunner = effectRunnerMap[effect.type];
      effectRunner && effectRunner(env, effect.payload, _next);
    } else {
      _next();
    }
  }
}
