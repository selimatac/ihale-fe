import { combineReducers, configureStore } from "@reduxjs/toolkit";
import firma from "./firmaReducer";

const rootReducer = combineReducers({
  firma,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
