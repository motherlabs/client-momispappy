import customAxios from "./axios";

const getAuth = async () => {
  const response = await customAxios.apiAuthClient.post("/auth");
  return response.data;
};
const signIn = async (data: { name: string; uniqueCode: string }) => {
  const response = await customAxios.apiClient.post("/auth/signIn", data);
  return response.data;
};
const signOut = async () => {
  const response = await customAxios.apiAuthClient.post("/auth/signOut");
  return response.data;
};

const authAPI = {
  getAuth,
  signIn,
  signOut,
};

export default authAPI;
