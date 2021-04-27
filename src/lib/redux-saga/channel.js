export function stdChannel() {
  const takers = []; // 一个变量存储我们所有注册的事件和回调

  // 保存事件和回调的函数
  function take(next, actionType) {
    next["ACTION_TYPE"] = actionType;
    takers.push(next);

    console.info('takers', takers);
  }

  // 遍历所有注册的事件,触发对应的的taker
  function put(action) {
    takers.forEach((taker) => {
      if (taker["ACTION_TYPE"] === action.type) {
        console.log(action.type);
        taker(action);
      }
    });
  }

  return {
    take,
    put,
  };
}
