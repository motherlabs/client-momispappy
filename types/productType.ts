export type ISetting = {
  id: number;
  isPrice: boolean;
  isPoint: boolean;
  point: number;
};

export type ICategory = {
  id: number;
  name: string;
  sort: number;
  imageLocation: string;
};

export type IBrand = {
  id: number;
  name: string;
  sort: number;
  imageLocation: string;
};

export type IProduct = {
  id: number;
  crawlingLocation: string;
  isEvent: boolean;
  name: string;
  price: number;
  shippingFee: number;
  discount: number;
  view: number;
  brand: IBrand;
  category: ICategory;
  ProductImage: IProductImage[];
  toProduct: IToProduct[];
};

export type IToProduct = {
  toProductId: number;
  fromProductId: number;
  fromProduct: IProduct;
};

export type IProductImage = {
  id: number;
  type: ProductImageType;
  location: string;
};

export enum ProductImageType {
  MAIN = "MAIN",
  DESCRIPTION = "DESCRIPTION",
}

export type CrawlingItem = {
  name: string;
  image: string[];
  descriptionImage: number;
  discount: string;
  originPrice: string;
  salePrice: string;
  colorAndSize: {
    color: string;
    size: string[];
  }[];
};

export type UpdateProduct = {
  id: number;
  categoryId: number;
  name: string;
  price: number;
  discount: number;
  shippingFee: number;
  isEvent: boolean;
  deleteImages: { id: number; location: string }[];
  oldRelations: { toProductId: number; fromProductId: number }[];
  recentRelations: { toProductId: number; fromProductId: number }[];
};
