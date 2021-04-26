import { call, put, takeEvery } from "./lib/redux-saga/effect";


const sleep = (time) => new Promise(r => setTimeout(r, time))

export default function* sagaRoot() {
  yield takeEvery("ADD", function* () {
    yield call(sleep, 1000)
    yield put({type: 'SET_NAME', name: 'saga put action: ADD'})
    yield put({type: 'ADD', num: 10})
  });


   yield takeEvery("MINUS", function* () {
    yield put({type: 'SET_NAME', name: 'saga put action: MINUS'})
  });
}
