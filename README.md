## 前言
记得最开始接触状态管理的时候，第一个就是 redux。当时全是全新的名词：`reducer、state、dispatch、middleware、store` 等等，我就理解一个 state，因为 react 中就有 state 的概念。

下面我们从状态管理说起，并且一步一步实现`redux`。

## 状态管理器

### 简单的状态管理

redux 是一个状态管理器。什么是状态？简单来说状态即数据，比如计数器的count。

```js
let state = {
  count: 1
}
// 使用状态
console.log(count)
// 修改状态
state.count = 2
```

很好，我们实现了一个最简单的状态修改和使用了。但是上面有3个明显问题：
* 修改 count 之后，使用 count 的地方不能收到通知。
* state.count 为全局变量，任何地方都可以修改 count。这很危险。
* 这个状态管理只能管理 count, 不通用。

我们可以使用 发布-订阅模式 和 封装 来解决这个问题。


```js
const createStore = function (initState) {
  let state = initState;
  let listeners = [];

  // 订阅
  function subscribe(listener) {
    listeners.push(listener);

    // 退订
    return function unsubscribe() {
      const index = listeners.indexOf(listener)
      listeners.splice(index, 1)
    }
  }

  // 修改状态
  function dispatch(newState) {
    state = newState;
    /* 通知 */
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i];
      listener();
    }
  }

  // 外部访问 state 的唯一办法
  function getState() {
    return state;
  }

  return {
    subscribe,
    dispatch,
    getState
  }
}
```

状态管理的极简版实现了，我们来使用这个状态管理试一试。

```js
let initState = {
  counter: {
    count: 0
  }
}

const store = createStore(initState);

store.subscribe(() => {
  let state = store.getState();
  console.log(state.counter.count);
});

store.dispatch({
  counter: {
    count: 1
  }
});
```

不知不觉，我们已经实现了 redux 的 `createStore`，提供了 `subsrcibe`,`dispatch`,`getState`三个API。

### 可预测的状态管理

我们用上面的状态管理器来实现一个自增，自减的计数器。

```js
let initState = {
  count: 0
}
let store = createStore(initState);

store.subscribe(() => {
  let state = store.getState();
  console.log(state.count);
});
/*自增*/
store.dispatch({
  count: store.getState().count + 1
});
/*自减*/
store.dispatch({
  count: store.getState().count - 1
});
/*我想随便改*/
store.dispatch({
  count: 'abc'
});

```

你一定发现了问题，`count` 被改成了字符串 `abc`，因为我们对 count 的修改没有任何约束，任何地方，任何人都可以修改。

我们需要约束，不允许计划外的 count 修改，我们只允许 count 自增和自减两种改变方式！

那我们分两步来解决这个问题:

1. 制定一个 state 修改计划，告诉 store，我的修改计划是什么。利用计划,使得状态*可预测*
2. 修改 `store.dispatch` 方法，告诉它修改 state 的时候，按照我们的计划修改。
我们来设置一个 `reducer` 函数 ，接收现在的 state，和一个 `action`，返回经过后的新的 state。


```js
/*注意：action = {type:'',other:''}, action 必须有一个 type 属性*/
function reducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return {
        ...state,
        count: state.count + 1
      }
    case 'DECREMENT':
      return {
        ...state,
        count: state.count - 1
      }
    default:
      return state;
  }
}
```

我们把这个计划告诉 store，调用`store.dispatch`改变 state 要按照我的计划来改。

```js
/*增加一个参数 reducer*/
const createStore = function (reducer, initState) {
  let state = initState;
  let listeners = [];

  function subscribe(listener) {
    listeners.push(listener);

    // 退订
    return function unsubscribe() {
      const index = listeners.indexOf(listener)
      listeners.splice(index, 1)
    }
  }

  function dispatch(action) {
    /*请按照我的计划修改 state*/  
    state = reducer(state, action);
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i];
      listener();
    }
  }

  function getState() {
    return state;
  }

  return {
    subscribe,
    dispatch,
    getState
  }
}
```

我们来尝试使用下新的 createStore 来实现自增和自减

```js
let initState = {
  count: 0
}
/*把reducer函数*/
let store = createStore(reducer, initState);

store.subscribe(() => {
  let state = store.getState();
  console.log(state.count);
});
/*自增*/
store.dispatch({
  type: 'INCREMENT'
});
/*自减*/
store.dispatch({
  type: 'DECREMENT'
});
/*我想随便改 计划外的修改是无效的！*/
store.dispatch({
  count: 'abc'
});

```
`reducer` 即 计划函数, `reducer`使我们的状态可预测.

## 多文件协作
### reducer 的拆分和合并

