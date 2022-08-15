import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import { useDispatch } from "react-redux";
import userSlice from "../slices/userSlice";
import rootReducer from "./reducer";
import logger from "redux-logger";

const isDev = process.env.NODE_ENV === "development";

const store = () =>
  configureStore({
    reducer: rootReducer,
    // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
    devTools: isDev,
  });

export type AppStore = ReturnType<typeof store>;
export type AppState = ReturnType<AppStore["getState"]>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action>;
const wrapper = createWrapper<AppStore>(store);
export default wrapper;
