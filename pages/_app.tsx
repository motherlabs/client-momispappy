import "../styles/globals.css";
import type { AppProps } from "next/app";
import React, { useEffect } from "react";
import wrapper from "../store";
import userSlice from "../slices/userSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "../store/reducer";
import authAPI from "../api/authAPI";
import Loading from "../public/loading.svg";
import productAPI from "../api/productAPI";
import productSlice from "../slices/productSlice";
import Login from "../components/Login";

function MyApp({ Component, pageProps }: AppProps) {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  const isLoading = useSelector((state: RootState) => state.loading.isLoading);

  useEffect(() => {
    const authApiHandler = async () => {
      try {
        const authResponse = await authAPI.getAuth();
        const getSettingResponse = await productAPI.findSetting();
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

  return (
    <div>
      {!isLoggedIn && <Login />}
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