我们知道 `reducer` 是一个计划函数，接收老的 state，按计划返回新的 state。那我们项目中，有大量的 state，每个 state 都需要计划函数，如果全部写在一起会是啥样子呢？

所有的计划写在一个 `reducer` 函数里面，会导致 `reducer` 函数及其庞大复杂。按经验来说，我们肯定会按组件维度来拆分出很多个 reducer 函数，然后通过一个函数来把他们合并起来。

我们来管理两个 state，一个 counter，一个 info。

```js
let state = {
  counter: {
    count: 0
  },
  info: {
    name: '完全理解reducer'
  }
}
```
各自的`reducer`

```js
/* counterReducer, 一个子reducer */
/*注意：counterReducer 接收的 state 是 state.counter*/
function counterReducer(state, action) {
  switch (action.type) {
    case 'INCREMENT':
      return {
        count: state.count + 1
      }
    default:
      return state;
  }
}
```

```js
/*InfoReducer，一个子reducer*/
/*注意：InfoReducer 接收的 state 是 state.info*/
function InfoReducer(state, action) {
  switch (action.type) {
    case 'SET_NAME':
      return {
        ...state,
        name: action.name
      }
    default:
      return state;
  }
}
```

为了解决`reducer`拆分问题,我们需要实现一个`combineReducers`函数将多个`reducer`函数合并成一个`reducer`函数.函数用法如下:

```js
const reducer = combineReducers({
    counter: counterReducer,
    info: InfoReducer
});
```

下面我们实现`combineReducers` 函数:
```js
function combineReducers(reducers) {
  return function combination(state = {}, action) {
    const nextState = {};

    for (let [key, reducer] of Object.entries(reducers)) {
      const prevState = state[key];
      // 执行  子reducer，获得新的state
      nextState[key] = reducer(prevState, action);
    }

    return nextState;
  };
}
```

我们来使用一下自己实现的`combineReducers`:
```js
const reducer = combineReducers({
  counter: counterReducer,
  info: InfoReducer
});

let initState = {
  counter: {
    count: 0
  },
  info: {
    name: '理解combineReducers',
  }
}

let store = createStore(reducer, initState);
```

### state 的拆分和合并

上一小节，我们把 reducer 按组件维度拆分了，通过 combineReducers 合并了起来。但是还有个问题， state 我们还是写在一起的，这样会造成 state 树很庞大，不直观，很难维护。我们需要拆分，一个 state，一个 reducer 写一块。

我们期待的用法:
```js
/* counter 自己的 state 和 reducer 写在一起*/
let initState = {
  count: 0
}
function counterReducer(state, action) {
  /*注意：如果 state 没有初始值，那就给他初始值！*/  
  if (!state) {
      state = initState;
  }
  switch (action.type) {
    case 'INCREMENT':
      return {
        count: state.count + 1
      }
    default:    
      return state;
  }
}
```

下面用一行代码实现这个功能! 真优雅

```js
const createStore = function (initState) {
  let state = initState;
  let listeners = [];

  // 订阅
  function subscribe(listener) {
    listeners.push(listener);
  }

  // 修改状态
  function dispatch(newState) {
    state = newState;
    /* 通知 */
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i];
      listener();
    }
  }

  // 😎😎😎！！！只修改了这里，用一个不匹配任何计划的 type，来获取初始值
  dispatch({ type: Symbol() })

  // 外部访问 state 的唯一办法
  function getState() {
    return state;
  }

  return {
    subscribe,
    dispatch,
    getState
  }
}
```

为什么这一行代码威力那么大?我们思考一下
1. createStore 的时候，用一个不匹配任何 type 的 action，来触发 state = reducer(state, action)
2. 因为 action.type 不匹配，每个子 reducer 都会进到 default 项，返回自己初始化的 state，这样就获得了初始化的 state 树了。

## 中间件 middleware

中间件 middleware 是 redux 中最难理解的部分.我尝试一下用通俗的方法解释一下.
划重点: *`中间件是对 dispatch 的扩展，或者说重写，增强 dispatch 的功能`*

### 记录日志
现在有一个需求，在每次修改 state 的时候，记录下来 修改前的 state ，为什么修改了，以及修改后的 state。我们可以通过重写 store.dispatch 来实现，直接看代码:
```js
const store = createStore(reducer);
const next = store.dispatch;

// 重写了store.dispatch
store.dispatch = (action) => {
  console.log('this state', store.getState());
  console.log('action', action);
  next(action);
  console.log('next state', store.getState());
}
```

