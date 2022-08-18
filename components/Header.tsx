import { deleteCookie } from "cookies-next";
import React, { Dispatch, SetStateAction, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import authAPI from "../api/authAPI";
import userSlice, { userInitialState } from "../slices/userSlice";
import { RootState } from "../store/reducer";

type Props = {
  setView: Dispatch<SetStateAction<"product" | "order">>;
  view: "product" | "order";
};

export default function Header({ setView, view }: Props) {
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  const dispatch = useDispatch();

  const logOutAPIHandler = useCallback(async () => {
    await authAPI.signOut();
    dispatch(userSlice.actions.setUser(userInitialState.me));
    dispatch(userSlice.actions.setisLoggedIn(false));
    deleteCookie("AT_MOMISPAPPY");
    deleteCookie("RT_MOMISPAPPY");
  }, [dispatch]);

  return (
    <div className={`flex items-center justify-between px-4 bg-white border-b border-black h-[64px] fixed w-full z-40`}>
      <div>
        <span className="text-xl font-bold">Motherlabs</span>
      </div>
      <div className="flex items-center w-full justify-between">
        <div className="text-gray-400 text-lg font-medium space-x-4 pl-4">
          <button
            onClick={() => {
              setView("product");
            }}
            className={`${view === "product" ? "text-black" : "text-gray-300"}`}
          >
            상품관리
          </button>
          <button
            onClick={() => {
              setView("order");
            }}
            className={`${view === "order" ? "text-black" : "text-gray-300"}`}
          >
            주문관리
          </button>
        </div>
        <div>{isLoggedIn ? <button onClick={logOutAPIHandler}>로그아웃</button> : <button>로그인</button>}</div>
      </div>
    </div>
  );
}
