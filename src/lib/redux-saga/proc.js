import effectRunnerMap from './effectRunnerMap'

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

  function digestEffect(effect, _next) {
    // 这个变量是用来解决竞争问题的
    let effectSettled;
    function curNext(res, isErr) {
      // 如果已经运行过了，直接return
      if (effectSettled) return

      effectSettled = true;
      _next(res, isErr);
    }

    // 这里的effect 就是指 yield 表达式后面的的结果
    if (effect) {
      // 获取对应type的处理器，然后拿来处理当前effect
      const effectRunner = effectRunnerMap[effect.type];
      effectRunner && effectRunner(env, effect.payload, curNext);
    } else {
      curNext();
    }
  }
}
