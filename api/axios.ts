import axios from "axios";
import { getCookie, setCookie } from "cookies-next";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
  headers: {
    "Content-type": "application/json",
  },
});

const apiAuthClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
  headers: {
    "Content-type": "application/json",
    Authorization: `Bearer ${getCookie("AT_MOMISPAPPY")}`,
  },
});

apiAuthClient.interceptors.request.use(
  (request) => {
    request.headers = {
      "Content-type": "application/json",
      Authorization: `Bearer ${getCookie("AT_MOMISPAPPY")}`,
    };
    return request;
  },
  async (error) => {
    return Promise.reject(error);
  }
);

apiAuthClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const {
      config,
      response: { status },
    } = error;
    // console.log("error", status);
    if (status === 401) {
      console.log("reissuance Token");
      const originalRequest = config;
      if (originalRequest.url === "/auth/refresh") {
        console.log("intercentor close");
      } else {
        const refreshToken = getCookie("RT_MOMISPAPPY");
        const response = await apiAuthClient.post("/auth/refresh", { refreshToken: refreshToken });
        setCookie("AT_MOMISPAPPY", response.data.accessToken);
        originalRequest.headers = { "Content-type": "application/json", Authorization: `Bearer ${response.data.accessToken}` };

        // 전 리퀘스트 다시 요청
        return axios(originalRequest);
      }
    }
    return Promise.reject(error);
  }
);

const apiMultipartClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
  headers: {
    "Content-type": "multipart/form-data",
    Authorization: `Bearer ${getCookie("AT_MOMISPAPPY")}`,
  },
});

const customAxios = {
  apiClient,
  apiAuthClient,
  apiMultipartClient,
};

export default customAxios;
