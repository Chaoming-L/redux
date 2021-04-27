import { call, put, takeEvery, take } from "./lib/redux-saga/effect";

const sleep = (time) => new Promise((r) => setTimeout(r, time));

export default function* sagaRoot() {
  yield takeEvery("ADD", function* () {
    yield put({ type: "SET_NAME", name: "saga: 2秒后+100" });
    yield call(sleep, 2000);
    yield put({ type: "ADD", num: 100 });
  });

  
  let n = 5
  while(n >= 0) {
    yield take('MINUS')
    yield put({ type: "ADD", num: 1 });
    n--
  } 
}
