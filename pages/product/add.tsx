import { is } from "immer/dist/internal";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import ReactSwitch from "react-switch";
import productAPI from "../../api/productAPI";
import Relation from "../../components/Relation";
import useMustNumber from "../../hooks/useMustNumber";
import loadingSlice from "../../slices/loadingSlice";
import productSlice from "../../slices/productSlice";
import { RootState } from "../../store/reducer";
import { CrawlingItem } from "../../types/productType";
import convertUtil from "../../utils/convertUtil";
import priceUtil from "../../utils/priceUtil";

export default function ProductAdd() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [selectedBrand, setSelectedBrand] = useState("");
  const [crawlingURL, setCrawlingURL] = useState("");
  const [isCrawling, setIsCrawling] = useState(false);
  const brands = useSelector((state: RootState) => state.product.brands);
  const categories = useSelector((state: RootState) => state.product.categories);
  const crawlingItem = useSelector((state: RootState) => state.product.crawlingItem);
  const [name, setName] = useState("");
  const [price, setPrice, changePriceHandler] = useMustNumber("0");
  const [disCount, setDisCount, changeDisCountHandler] = useMustNumber("0", { limit: 100, length: 3 });
  const [shippingFee, setShippingFee, changeShippingFee] = useMustNumber("0", { limit: 10000, length: 10 });
  const [isEvent, setIsEvent] = useState(false);
  const [isShippingFee, setIsShippingFee] = useState(false);
  const [screenshotImages, setScreenshotImages] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const descriptionRef = useRef<HTMLDivElement>(null);
  const [isRelation, setIsRelation] = useState(false);
  const [relation, setRelation] = useState<{ id: number; image: string }[]>([]);

  useEffect(() => {
    console.log("product add check");
    const getBrandAndCategoryAPIHandler = async () => {
      const brands = await productAPI.findAllBrand();
      const categories = await productAPI.findAllCategory();

      dispatch(productSlice.actions.setBrands(brands));
      dispatch(productSlice.actions.setCategories(categories));
    };
    getBrandAndCategoryAPIHandler();
  }, [dispatch]);

  const crawlingAPIHandler = useCallback(async () => {
    try {
      dispatch(loadingSlice.actions.setLoading(true));
      const crawlingData: CrawlingItem = await productAPI.crawling({ name: selectedBrand, pageLocation: crawlingURL });
      if (crawlingData.originPrice) {
        setPrice(crawlingData.originPrice.replace(",", ""));
      } else {
        setPrice(crawlingData.salePrice.replace(",", ""));
      }
      if (crawlingData.name) {
        setName(crawlingData.name);
      }
      if (crawlingData.discount) {
        setDisCount(crawlingData.discount.replace("%", ""));
      }
      if (crawlingData.descriptionImage > 0) {
        for (let i = 1; i <= crawlingData.descriptionImage; i++) {
          setScreenshotImages([...screenshotImages, `${process.env.NEXT_PUBLIC_SERVER_URL?.replace("api/v1", "")}${i}.jpg`]);
        }
      }
      dispatch(productSlice.actions.setCrawlingItem(crawlingData));
      setIsCrawling(true);
    } catch (e) {
      console.log(e);
      alert("주소를 정확하게 입력해주세요.");
      setCrawlingURL("");
    } finally {
      dispatch(loadingSlice.actions.setLoading(false));
    }
  }, [crawlingURL, dispatch, selectedBrand, setDisCount, setPrice, screenshotImages]);

  const createProductAPIHandler = useCallback(async () => {
    dispatch(loadingSlice.actions.setLoading(true));
    let mainImageFiles: File[] = [];
    let descriptionImageFiles: File[] = [];
    let relations = "";
    const formData = new FormData();
    for await (const imageUrl of crawlingItem.image) {
      const imageFile = await convertUtil.URLtoFile(imageUrl, selectedBrand);
      mainImageFiles.push(imageFile);
    }
    for await (const imageUrl of screenshotImages) {
      const imageFile = await convertUtil.URLtoFile(imageUrl, "");
      descriptionImageFiles.push(imageFile);
    }
    if (mainImageFiles.length !== crawlingItem.image.length) {
      alert("이미지를 파일로 변환하는데 실패했습니다.");
      return;
    }
    if (descriptionImageFiles.length !== screenshotImages.length) {
      alert("이미지를 파일로 변환하는데 실패했습니다.");
      return;
    }
    const categoryIndex = categories.findIndex((v) => v.name === selectedCategory);
    formData.append("categoryId", categories[categoryIndex].id.toString());
    const brandIndex = brands.findIndex((v) => v.name === selectedBrand);
    formData.append("brandId", brands[brandIndex].id.toString());
    formData.append("name", name);
    formData.append("price", price);
    formData.append("isEvent", isEvent.toString());
    formData.append("shippingFee", shippingFee);
    formData.append("discount", disCount);
    formData.append("crawlingLocation", crawlingURL);
    if (relation.length > 0) {
      relation.map((v) => {
        if (relations.length === 0) {
          relations = `${v.id}`;
        } else {
          relations += `,${v.id}`;
        }
      });
    }
    formData.append("relations", relations);
    console.log("check", relations);
    mainImageFiles.map((v) => {
      formData.append("mainImage", v);
    });
    descriptionImageFiles.map((v) => {
      formData.append("descriptionImage", v);
    });
    await productAPI.createProduct(formData);
    dispatch(loadingSlice.actions.setLoading(false));
    alert("상품이 등록 되었습니다.");
    router.push("/view");
  }, [dispatch, crawlingItem, brands, categories, name, disCount, isEvent, price, selectedBrand, selectedCategory, shippingFee, crawlingURL, relation, router, screenshotImages]);

  const verifyCreateHandler = useCallback(() => {
    if (name === "") {
      alert("상품 이름을 입력해주세요.");
      return;
    }
    if (price === "") {
      alert("상품 가격을 입력해주세요.");
      return;
    }
    if (selectedCategory === "") {
      alert("카테고리를 선택해주세요.");
      return;
    }
    if (selectedBrand === "") {
      return;
    }
    if (crawlingURL === "") {
      return;
    }
    if (disCount === "") {
      alert("할인율을 입력해주세요. 적어도 0");
      return;
    }
    if (shippingFee === "") {
      alert("배송료를 입력해주세요.");
      return;
    }
    createProductAPIHandler();
  }, [crawlingURL, shippingFee, disCount, selectedBrand, selectedCategory, price, name, createProductAPIHandler]);

  const isCreateButtonHandler = useCallback((): boolean => {
    if (name === "") {
      return true;
    }
    if (price === "") {
      return true;
    }
    if (selectedCategory === "") {
      return true;
    }
    if (selectedBrand === "") {
      return true;
    }
    if (crawlingURL === "") {
      return true;
    }
    if (disCount === "") {
      return true;
    }
    if (shippingFee === "") {
      return true;
    }
    return false;
  }, [crawlingURL, shippingFee, disCount, selectedBrand, selectedCategory, price, name]);

  const isCreateButton = isCreateButtonHandler();

  return (
    <div className={` h-screen`}>
      {isRelation && <Relation setIsRelation={setIsRelation} relation={relation} setRelation={setRelation} />}
      <div className="px-4">
        <div
          onClick={() => {
            router.back();
          }}
          className="fixed top-0 w-[80px] z-20 h-[60px] flex items-center"
        >
          <i className={`fa-solid fa-arrow-left text-4xl`}></i>
        </div>
        {isCrawling ? (
          <div className=" relative w-full pt-[100px]">
            <div className=" fixed top-[8px] z-20 right-[120px] w-[100px] bg-gray-300  ">
              <button onClick={verifyCreateHandler} className={`w-[100px] py-4 ${isCreateButton ? "bg-gray-300 text-gray-400" : "bg-black text-white"}  font-bold fadein`}>
                상품등록
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
                  <img src={crawlingItem.image[0]} className={`w-full`} alt="" />
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
                  {relation.length > 0 && (
                    <div>
                      <span className="font-bold">연관상품</span>
                      <div className="flex space-x-3 scrollx">
                        {relation.map((v) => (
                          <img alt={v.image} src={v.image} key={v.id} className="w-[60px] min-w-[60px] h-[60px] bg-gray-400"></img>
                        ))}
                      </div>
                    </div>
                  )}
                  <div>
                    <span className="font-bold">색상 및 사이즈</span>
                    <div>
                      {crawlingItem.colorAndSize.map((v) => (
                        <div key={v.color} className="flex">
                          <span className="w-[70px] font-medium">{v.color}</span>
                          <div className="space-x-2">
                            {v.size.map((v2) => (
                              <span key={v2}>{v2}</span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex scrollx w-full">
                {crawlingItem.image.map((v, index) => (
                  <div key={index} className="min-w-[200px] relative h-[200px] border rounded-lg mr-2 flex items-center justify-center">
                    <i
                      onClick={() => {
                        const filteredImage = crawlingItem.image.filter((item) => item !== v);
                        dispatch(productSlice.actions.deleteCrawlingImage(filteredImage));
                      }}
                      className=" cursor-pointer fa-solid fa-trash text-lg absolute top-[4px] right-[4px] bg-gray-200 opacity-50 px-3 py-1 rounded-full"
                    ></i>
                    <img src={v} alt="" className="w-[150px] h-[150px]" />
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
                {relation.length > 0 && (
                  <div>
                    <span className="font-bold">연관상품</span>
                    <div className="flex space-x-3 scrollx">
                      {relation.map((v) => (
                        <img alt={v.image} src={v.image} key={v.id} className="w-[60px] min-w-[60px] h-[60px] bg-gray-400"></img>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <span className="font-bold">색상 및 사이즈</span>
                  <div>
                    {crawlingItem.colorAndSize.map((v) => (
                      <div key={v.color} className="flex">
                        <span className="w-[70px] font-medium">{v.color}</span>
                        <div className="space-x-2">
                          {v.size.map((v2) => (
                            <span key={v2}>{v2}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div ref={descriptionRef} className=" w-full h-full  mt-10">
              {screenshotImages.length > 0 && screenshotImages.map((v, index) => <img key={index} src={v} alt={""} className="w-full" />)}
            </div>
          </div>
        ) : (
          <div className="relative w-full flex justify-center h-screen">
            <div className="flex flex-col items-center absolute top-1/2  -translate-y-[50%]">
              <div className=" flex flex-col items-center px-10 py-10 rounded-lg fadein">
                <span className="mb-3 font-bold text-xl">상품 조회</span>
                <div className="flex flex-col">
                  <select
                    className=" w-[300px] mb-3 h-[48px] border border-black px-4"
                    value={selectedBrand}
                    onChange={(e) => {
                      setSelectedBrand(e.target.value);
                    }}
                  >
                    <option value="">브랜드 선택</option>
                    {brands.map((item) => (
                      <option key={item.id} value={item.name}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  <input
                    value={crawlingURL}
                    onChange={(e) => {
                      setCrawlingURL(e.target.value.trim());
                    }}
                    type="text"
                    className="h-[48px] mb-3 border border-black px-4 "
                    placeholder="브랜드 주소 입력"
                  />
                  <button onClick={crawlingAPIHandler} disabled={selectedBrand && crawlingURL ? false : true} className={`${selectedBrand && crawlingURL ? "bg-black text-white" : "bg-gray-200 text-gray-400"} h-[40px] font-medium  text-lg`}>
                    조회
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
