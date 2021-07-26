import thunk from "redux-thunk";
import { getRootInitialState, rootReducer } from "../reducer";

import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: rootReducer,
  preloadedState: getRootInitialState(),
  // TODO Immutability Middleware
  // TODO Serializability Middleware
  middleware: [thunk],
});

export type RootState = ReturnType<typeof store.getState>;
