// store -> root reducer(state) -> user slice
// action: state를 바꾸는 행위/동작
// dispatch: 그 액션을 실제로 실행하는 함수
// reducer: 액션이 실제로 실행되면 state를 바꾸는 로직

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { IUser } from "../types/userType";

export type UserState = {
  me: IUser;
  isLoggedIn: boolean;
};

export const userInitialState: UserState = {
  me: {
    id: 0,
    name: "",
    role: "USER",
  },
  isLoggedIn: true,
};
const userSlice = createSlice({
  name: "user",
  initialState: userInitialState,
  reducers: {
    setUser(state, action: PayloadAction<IUser>) {
      state.me = action.payload;
    },
    setisLoggedIn(state, action: PayloadAction<boolean>) {
      state.isLoggedIn = action.payload;
    },
  },
});

export default userSlice;
