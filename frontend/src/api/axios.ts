import axios from "axios";
import { userInfoStore } from "../zustand/userInfoStore";
import { ROUTES } from "../constants/routes";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_AXIOS_BASE_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const token = userInfoStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;
    const token = userInfoStore.getState().token;
    if (!originalRequest) {
      return Promise.reject(err);
    }
    // Prevent infinite loop on refresh endpoint
    if (originalRequest.url?.includes(ROUTES.AUTH.REFRESH_TOKEN)) {
      return Promise.reject(err);
    }
    if (err.response?.status === 401 && !originalRequest._retry && token) {
      originalRequest._retry = true;
      try {
        const response = await axiosInstance.get(ROUTES.AUTH.REFRESH_TOKEN);
        if (response.data?.success) {
          const newToken = response.data.accessToken;

          userInfoStore.setState((state) => ({
            ...state,
            token: newToken,
          }));

          originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${newToken}`,
          };

          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        userInfoStore.setState({
          token: "",
          role: "",
          fName: "",
          lName: "",
        });

        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(err);
  },
);

export default axiosInstance;
