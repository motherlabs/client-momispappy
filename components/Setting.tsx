import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import ReactSwitch from "react-switch";
import productAPI from "../api/productAPI";
import useMustNumber from "../hooks/useMustNumber";
import loadingSlice from "../slices/loadingSlice";
import productSlice from "../slices/productSlice";
import { RootState } from "../store/reducer";

export default function Setting() {
  const rewordRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  const productSetting = useSelector((state: RootState) => state.product.setting);
  const [reword, setReword, changeRewordHandler] = useMustNumber(productSetting.point.toString(), { limit: 10, length: 2 });
  const [isRequest, setIsReqeust] = useState(false);
  const [isModified, setIsModified] = useState(false);

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
                if (!reword) {
                  alert("리워드를 입력해주세요.");
                } else {
                  setIsModified(false);
                  updatePointAPIHandler();
                }
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
  );
}
