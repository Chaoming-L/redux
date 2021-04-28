import { call, put, takeEvery } from "./lib/redux-saga/effect";
import { getAnimal } from './getAnimal'

const sleep = (time) => new Promise((r) => setTimeout(() => {
  r(getAnimal());
}, time));


export default function* sagaRoot() {
  yield takeEvery("FETCH", function* () {
    yield put({type: 'SET_LOADING', loading: true})

    const animal = yield call(sleep, 1000);

    yield put({type: 'SET_LOADING', loading: false})
    yield put({ type: "SET_NAME", name: animal});
  });
}
