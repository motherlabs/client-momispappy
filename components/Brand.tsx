import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import productAPI from "../api/productAPI";
import loadingSlice from "../slices/loadingSlice";
import productSlice from "../slices/productSlice";
import { RootState } from "../store/reducer";
import { IBrand } from "../types/productType";
import Modal from "./Modal";

export default function Brand() {
  const [selectedBrandCount, setSelectedBrandCount] = useState(0);
  const [isCreateModal, setIsCreateModal] = useState(false);
  const [isModifiedModal, setIsModifiedModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<File | undefined>();
  const [previewImageURL, setPreviewImageURL] = useState("");
  const [previewName, setPreviewName] = useState("");
  const dispatch = useDispatch();
  const brands = useSelector((state: RootState) => state.product.brands);
  const [isRequest, setIsRequest] = useState(false);

  useEffect(() => {
    console.log("brand check");
    const getBrandAPIHandler = async () => {
      const brands = await productAPI.findAllBrand();
      dispatch(productSlice.actions.setBrands(brands));
    };
    getBrandAPIHandler();
  }, [dispatch]);

  useEffect(() => {
    const getBrandAPIHandler = async () => {
      const brands = await productAPI.findAllBrand();
      dispatch(productSlice.actions.setBrands(brands));
    };
    if (isRequest) {
      getBrandAPIHandler();
      setIsRequest(false);
    }
  }, [dispatch, isRequest]);

  const changePreviewImageHandler = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPreviewImage(e.target.files[0]);
      setPreviewImageURL(URL.createObjectURL(e.target.files[0]));
      e.target.value = "";
    }
  }, []);

  const createBrandAPIHandler = useCallback(async () => {
    const formData = new FormData();
    if (previewName && previewImage) {
      dispatch(loadingSlice.actions.setLoading(true));
      formData.append("name", previewName);
      formData.append("image", previewImage);
      const brand: IBrand = await productAPI.createBrand(formData);
      if (brand) {
        setPreviewImage(undefined);
        setPreviewImageURL("");
        setPreviewName("");
        setIsCreateModal(false);
        dispatch(productSlice.actions.setBrands([...brands, brand]));
      }
      dispatch(loadingSlice.actions.setLoading(false));
    }
  }, [dispatch, previewImage, previewName, brands]);

  const updateBrandAPIHandler = useCallback(async () => {
    const formData = new FormData();
    const id = brands[selectedBrandCount - 1].id;
    if (!id) {
      alert("실패. 클라이언트 오류");
      dispatch(loadingSlice.actions.setLoading(false));
      return;
    }
    dispatch(loadingSlice.actions.setLoading(true));
    if (previewImage) {
      formData.append("image", previewImage);
    }
    formData.append("id", id.toString());
    formData.append("name", previewName);
    const brand: IBrand = await productAPI.updateBrand(formData);
    if (brand) {
      setPreviewImage(undefined);
      setPreviewImageURL("");
      setPreviewName("");
      setIsModifiedModal(false);
      setSelectedBrandCount(0);

      // const filteredBrands = brands.filter((v) => v.id !== brand.id);
      // dispatch(productSlice.actions.setBrands([...filteredBrands, brand]));
    }
    dispatch(loadingSlice.actions.setLoading(false));
    setIsRequest(true);
  }, [brands, dispatch, previewImage, previewName, selectedBrandCount]);

  return (
    <div className="px-4">
      {isCreateModal && (
        <Modal
          backDropClassName="opacity-60"
          backDropEvent={() => {
            setSelectedBrandCount(0);
            setIsCreateModal(false);
            setPreviewImage(undefined);
            setPreviewImageURL("");
            setPreviewName("");
          }}
        >
          <div className="fadein ">
            <div className="flex flex-col items-center">
              {previewImage ? (
                <div className="w-[60px] h-[60px] bg-white rounded-lg  mb-3 relative">
                  <i
                    onClick={() => {
                      setPreviewImage(undefined);
                      setPreviewImageURL("");
                    }}
                    className=" cursor-pointer fa-solid fa-trash text-lg absolute top-1/2 -translate-y-2/4 -right-[60px] bg-white px-3 py-1 rounded-full"
                  ></i>
                  <img width={60} height={60} className={``} src={previewImageURL ? previewImageURL : ""} alt="" />
                </div>
              ) : (
                <div
                  onClick={() => {
                    fileInputRef.current?.click();
                  }}
                  className="bg-gray-300  rounded-lg cursor-pointer w-[60px] h-[60px] mb-3 flex items-center justify-center"
                >
                  <i className="fa-solid fa-camera text-2xl"></i>
                </div>
              )}

              <input
                type="text"
                value={previewName}
                onChange={(e) => {
                  setPreviewName(e.target.value.trim());
                }}
                className="rounded-lg h-[38px] text-center mb-3"
              />
              <input className="hidden" ref={fileInputRef} onChange={changePreviewImageHandler} accept="image/*" type="file" />
              {previewName && previewImage && (
                <button onClick={createBrandAPIHandler} className="h-[40px] bg-black fadein w-[70px] rounded-lg font-bold text-white">
                  등록
                </button>
              )}
            </div>
          </div>
        </Modal>
      )}
      {isModifiedModal && (
        <Modal
          backDropClassName="opacity-60"
          backDropEvent={() => {
            setIsModifiedModal(false);
            setPreviewImage(undefined);
            setPreviewImageURL("");
            setPreviewName("");
            setSelectedBrandCount(0);
          }}
        >
          <div className="fadein ">
            <div className="flex flex-col items-center">
              {previewImage ? (
                <div className="w-[60px] h-[60px] bg-white rounded-lg  mb-3 relative">
                  <i
                    onClick={() => {
                      setPreviewImage(undefined);
                      setPreviewImageURL("");
                    }}
                    className=" cursor-pointer fa-solid fa-trash text-lg absolute top-1/2 -translate-y-2/4 -right-[60px] bg-white px-3 py-1 rounded-full"
                  ></i>
                  <img width={60} height={60} className={``} src={previewImageURL ? previewImageURL : ""} alt="" />
                </div>
              ) : (
                <div
                  onClick={() => {
                    fileInputRef.current?.click();
                  }}
                  className="bg-gray-300 relative rounded-lg cursor-pointer w-[60px] h-[60px] mb-3 flex items-center justify-center"
                >
                  <img src={brands ? brands[selectedBrandCount - 1].imageLocation : ""} width={60} height={60} alt={""} className={`rounded-lg`}></img>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <i className="fa-solid fa-camera text-lg"></i>
                  </div>
                </div>
              )}

              <input
                type="text"
                value={previewName}
                onChange={(e) => {
                  setPreviewName(e.target.value.trim());
                }}
                className="rounded-lg h-[38px] text-center mb-3"
              />
              <input className="hidden" ref={fileInputRef} onChange={changePreviewImageHandler} accept="image/*" type="file" />
              {previewName && (
                <button onClick={updateBrandAPIHandler} className="h-[40px] bg-black w-[70px] fadein rounded-lg font-bold text-white">
                  수정
                </button>
              )}
            </div>
          </div>
        </Modal>
      )}
      <span className="font-bold text-xl">브랜드</span>
      <div className="flex">
        <div className="scrollx flex w-full   items-center  overflow-hidden">
          {brands.map((item, index) => (
            <div key={item.id} className="flex flex-col  min-w-[70px]">
              <div
                onClick={() => {
                  if (selectedBrandCount === item.id) {
                    setSelectedBrandCount(0);
                  } else {
                    setSelectedBrandCount(item.id);
                  }
                }}
                className="flex flex-col items-center w-[60px] cursor-pointer"
              >
                <div className={`my-1 ${selectedBrandCount === item.id ? "bg-black" : "bg-gray-300"}  rounded-lg w-full py-0.5 flex flex-col items-center`}>
                  <i className={`fa-solid ${selectedBrandCount === item.id ? "text-white" : "text-gray-400"} fa-check`}></i>
                </div>
                <img width={60} height={60} alt={""} src={item.imageLocation ? item.imageLocation : ""} />
                <span className="ellipsis">{item.name}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex-1 flex flex-col w-full">
          <div className=" w-full h-1/2  mb-1 flex items-center justify-center">
            <button
              onClick={() => {
                setIsCreateModal(true);
              }}
              className={`bg-black text-white py-3 px-6 rounded-lg font-bold cursor-pointer`}
            >
              추가
            </button>
          </div>
          <div className=" w-full h-1/2 flex items-center justify-center">
            <button
              onClick={() => {
                setIsModifiedModal(true);
                brands.map((v) => {
                  if (v.id === selectedBrandCount) {
                    setPreviewName(v.name);
                  }
                });
              }}
              disabled={selectedBrandCount ? false : true}
              className={`${selectedBrandCount > 0 ? "text-white bg-black" : "bg-gray-300 text-gray-400"}   py-3 px-6 rounded-lg font-bold cursor-pointer`}
            >
              수정
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
