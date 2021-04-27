const initState = {
  name: "手写redux",
};

export default function InfoReducer(state = initState, action) {
  switch (action.type) {
    case "SET_NAME":
      return {
        ...state,
        name: action.name,
      };
    default:
      return state;
  }
}
