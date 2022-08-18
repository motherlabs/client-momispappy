// store -> root reducer(state) -> Produc slice
// action: state를 바꾸는 행위/동작
// dispatch: 그 액션을 실제로 실행하는 함수
// reducer: 액션이 실제로 실행되면 state를 바꾸는 로직

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CrawlingItem, IBrand, ICategory, IProduct, ISetting } from "../types/productType";

export type ProductState = {
  setting: ISetting;
  product: IProduct;
  products: IProduct[];
  categories: ICategory[];
  brands: IBrand[];
  crawlingItem: CrawlingItem;
};

export const productInitialState: ProductState = {
  setting: {
    id: 0,
    isPrice: false,
    isPoint: false,
    point: 0,
  },
  product: {
    id: 0,
    crawlingLocation: "",
    isEvent: false,
    name: "",
    price: 0,
    shippingFee: 0,
    discount: 0,
    view: 0,
    brand: {
      id: 0,
      name: "",
      sort: 0,
      imageLocation: "",
    },
    category: {
      id: 0,
      name: "",
      sort: 0,
      imageLocation: "",
    },
    toProduct: [],
    ProductImage: [],
  },
  products: [],
  brands: [],
  categories: [],
  crawlingItem: {
    name: "",
    image: [],
    descriptionImage: 0,
    discount: "",
    originPrice: "",
    salePrice: "",
    colorAndSize: [],
  },
};
const productSlice = createSlice({
  name: "product",
  initialState: productInitialState,
  reducers: {
    setSetting(state, action: PayloadAction<ISetting>) {
      state.setting = action.payload;
    },
    setIsPoint(state, action: PayloadAction<boolean>) {
      state.setting.isPoint = action.payload;
    },
    setIsPrice(state, action: PayloadAction<boolean>) {
      state.setting.isPrice = action.payload;
    },
    setPoint(state, action: PayloadAction<number>) {
      state.setting.point = action.payload;
    },
    setProduct(state, action: PayloadAction<IProduct>) {
      state.product = action.payload;
    },
    setCategories(state, action: PayloadAction<ICategory[]>) {
      state.categories = action.payload;
    },
    setBrands(state, action: PayloadAction<IBrand[]>) {
      state.brands = action.payload;
    },
    setProducts(state, action: PayloadAction<IProduct[]>) {
      state.products = action.payload;
    },
    setCrawlingItem(state, action: PayloadAction<CrawlingItem>) {
      state.crawlingItem = action.payload;
    },
    deleteCrawlingImage(state, action: PayloadAction<string[]>) {
      state.crawlingItem.image = action.payload;
    },
  },
});

export default productSlice;
