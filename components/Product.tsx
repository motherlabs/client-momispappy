import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import productAPI from "../api/productAPI";
import loadingSlice from "../slices/loadingSlice";
import productSlice from "../slices/productSlice";
import { RootState } from "../store/reducer";
import priceUtil from "../utils/priceUtil";

export default function Product() {
  const router = useRouter();
  const dispatch = useDispatch();
  const products = useSelector((state: RootState) => state.product.products);
  const setting = useSelector((state: RootState) => state.product.setting);
  const [isRequest, setIsRequest] = useState(false);

  useEffect(() => {
    console.log("products api");
    const getProductListAPIHandler = async () => {
      const products = await productAPI.findAllProduct();
      dispatch(productSlice.actions.setProducts(products));
    };
    getProductListAPIHandler();
  }, [dispatch]);

  useEffect(() => {
    if (isRequest) {
      const getProductListAPIHandler = async () => {
        const products = await productAPI.findAllProduct();
        dispatch(productSlice.actions.setProducts(products));
        setIsRequest(false);
      };
      getProductListAPIHandler();
    }
  }, [isRequest, dispatch]);

  const deleteProductAPIHandler = useCallback(
    async (id: number) => {
      dispatch(loadingSlice.actions.setLoading(true));
      await productAPI.deleteProduct(id.toString());
      dispatch(loadingSlice.actions.setLoading(false));
      setIsRequest(true);
    },
    [dispatch]
  );

  return (
    <div className="flex flex-wrap justify-start">
      {products.map((v) => (
        <div key={v.id} className=" flex items-center justify-center w-[176px] p-4  relative">
          <i
            onClick={() => {
              if (confirm("정말 삭제하시겠습니까?")) {
                deleteProductAPIHandler(v.id);
              } else {
              }
            }}
            className="fa-solid fa-trash absolute top-0 right-0 z-10 bg-gray-200 opacity-50 px-4 py-4 rounded-full"
          ></i>
          <div
            onClick={() => {
              router.push(`/view/product/${v.id}`);
            }}
            className=" cursor-pointer w-[160px]"
          >
            <img src={v.ProductImage.length > 0 ? v.ProductImage[0].location : ""} alt={v.name} className="w-[160px] h-[200px] text-center rounded-sm bg-gray-200" />
            <div className=" px-1 h-[130px]">
              <div className="flex flex-col font-medium h-[70px]  ">
                <span>{v.brand.name}</span>
                <span className="text-gray-400">{v.name}</span>
              </div>
              {!setting.isPrice && v.discount > 0 && (
                <div className="relative flex justify-start ">
                  <span className={`${v.discount > 0 ? "line-through" : ""}`}>{priceUtil.converterPrice(v.price.toString())}원</span>
                </div>
              )}
              <div className="text-xl font-bold flex justify-between">
                {v.discount > 0 && <span className=" text-orange-600">{v.discount}%</span>}
                <span>{priceUtil.converterPrice(v.discount > 0 ? priceUtil.calculationDiscount(v.price, v.discount).toString() : v.price.toString())}원</span>
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

      <div
        onClick={() => {
          router.push("/view/product/add");
        }}
        className="bg-black w-[50px] h-[50px] flex bottom-[16px] cursor-pointer right-[16px] items-center justify-center fixed rounded-full"
      >
        <i className="fa-solid fa-plus text-white text-4xl"></i>
      </div>
    </div>
  );
}
