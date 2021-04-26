export function stdChannel() {
  const currentTakers = []; // 一个变量存储我们所有注册的事件和回调

  // 保存事件和回调的函数
  function take(cb, actionType) {
    cb['MATCH'] = actionType
    currentTakers.push(cb);
  }

  function put(action) {
    const takers = currentTakers;

    for (let i = 0, len = takers.length; i < len; i++) {
      const taker = takers[i];

      if (taker["MATCH"] === action.actionType) {
        taker(action);
      }
    }
  }

  return {
    take,
    put,
  };
}