### 记录异常
现在我们需要记录每次数据出错的原因，我们扩展下 dispatch
```js
const store = createStore(reducer);
const next = store.dispatch;

store.dispatch = (action) => {
  try {
    next(action);
  } catch (err) {
    // 这样每次 dispatch 出异常的时候，我们都会记录下来。
    console.error('错误报告: ', err)
  }
}
```

### 使用多个中间件
我现在既需要记录日志，又需要记录异常，怎么办？最简单粗暴的,两个函数合起来!
```js
store.dispatch = (action) => {
  try {
    console.log('this state', store.getState());
    console.log('action', action);
    next(action);
    console.log('next state', store.getState());
  } catch (err) {
    console.error('错误报告: ', err)
  }
}
```
如果再来一个需求怎么办? 接着改 `dispatch`函数? 我们当然可以一把梭!那再来200个需求呢?
`dispatch`将会变得非常臃肿混乱,直到无法无法维护...

我们需要考虑如何实现扩展性很强的多中间件合作模式。

1. 我们把 loggerMiddleware 提取出来
```js
const store = createStore(reducer);
const next = store.dispatch;

const loggerMiddleware = (action) => {
  console.log('this state', store.getState());
  console.log('action', action);
  next(action);
  console.log('next state', store.getState());
}

store.dispatch = (action) => {
  try {
    loggerMiddleware(action);
  } catch (err) {
    console.error('错误报告: ', err)
  }
}
```
2. 我们把 exceptionMiddleware 提取出来

```js
const exceptionMiddleware = (action) => {
  try {
    /*next(action)*/
    loggerMiddleware(action);
  } catch (err) {
    console.error('错误报告: ', err)
  } 
}
store.dispatch = exceptionMiddleware;
```
3. 现在的代码有一个很严重的问题，就是 exceptionMiddleware 里面写死了 loggerMiddleware，我们需要让 next(action)变成动态的，随便哪个中间件都可以

```js
const exceptionMiddleware = (next) => (action) => {
  try {
    /*loggerMiddleware(action);*/
    next(action);
  } catch (err) {
    console.error('错误报告: ', err)
  } 
}
/*loggerMiddleware 变成参数传进去*/
store.dispatch = exceptionMiddleware(loggerMiddleware);
```

4. 同样的道理，loggerMiddleware 里面的 next 现在恒等于 store.dispatch，导致 loggerMiddleware 里面无法扩展别的中间件了！我们也把 next 写成动态的

```js
const loggerMiddleware = (next) => (action) => {
  console.log('this state', store.getState());
  console.log('action', action);
  next(action);
  console.log('next state', store.getState());
}
```
到这里为止，我们已经探索出了一个扩展性很高的中间件合作模式.

```js
const store = createStore(reducer);
const next = store.dispatch;

const loggerMiddleware = (next) => (action) => {
  console.log('this state', store.getState());
  console.log('action', action);
  next(action);
  console.log('next state', store.getState());
}

const exceptionMiddleware = (next) => (action) => {
  try {
    next(action);
  } catch (err) {
    console.error('错误报告: ', err)
  }
}

store.dispatch = exceptionMiddleware(loggerMiddleware(next));
```
这时候我们开开心心的新建了一个 loggerMiddleware.js，一个exceptionMiddleware.js文件，想把两个中间件独立到单独的文件中去。会碰到什么问题吗？

loggerMiddleware 中包含了外部变量 store，导致我们无法把中间件独立出去。那我们把 store 也作为一个参数传进去!
```js
const store = createStore(reducer);
const next  = store.dispatch;

const loggerMiddleware = (store) => (next) => (action) => {
  console.log('this state', store.getState());
  console.log('action', action);
  next(action);
  console.log('next state', store.getState());
}

const exceptionMiddleware = (store) => (next) => (action) => {
  try {
    next(action);
  } catch (err) {
    console.error('错误报告: ', err)
  }
}

const logger = loggerMiddleware(store);
const exception = exceptionMiddleware(store);
store.dispatch = exception(logger(next));
```

### applyMiddleware 中间使用方式优化
上一节我们已经完全实现了正确的中间件！但是中间件的使用方式不是很友好
```js
import loggerMiddleware from './middlewares/loggerMiddleware';
import exceptionMiddleware from './middlewares/exceptionMiddleware';

...

const store = createStore(reducer);
const next = store.dispatch;

const logger = loggerMiddleware(store);
const exception = exceptionMiddleware(store);
store.dispatch = exception(logger(next));
```

其实我们只需要知道三个中间件，剩下的细节都可以封装起来！我们通过扩展 createStore 来实现.

先来看看期望的用法
```js
/*接收旧的 createStore，返回新的 createStore*/
const newCreateStore = applyMiddleware(exceptionMiddleware, timeMiddleware, loggerMiddleware)(createStore);

/*返回了一个 dispatch 被重写过的 store*/
const store = newCreateStore(reducer);
```

