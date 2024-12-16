export {};

// import { PayloadAction } from '@reduxjs/toolkit';
// import { AxiosResponse } from 'axios';
// import { call, put, takeLatest } from 'redux-saga/effects';
// import {
//   getMapPopupDataFailure,
//   getMapPopupDataRequest,
//   getMapPopupDataSuccess,
// } from '@Store/actions/visualization';
// import { getMapPopupData } from '@Services/visualization';
// import { withLoader } from '@Utils/sagaUtils';

// function* getMapPopupDataSaga({
//   payload,
// }: PayloadAction<{ id: number; type: string }>) {
//   try {
//     const response: AxiosResponse = yield call(getMapPopupData, payload);
//     yield put(getMapPopupDataSuccess(response.data));
//   } catch (error) {
//     yield put(getMapPopupDataFailure());
//   }
// }

// function* visualizationWatcher() {
//   yield takeLatest(
//     getMapPopupDataRequest.type,
//     withLoader(getMapPopupDataSaga),
//   );
// }

// export default visualizationWatcher;
