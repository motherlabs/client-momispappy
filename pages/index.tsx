import { deleteCookie } from "cookies-next";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import ReactSwitch from "react-switch";
import authAPI from "../api/authAPI";
import customAxios from "../api/axios";
import productAPI from "../api/productAPI";
import useMustNumber from "../hooks/useMustNumber";
import loadingSlice from "../slices/loadingSlice";
import productSlice from "../slices/productSlice";
import userSlice, { userInitialState } from "../slices/userSlice";
import { RootState } from "../store/reducer";
import priceUtil from "../utils/priceUtil";

const Home: NextPage = () => {
  const router = useRouter();
  const [view, setView] = useState<"product" | "order">("product");
  const [isModified, setIsModified] = useState(false);
  const rewordRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  const productSetting = useSelector((state: RootState) => state.product.setting);
  const [reword, setReword, changeRewordHandler] = useMustNumber(productSetting.point.toString(), { limit: 10, length: 2 });
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  const [isRequest, setIsReqeust] = useState(false);

  useEffect(() => {
    if (productSetting.id === 1) {
      setReword(productSetting.point.toString());
    }

    if (productSetting.id === 1 && isRequest) {
      console.log("request call");
      const updateProductSettingAPIHandler = async () => {
        try {
          await productAPI.updateSetting(productSetting);
          setIsReqeust(false);
          dispatch(loadingSlice.actions.setLoading(false));
        } catch (e) {
          setIsReqeust(false);
          dispatch(loadingSlice.actions.setLoading(false));
        }
      };
      updateProductSettingAPIHandler();
    }
  }, [productSetting, isRequest, dispatch]);

  const logOutAPIHandler = useCallback(async () => {
    await authAPI.signOut();
    dispatch(userSlice.actions.setUser(userInitialState.me));
    dispatch(userSlice.actions.setisLoggedIn(false));
    deleteCookie("AT_MOMISPAPPY");
    deleteCookie("RT_MOMISPAPPY");
  }, [dispatch]);

  const updateIsPriceAPIHandler = useCallback(
    async (data: boolean) => {
      dispatch(loadingSlice.actions.setLoading(true));
      dispatch(productSlice.actions.setIsPrice(data));
      setIsReqeust(true);
    },
    [dispatch]
  );
  const updateIsPointAPIHandler = useCallback(
    async (data: boolean) => {
      dispatch(loadingSlice.actions.setLoading(true));
      dispatch(productSlice.actions.setIsPoint(data));
      setIsReqeust(true);
    },
    [dispatch]
  );

  const updatePointAPIHandler = useCallback(async () => {
    dispatch(loadingSlice.actions.setLoading(true));
    dispatch(productSlice.actions.setPoint(+reword));
    setIsReqeust(true);
  }, [dispatch, reword]);

  return (
    <div className="">
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
      <div className="pt-[64px]">
        {view === "product" && (
          <div className="">
            <div className="px-4">
              <span className="font-bold text-lg">카테고리</span>
            </div>
            <div className="py-5 flex space-x-4 justify-end pr-4">
              <div className="flex flex-col items-center">
                <span className={`${productSetting.isPrice ? "" : "text-gray-400"} font-bold`}>가격 설정</span>
                <ReactSwitch
                  onChange={(e) => {
                    console.log(e);
                    updateIsPriceAPIHandler(e);
                  }}
                  checked={productSetting.isPrice}
                />
              </div>
              <div className="flex flex-col items-center">
                <span className={`${productSetting.isPoint ? "" : "text-gray-400"} font-bold`}>리워드 설정</span>
                <ReactSwitch
                  onChange={(e) => {
                    updateIsPointAPIHandler(e);
                  }}
                  checked={productSetting.isPoint}
                />
              </div>
              {productSetting.isPoint && (
                <div className="flex flex-col items-center">
                  <div className="flex space-x-1">
                    <span className="font-bold">리워드</span>
                    <input ref={rewordRef} disabled={!isModified} className="w-[22px] text-end" type="text" value={reword} onChange={changeRewordHandler} />
                    <span className="font-bold text-orange-700">%</span>
                  </div>
                  {!isModified ? (
                    <button
                      onClick={() => {
                        setIsModified(() => true);
                        setReword("");
                        if (isModified) {
                          console.log("check");
                          rewordRef.current?.focus();
                        }
                      }}
                      className="bg-gray-300 h-[30px] w-[60px] rounded-lg"
                    >
                      수정
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setIsModified(false);
                        updatePointAPIHandler();
                      }}
                      disabled={reword ? false : true}
                      className={`${reword ? "text-white bg-black" : "bg-gray-300"} h-[30px] w-[60px] rounded-lg`}
                    >
                      저장
                    </button>
                  )}
                </div>
              )}
            </div>
            <div className="flex flex-wrap">
              {Array.from({ length: 40 }).map((_, index) => (
                <div key={index} className=" flex items-center justify-center w-6/12  md:w-3/12 lg:w-2/12 p-4">
                  <div
                    onClick={() => {
                      router.push("product/123");
                    }}
                    className=" cursor-pointer"
                  >
                    <div className="w-[160px] h-[200px] text-center rounded-sm bg-gray-200">이미지</div>
                    <div className=" w-[160px] px-1">
                      <div className="flex flex-col font-medium">
                        <span>뉴발란스키즈</span>
                        <span className="text-gray-400">샌들 라이트그린</span>
                      </div>
                      <div className="relative flex justify-start">
                        <span className=" line-through">{priceUtil.converterPrice("60000")}원</span>
                        {/* <span className="w-full h-[1px] bg-black absolute top-[50%]"></span> */}
                      </div>
                      <div className="text-xl font-bold space-x-3">
                        <span className=" text-orange-600">13%</span>
                        <span>{priceUtil.converterPrice("44550")}원</span>
                      </div>
                      <div className="space-x-1 text-gray-500 font-medium text-sm">
                        <i className="fa-solid fa-star text-gray-300"></i>
                        <span>4.5</span>
                        <span>(14)</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="bg-black w-[50px] h-[50px] flex bottom-[16px] cursor-pointer right-[16px] items-center justify-center fixed rounded-full">
                <i className="fa-solid fa-plus text-white text-4xl"></i>
              </div>
            </div>
          </div>
        )}
        {view === "order" && (
          <div className="">
            {Array.from({ length: 40 }).map((_, index) => (
              <div key={index}>order</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
