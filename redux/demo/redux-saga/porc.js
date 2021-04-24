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

    // 如果迭代器没有执行结束，那么继续消费
    if (!result.done) {
      digestEffect(result.value, next);
    }
  }

  // 这里的effect 就是指 yield 表达式后面的的结果
  function digestEffect(effect, _next) {
    if (effect) {
      // 获取对应type的处理器，然后拿来处理当前effect
      const effectRunner = effectRunnerMap[effect.type];
      effectRunner(env, effect.payload, _next);
    } else {
      _next();
    }
  }
}
