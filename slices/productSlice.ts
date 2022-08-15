// store -> root reducer(state) -> Produc slice
// action: state를 바꾸는 행위/동작
// dispatch: 그 액션을 실제로 실행하는 함수
// reducer: 액션이 실제로 실행되면 state를 바꾸는 로직

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { ISetting } from "../types/productType";

export type ProductState = {
  setting: ISetting;
};

export const productInitialState: ProductState = {
  setting: {
    id: 0,
    isPrice: false,
    isPoint: false,
    point: 0,
  },
};
const productSlice = createSlice({
  name: "product",
  initialState: productInitialState,
  reducers: {
    setSetting(state, action: PayloadAction<ISetting>) {
      state.setting = action.payload;
    },
    setIsPoint(state, action: PayloadAction<boolean>) {
      state.setting.isPoint = action.payload;
    },
    setIsPrice(state, action: PayloadAction<boolean>) {
      state.setting.isPrice = action.payload;
    },
    setPoint(state, action: PayloadAction<number>) {
      state.setting.point = action.payload;
    },
  },
});

export default productSlice;
