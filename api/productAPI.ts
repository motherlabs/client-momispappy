import { ISetting } from "../types/productType";
import customAxios from "./axios";

const findSetting = async () => {
  const response = await customAxios.apiAuthClient.get("/setting");
  return response.data;
};

const updateSetting = async (data: ISetting) => {
  const response = await customAxios.apiAuthClient.put("setting", data);
  return response.data;
};

const productAPI = {
  findSetting,
  updateSetting,
};

export default productAPI;
