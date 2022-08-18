import { ISetting, UpdateProduct } from "../types/productType";
import customAxios from "./axios";

const findSetting = async () => {
  const response = await customAxios.apiAuthClient.get("/setting");
  return response.data;
};

const updateSetting = async (data: ISetting) => {
  const response = await customAxios.apiAuthClient.put("setting", data);
  return response.data;
};

const findAllCategory = async () => {
  const response = await customAxios.apiClient.get("/product/category");
  return response.data;
};

const findAllBrand = async () => {
  const response = await customAxios.apiClient.get("/product/brand");
  return response.data;
};

const createCategory = async (data: FormData) => {
  const response = await customAxios.apiMultipartClient.post("/product/category", data);
  return response.data;
};

const createBrand = async (data: FormData) => {
  const response = await customAxios.apiMultipartClient.post("/product/brand", data);
  return response.data;
};

const updateCategory = async (data: FormData) => {
  const response = await customAxios.apiMultipartClient.put("/product/category", data);
  return response.data;
};

const updateBrand = async (data: FormData) => {
  const response = await customAxios.apiMultipartClient.put("/product/brand", data);
  return response.data;
};

const findAllProduct = async () => {
  const response = await customAxios.apiClient.get("/product");
  return response.data;
};

const createProduct = async (data: FormData) => {
  const response = await customAxios.apiMultipartClient.post("/product", data);
  return response.data;
};

const crawling = async (data: { name: string; pageLocation: string }) => {
  const response = await customAxios.apiAuthClient.post("/product/crawling", data);
  return response.data;
};

const deleteProduct = async (id: string) => {
  const reponse = await customAxios.apiAuthClient.delete(`/product/${id}`);
  return reponse.data;
};

const findOneProduct = async (id: string) => {
  const response = await customAxios.apiAuthClient.get(`/product/${id}`);
  return response.data;
};

const updateProduct = async (data: UpdateProduct) => {
  const response = await customAxios.apiAuthClient.put(`/product/${data.id}`, data);
  return response.data;
};

const productAPI = {
  findSetting,
  updateSetting,
  findAllBrand,
  findAllCategory,
  findAllProduct,
  updateBrand,
  updateCategory,
  createBrand,
  createCategory,
  createProduct,
  crawling,
  deleteProduct,
  findOneProduct,
  updateProduct,
};

export default productAPI;
