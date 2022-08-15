import "../styles/globals.css";
import type { AppProps } from "next/app";
import React, { useCallback, useEffect, useState } from "react";
import Modal from "../components/Modal";
import { setCookie } from "cookies-next";
import wrapper from "../store";
import userSlice from "../slices/userSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "../store/reducer";
import authAPI from "../api/authAPI";
import Loading from "../public/loading.svg";
import Image from "next/image";
import loadingSlice from "../slices/loadingSlice";
import productAPI from "../api/productAPI";
import productSlice from "../slices/productSlice";
import customAxios from "../api/axios";
import axios from "axios";

function MyApp({ Component, pageProps }: AppProps) {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  const isLoading = useSelector((state: RootState) => state.loading.isLoading);

  useEffect(() => {
    const authApiHandler = async () => {
      try {
        console.log("check");
        const authResponse = await authAPI.getAuth();
        console.log(authResponse);
        const getSettingResponse = await productAPI.findSetting();
        console.log(authResponse.user.role);
        dispatch(productSlice.actions.setSetting(getSettingResponse));
        dispatch(userSlice.actions.setUser(authResponse.user));
        if (authResponse.user.role === "ADMIN") {
          dispatch(userSlice.actions.setisLoggedIn(true));
        } else {
          dispatch(userSlice.actions.setisLoggedIn(false));
        }
      } catch (e) {
        console.log(e);
        dispatch(userSlice.actions.setisLoggedIn(false));
      }
    };
    authApiHandler();
  }, [dispatch]);

  const certificationAdminHandler = useCallback(async () => {
    if (!id && !password) {
      alert("전부 입력해주세요.");
    }
    try {
      dispatch(loadingSlice.actions.setLoading(true));
      const response = await authAPI.signIn({ name: id, uniqueCode: password });
      console.log(response);
      setCookie("AT_MOMISPAPPY", response.accessToken);
      setCookie("RT_MOMISPAPPY", response.refreshToken);
      const getSettingResponse = await productAPI.findSetting();
      console.log(getSettingResponse);
      dispatch(productSlice.actions.setSetting(getSettingResponse));
      dispatch(userSlice.actions.setUser(response.user));
      if (response.user.role === "ADMIN") {
        dispatch(userSlice.actions.setisLoggedIn(true));
      } else {
        dispatch(userSlice.actions.setisLoggedIn(false));
      }
      dispatch(loadingSlice.actions.setLoading(false));
    } catch (e) {
      dispatch(loadingSlice.actions.setLoading(false));
    }
  }, [id, password, dispatch]);

  return (
    <div>
      {!isLoggedIn && (
        <Modal isExit={true} maxWidth={"max-w-[500px]"} className="" backDropClassName="opacity-100">
          <div className="py-4 px-4">
            <div className="flex border-b w-full text-lg py-2 space-x-4">
              <span className="w-[90px]">id</span>
              <input
                onChange={(e) => {
                  setId(e.target.value);
                }}
                type="text"
              />
            </div>
            <div className="flex border-b w-full space-x-4 text-lg mb-3 py-2">
              <span className="w-[90px]">password</span>
              <input
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    certificationAdminHandler();
                  }
                }}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                type="password"
              />
            </div>
            <div className="flex justify-center">
              <button onClick={certificationAdminHandler} className={`${id && password ? "bg-black text-white" : "bg-gray-300"} h-[36px] w-[80px] rounded-lg`}>
                확인
              </button>
            </div>
          </div>
        </Modal>
      )}
      {isLoading && (
        <div className="fixed flex items-center justify-center inset-0 z-50 w-full h-full">
          <Loading width={70} height={70} />
        </div>
      )}
      <Component {...pageProps} />
    </div>
  );
}

export default wrapper.withRedux(MyApp);
