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