实现 `applyMiddleware`
```js
// compose 是函数式编程的精华了
function compose(...funcs) {
  if (funcs.length === 1) {
    return funcs[0]
  }
  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}

function applyMiddleware(...middlewares) {
  return function rewriteCreateStoreFunc(oldCreateStore) {
    return function newCreateStore(reducer, initState) {
      // 生成store
      const store = oldCreateStore(reducer, initState);

      /*给每个 middleware 传下store，相当于 const logger = loggerMiddleware(store);*/
      /* const chain = [exception, time, logger]*/
      const chain = middlewares.map((middleware) => middleware({ 
        getState: store.getState // 最小开发原则,所以不直接传 store
      }));

      /* 实现 exception(time((logger(dispatch))))*/
      store.dispatch = compose(...chain)(store.dispatch);

      return store;
    };
  };
}
```

### 优化用户体验

现在还有个小问题，我们有两种 createStore 了

```js
/*没有中间件的 createStore*/
import { createStore } from './redux';
const store = createStore(reducer, initState);

/*有中间件的 createStore*/
const rewriteCreateStoreFunc = applyMiddleware(exceptionMiddleware, timeMiddleware, loggerMiddleware);
const newCreateStore = rewriteCreateStoreFunc(createStore);
const store = newCreateStore(reducer, initState);
```

为了让用户用起来统一一些，我们可以很简单的使他们的使用方式一致，我们修改下 createStore 方法

```js
const createStore = (reducer, initState, rewriteCreateStoreFunc) => {
    /*如果有 rewriteCreateStoreFunc，那就采用新的 createStore */
    if(rewriteCreateStoreFunc){
       const newCreateStore =  rewriteCreateStoreFunc(createStore);
       return newCreateStore(reducer, initState);
    }
    /*否则按照正常的流程走*/
    ...
}
```

最终的用法

```js
const rewriteCreateStoreFunc = applyMiddleware(exceptionMiddleware, timeMiddleware, loggerMiddleware);

const store = createStore(reducer, initState, rewriteCreateStoreFunc);
```

上面我们实现了redux的大部分功能了.

## 小功能补充

### replaceReducer
reducer 拆分后，和组件是一一对应的。我们就希望在做按需加载的时候，reducer也可以跟着组件在必要的时候再加载，然后用新的 reducer 替换老的 reducer。

```js
const createStore = function (reducer, initState) {
  ...
  function replaceReducer(nextReducer) {
    reducer = nextReducer
    /*刷新一遍 state 的值，新来的 reducer 把自己的默认状态放到 state 树上去*/
    dispatch({ type: Symbol() })
  }
  ...
  return {
    ...
    replaceReducer
  }
}
```
### bindActionCreators

bindActionCreators 我们很少很少用到，一般只有在 react-redux 的 connect 实现中用到。

他是做什么的？他通过闭包，把 dispatch 和 actionCreator 隐藏起来，让其他地方感知不到 redux 的存在。

我们通过普通的方式来 隐藏 dispatch 和 actionCreator 试试，注意最后两行代码

```js
const reducer = combineReducers({
  counter: counterReducer,
  info: infoReducer
});
const store = createStore(reducer);

/*返回 action 的函数就叫 actionCreator*/
function increment() {
  return {
    type: 'INCREMENT'
  }
}

function setName(name) {
  return {
    type: 'SET_NAME',
    name: name
  }
}

const actions = {
  increment: function () {
    return store.dispatch(increment.apply(this, arguments))
  },
  setName: function () {
    return store.dispatch(setName.apply(this, arguments))
  }
}
/*注意：我们可以把 actions 传到任何地方去*/
/*其他地方在实现自增的时候，根本不知道 dispatch，actionCreator等细节*/
actions.increment(); /*自增*/
actions.setName('重命名!!!'); /*修改 info.name*/
```

这个 actions 生成的时候，好多公共代码，提取一下
```js
const actions = bindActionCreators({ increment, setName }, store.dispatch)
```

`bindActionCreators` 实现也很简单,直接上代码

```js
export default function bindActionCreator(actionCreator, dispatch) {
  if (typeof actionCreator === "function") {
    return () => dispatch(actionCreator.apply(this, arguments));
  }

  if (typeof actionCreator !== "object" || actionCreator === null) {
    throw new Error();
  }

  const boundActionCreators = {};
  for (const [key, actionCreator] of actionCreator) {
    boundActionCreators[key] = () =>
      dispatch(actionCreator.apply(this, arguments));
  }

  return boundActionCreators;
}
```

## 最后附上源码
完整代码见[https://github.com/chaoming56/redux].