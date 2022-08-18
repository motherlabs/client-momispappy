import { setCookie } from "cookies-next";
import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import authAPI from "../api/authAPI";
import productAPI from "../api/productAPI";
import loadingSlice from "../slices/loadingSlice";
import productSlice from "../slices/productSlice";
import userSlice from "../slices/userSlice";
import BackDrop from "./BackDrop";

export default function Login() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const full = false;

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
    <div className={` fixed inset-0 z-50 `}>
      <BackDrop backDropClassName={"opacity-100"} onCloseModal={() => {}} />
      <div className="fixed z-50 inset-0 w-full top-[14%]">
        <div className="w-full text-white text-6xl text-center">MotherLabs</div>
      </div>
      <div className={` fixed z-50  ${full ? "bottom-0" : "top-2/4 -translate-y-2/4"} w-full flex justify-center z-50 `}>
        <div className={` max-w-[500px] w-full ${full ? "px-0" : "px-4"}`}>
          <div className={` w-full bg-white pb-[2px]  ${full ? "rounded-t-lg" : "rounded-lg"}`}>
            {/* {isExit && <div className={`flex w-full items-center justify-start ${exitStyle} `}><i className="fa-solid fa-xmark text-2xl" onClick={onCloseModal}></i></div>} */}
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
          </div>
        </div>
      </div>
    </div>
  );
}
