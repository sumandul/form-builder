import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";

import loader from "./slices/loader";
import common from "./slices/common";
import rootSaga from "./sagas";

// Create the Saga middleware
const sagaMiddleware = createSagaMiddleware();
const middleware = [sagaMiddleware];

// Configure the store
const store = configureStore({
  reducer: {
    loader,
    common,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false, serializableCheck: false }).concat(
      middleware
    ),
  // Explicitly enable Redux DevTools (optional since RTK does it automatically)
  devTools: "development",
});

// Run root Saga
sagaMiddleware.run(rootSaga);

// Export types for store dispatch and state
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export default store;
