import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import productAPI from "../api/productAPI";
import productSlice from "../slices/productSlice";
import { RootState } from "../store/reducer";
import { IProduct } from "../types/productType";
import Modal from "./Modal";

type Props = {
  setRelation: Dispatch<SetStateAction<{ id: number; image: string }[]>>;
  relation: { id: number; image: string }[];
  setIsRelation: Dispatch<SetStateAction<boolean>>;
  setRecentRelations?: Dispatch<SetStateAction<{ toProductId: number; fromProductId: number }[]>>;
  recentRelations?: { toProductId: number; fromProductId: number }[];
  toProductId?: number;
  setNonScroll: Dispatch<SetStateAction<boolean>>;
};

export default function Relation({ setIsRelation, setRelation, relation, setNonScroll, setRecentRelations = () => {}, toProductId = 0, recentRelations = [] }: Props) {
  const products = useSelector((state: RootState) => state.product.products);
  const categories = useSelector((state: RootState) => state.product.categories);
  const dispatch = useDispatch();
  const [filteredCategories, setFilteredCategories] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);

  useEffect(() => {
    console.log("relation api");
    const getProductListAPIHandler = async () => {
      const products = await productAPI.findAllProduct();

      dispatch(productSlice.actions.setProducts(products));
    };
    getProductListAPIHandler();
  }, [dispatch]);

  useEffect(() => {
    if (filteredCategories === "") {
      setFilteredProducts(products.filter((v) => v.id !== toProductId));
      return;
    }
    setFilteredProducts(products.filter((v) => v.category.name === filteredCategories && v.id !== toProductId));
    console.log("check");
  }, [filteredCategories, products, toProductId]);

  const selectRelationItemHabdler = useCallback(
    (id: number, image: string) => {
      if (relation.some((v) => v.id === id)) {
        const filteredReltion = relation.filter((v) => v.id !== id);
        setRelation(filteredReltion);
        const filteredRecentRelations = recentRelations.filter((v) => v.fromProductId !== id);
        setRecentRelations(filteredRecentRelations);
      } else {
        setRelation([...relation, { id, image }]);
        setRecentRelations([...recentRelations, { toProductId, fromProductId: id }]);
      }
    },
    [relation, setRelation, setRecentRelations, toProductId, recentRelations]
  );

  return (
    <div>
      <div
        onClick={() => {
          setIsRelation(false);
          setNonScroll(false);
        }}
        className="fixed top-1 left-3 px-1 py-1  rounded-full  z-50  flex items-center"
      >
        <i className={`fa-solid fa-arrow-left text-4xl text-white`}></i>
      </div>
      <Modal backDropClassName="opacity-90">
        <div className="flex flex-col items-center fadein">
          <div className="flex scrollx w-full max-w-[500px]">
            <button
              onClick={() => {
                setFilteredCategories("");
              }}
              className={`${filteredCategories === "" ? "text-white font-bold bg-black" : "text-gray-300"}  px-4 py-1 min-w-[80px] rounded-full `}
            >
              전체
            </button>

            {categories.map((v) => (
              <button
                onClick={() => {
                  setFilteredCategories(v.name);
                }}
                className={`${filteredCategories === v.name ? "text-white font-bold bg-black" : "text-gray-300"}  min-w-[80px]  px-4 py-1 rounded-full`}
                key={v.id}
              >
                {v.name}
              </button>
            ))}
          </div>
          <div className=" overflow-y-scroll space-y-3 md:h-[400px] h-[300px] w-full mt-10 flex flex-col items-center">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => {
                  selectRelationItemHabdler(product.id, product.ProductImage[0].location);
                }}
                className=" cursor-pointer max-w-[300px] w-full "
              >
                <div className={` flex items-center justify-between`}>
                  <div className="flex items-center space-x-3">
                    <img alt={product.name} src={product.ProductImage[0].location} className="bg-gray-500 w-[60px] h-[60px]"></img>
                    <span className={`${relation.some((v) => v.id === product.id) ? "text-white" : "text-gray-400"} text-lg font-medium `}>{product.name}</span>
                  </div>
                  {relation.some((v) => v.id === product.id) && <i className="fa-solid fa-check text-2xl text-white pr-3"></i>}
                </div>
              </div>
            ))}
          </div>
          <div className="h-[50px] mt-8">
            {relation.length > 0 && (
              <button
                onClick={() => {
                  setIsRelation(false);
                  setNonScroll(false);
                }}
                className="text-white bg-black w-[200px] h-[48px] rounded-lg  fadein"
              >
                선택 완료
              </button>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
