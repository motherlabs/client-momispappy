import { useRouter } from "next/router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import ReactSwitch from "react-switch";
import productAPI from "../../../api/productAPI";
import Relation from "../../../components/Relation";
import useMustNumber from "../../../hooks/useMustNumber";
import loadingSlice from "../../../slices/loadingSlice";
import productSlice from "../../../slices/productSlice";
import { RootState } from "../../../store/reducer";
import { ICategory, IProduct, ProductImageType } from "../../../types/productType";
import priceUtil from "../../../utils/priceUtil";

export default function ProductDetail() {
  const router = useRouter();
  const dispatch = useDispatch();
  const categories = useSelector((state: RootState) => state.product.categories);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const [mainImages, setMainImages] = useState<{ id: number; location: string }[]>([]);
  const [descriptionImages, setDescriptionImages] = useState<{ id: number; location: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedRelations, setSelectedRelations] = useState<{ id: number; image: string }[]>([]);
  const [isRelation, setIsRelation] = useState(false);
  const [isShippingFee, setIsShippingFee] = useState(false);

  const [categoryId, setCategoryId] = useState(0);
  const [name, setName] = useState("");
  const [price, setPrice, changePriceHandler] = useMustNumber("0");
  const [disCount, setDisCount, changeDisCountHandler] = useMustNumber("0", { limit: 100, length: 3 });
  const [shippingFee, setShippingFee, changeShippingFee] = useMustNumber("0", { limit: 10000, length: 10 });
  const [isEvent, setIsEvent] = useState(false);
  const [deleteImages, setDeleteImages] = useState<{ id: number; location: string }[]>([]);
  const [oldRelations, setOldRelations] = useState<{ toProductId: number; fromProductId: number }[]>([]);
  const [recentRelations, setRecentRelations] = useState<{ toProductId: number; fromProductId: number }[]>([]);
  const [isRequset, setIsRequest] = useState(false);

  useEffect(() => {
    if (router.query.id) {
      console.log("check product edit");
      const getProductAPIHandler = async () => {
        const categories: ICategory[] = await productAPI.findAllCategory();
        dispatch(productSlice.actions.setCategories(categories));
        const product: IProduct = await productAPI.findOneProduct(`${router.query.id}`);
        if (product.id > 0) {
          const mainImagesData: { id: number; location: string }[] = [];
          const descriptionImagesData: { id: number; location: string }[] = [];
          const relationsData: { toProductId: number; fromProductId: number }[] = [];
          const selectedRelationsData: { id: number; image: string }[] = [];

          setName(product.name);
          setPrice(product.price.toString());
          setDisCount(product.discount.toString());
          setSelectedCategory(product.category.name);
          setCategoryId(product.category.id);

          product.ProductImage.map((v) => {
            if (v.type === ProductImageType.MAIN) {
              mainImagesData.push({ id: v.id, location: v.location });
            } else {
              descriptionImagesData.push({ id: v.id, location: v.location });
            }
          });
          setMainImages(mainImagesData);
          setDescriptionImages(descriptionImagesData);

          if (product.toProduct.length > 0) {
            product.toProduct.map((v) => {
              selectedRelationsData.push({ id: v.fromProduct.id, image: v.fromProduct.ProductImage[0].location });
              relationsData.push({ toProductId: v.toProductId, fromProductId: v.fromProductId });
            });
            setOldRelations(relationsData);
            setRecentRelations(relationsData);
            setSelectedRelations(selectedRelationsData);
          }

          if (product.shippingFee > 0) {
            setIsShippingFee(true);
            setShippingFee(product.shippingFee.toString());
          }

          if (product.isEvent) {
            setIsEvent(true);
          }
        }
      };
      getProductAPIHandler();
    }
  }, [router.query.id, dispatch]);

  const updateProductAPIHandler = useCallback(async () => {
    dispatch(loadingSlice.actions.setLoading(true));
    const response = await productAPI.updateProduct({
      id: parseInt(`${router.query.id}`),
      categoryId,
      name,
      price: parseInt(price),
      discount: parseInt(disCount),
      shippingFee: parseInt(shippingFee),
      isEvent,
      deleteImages,
      oldRelations,
      recentRelations,
    });
    dispatch(loadingSlice.actions.setLoading(false));
    setIsRequest(true);
    if (confirm("상품 수정이 완료됐습니다. 목록으로 이동하시겠습니까?")) {
      router.push("/view");
    }
  }, [dispatch, router, name, price, disCount, shippingFee, isEvent, deleteImages, oldRelations, recentRelations, categoryId]);

  const verifyUpdateHandler = useCallback(() => {
    if (name === "") {
      alert("상품 이름을 입력해주세요.");
      console.log(name);
      return;
    }
    if (price === "") {
      alert("가격을 입력해주세요.");
      console.log(price);
      return;
    }
    if (categoryId < 1) {
      alert("카테고리를 선택해주세요.");
      console.log(categoryId);
      return;
    }
    if (disCount === "") {
      alert("할인율을 입력해주세요. 적어도 0");
      console.log(disCount);
      return;
    }
    if (shippingFee === "") {
      alert("배달료를 입력해주세요. 적어도 0");
      console.log(shippingFee);
      return;
    }
    updateProductAPIHandler();
  }, [updateProductAPIHandler, name, price, categoryId, disCount, shippingFee]);

  return (
    <div className={` h-screen`}>
      {isRelation && (
        <Relation recentRelations={recentRelations} setRecentRelations={setRecentRelations} toProductId={router.query.id ? +router.query.id : 0} setIsRelation={setIsRelation} relation={selectedRelations} setRelation={setSelectedRelations} />
      )}
      <div className="px-4">
        <div
          onClick={() => {
            router.back();
          }}
          className="fixed top-0 w-[80px] z-20 h-[60px] flex items-center"
        >
          <i className={`fa-solid fa-arrow-left text-4xl`}></i>
        </div>

        <div className=" relative w-full pt-[100px]">
          <div className=" fixed top-[8px] z-20 right-[120px] w-[100px] bg-gray-300  ">
            <button disabled={isRequset} onClick={verifyUpdateHandler} className={`w-[100px] py-4 ${isRequset ? "bg-gray-200 text-gray-400" : "bg-black text-white"}   font-bold fadein`}>
              상품수정
            </button>
          </div>
          <div className=" fixed top-[8px] z-20 right-2 w-[100px] bg-gray-300  ">
            <button
              onClick={() => {
                descriptionRef.current?.scrollIntoView({ behavior: "smooth" });
              }}
              className="w-[100px] py-4 bg-black text-white font-bold fadein"
            >
              상세보기
            </button>
          </div>

          <div className="flex flex-col">
            <div className="flex justify-center space-x-10 mb-10">
              <div className="w-[400px]">
                <img src={mainImages.length > 0 ? mainImages[0].location : ""} className={`w-full`} alt="" />
              </div>
              <div className="w-[368px] space-y-4 hidden md:block">
                <div>
                  <span className="font-bold">상품 이름</span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value.trim());
                    }}
                    className="border-b border-black  w-full"
                  />
                </div>
                <div>
                  <span className="font-bold">가격</span>
                  <input type="text" value={priceUtil.converterPrice(price)} onChange={changePriceHandler} className="border-b border-black  w-full" />
                </div>
                <select
                  className=" w-full h-[48px] border-b border-black"
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    const categoryIndex = categories.findIndex((v) => v.name === e.target.value);
                    setCategoryId(categories[categoryIndex].id);
                  }}
                >
                  {categories.map((item) => (
                    <option key={item.id} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </select>
                <div className="flex space-x-4">
                  <div className="w-1/2">
                    <span className="font-bold">할인율</span>
                    <br />
                    <input type="text" value={priceUtil.converterPrice(disCount)} onChange={changeDisCountHandler} className="border-b border-black w-[30px] text-orange-600 font-bold" />
                    <span className="font-bold">%</span>
                  </div>
                  <div className="w-1/2">
                    <span className="font-bold">할인가격</span>
                    <br />
                    {+price === priceUtil.calculationDiscount(+price, +disCount) ? <span>없음</span> : <span>{priceUtil.converterPrice(priceUtil.calculationDiscount(+price, +disCount).toString())}</span>}
                  </div>
                </div>
                <div className="flex ">
                  <div className="flex w-[52%] items-center space-x-2">
                    <ReactSwitch
                      onChange={(e) => {
                        if (!e) {
                          setShippingFee("0");
                        }
                        setIsShippingFee(e);
                      }}
                      checked={isShippingFee}
                    />
                    <span className="font-bold">배송료</span>
                    {isShippingFee ? <input type="text" value={priceUtil.converterPrice(shippingFee)} onChange={changeShippingFee} className="border-b border-black  w-[70px] text-center" /> : <div>무료</div>}
                  </div>
                  <div className="flex flex-1 items-center space-x-2">
                    <ReactSwitch
                      onChange={(e) => {
                        setIsEvent(e);
                      }}
                      checked={isEvent}
                    />
                    <span className={`font-bold ${isEvent ? "text-green-700" : "text-gray-400"}`}>장마아이템</span>
                  </div>
                </div>
                <div
                  onClick={() => {
                    setIsRelation(true);
                  }}
                  className="bg-black flex cursor-pointer  justify-center items-center h-[48px]"
                >
                  <span className="font-medium text-white">연관상품 선택</span>
                </div>
                {selectedRelations.length > 0 && (
                  <div>
                    <span className="font-bold">연관상품</span>
                    <div className="flex space-x-3 scrollx">
                      {selectedRelations.map((v) => (
                        <img alt={v.image} src={v.image} key={v.id} className="w-[60px] min-w-[60px] h-[60px] bg-gray-400"></img>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex scrollx w-full">
              {mainImages.map((v, index) => (
                <div key={index} className="min-w-[200px] relative h-[200px] border rounded-lg mr-2 flex items-center justify-center">
                  <i
                    onClick={() => {
                      const filteredImages = mainImages.filter((item) => item !== v);
                      setMainImages(filteredImages);
                      setDeleteImages([...deleteImages, { id: v.id, location: v.location }]);
                    }}
                    className=" cursor-pointer fa-solid fa-trash text-lg absolute top-[4px] right-[4px] bg-gray-200 opacity-50 px-3 py-1 rounded-full"
                  ></i>
                  <img src={v.location ? v.location : ""} alt="" className="w-[150px] h-[150px]" />
                </div>
              ))}
            </div>
            <div className="w-full space-y-4 md:hidden mt-[20px]">
              <div>
                <span className="font-bold">상품 이름</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value.trim());
                  }}
                  className="border-b border-black  w-full"
                />
              </div>
              <div>
                <span className="font-bold">가격</span>
                <input type="text" value={priceUtil.converterPrice(price)} onChange={changePriceHandler} className="border-b border-black  w-full" />
              </div>
              <select
                className=" w-full h-[48px] border-b border-black"
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                }}
              >
                <option value="" className="">
                  카테고리 선택
                </option>
                {categories.map((item) => (
                  <option key={item.id} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
              <div className="flex space-x-4">
                <div className="w-1/2">
                  <span className="font-bold">할인율</span>
                  <br />
                  <input type="text" value={priceUtil.converterPrice(disCount)} onChange={changeDisCountHandler} className="border-b border-black w-[30px] text-orange-600 font-bold" />
                  <span className="font-bold">%</span>
                </div>
                <div className="w-1/2">
                  <span className="font-bold">할인가격</span>
                  <br />
                  {+price === priceUtil.calculationDiscount(+price, +disCount) ? <span>없음</span> : <span>{priceUtil.converterPrice(priceUtil.calculationDiscount(+price, +disCount).toString())}</span>}
                </div>
              </div>
              <div className="flex ">
                <div className="flex w-[52%] items-center space-x-2">
                  <ReactSwitch
                    onChange={(e) => {
                      setIsShippingFee(e);
                    }}
                    checked={isShippingFee}
                  />
                  <span className="font-bold">배송료</span>
                  {isShippingFee ? <input type="text" value={priceUtil.converterPrice(shippingFee)} onChange={changeShippingFee} className="border-b border-black  w-[70px] text-center" /> : <div>무료</div>}
                </div>
                <div className="flex flex-1 items-center space-x-2">
                  <ReactSwitch
                    onChange={(e) => {
                      setIsEvent(e);
                    }}
                    checked={isEvent}
                  />
                  <span className={`font-bold ${isEvent ? "text-green-700" : "text-gray-400"}`}>장마아이템</span>
                </div>
              </div>
              <div
                onClick={() => {
                  setIsRelation(true);
                }}
                className="bg-black flex cursor-pointer  justify-center items-center h-[48px]"
              >
                <span className="font-medium text-white">연관상품 선택</span>
              </div>
              {selectedRelations.length > 0 && (
                <div>
                  <span className="font-bold">연관상품</span>
                  <div className="flex space-x-3 scrollx">
                    {selectedRelations.map((v) => (
                      <img alt={v.image} src={v.image} key={v.id} className="w-[60px] min-w-[60px] h-[60px] bg-gray-400"></img>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div ref={descriptionRef} className=" w-full h-full  mt-10">
            {descriptionImages.length > 0 && descriptionImages.map((v, index) => <img key={index} src={v.location ? v.location : ""} alt={v.location} className="w-full" />)}
          </div>
        </div>
      </div>
    </div>
  );
}
