export default function combineReducers(reducers) {
  return function combination(state = {}, action) {
    const nextState = {};

    for (let [key, reducer] of Object.entries(reducers)) {
      const prevState = state[key];
      nextState[key] = reducer(prevState, action);
    }

    return nextState;
  };
}
