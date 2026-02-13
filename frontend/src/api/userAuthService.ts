import axiosInstance from "./axios";
import { ROUTES } from "../constants/routes";

export async function userLogin(email: string, password: string) {
  const response = await axiosInstance.post(ROUTES.AUTH.LOGIN, {
    email,
    password,
  });
  return response;
}
