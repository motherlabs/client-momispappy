import { AnyAction, CombinedState, combineReducers, Reducer } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import loadingSlice, { LoadingState } from "../slices/loadingSlice";
import productSlice, { ProductState } from "../slices/productSlice";
import userSlice, { UserState } from "../slices/userSlice";

export interface RootStates {
  user: UserState;
  loading: LoadingState;
  product: ProductState;
}

export const rootReducer: Reducer<RootStates, AnyAction> = (state, action): CombinedState<RootStates> => {
  switch (action.type) {
    case HYDRATE:
      return action.payload;
    default: {
      const combineReducer = combineReducers({
        user: userSlice.reducer,
        loading: loadingSlice.reducer,
        product: productSlice.reducer,
      });
      return combineReducer(state, action);
    }
  }
};

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
