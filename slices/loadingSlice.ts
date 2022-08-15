import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface LoadingState {
  isLoading: boolean;
}

export const loadingInitialState: LoadingState = {
  isLoading: false,
};
const loadingSlice = createSlice({
  name: "loading",
  initialState: loadingInitialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
  },
});

export default loadingSlice;
