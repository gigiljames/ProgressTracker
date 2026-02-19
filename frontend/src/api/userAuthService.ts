import axiosInstance from "./axios";
import { ROUTES } from "../constants/routes";

export async function userLogin(email: string, password: string) {
  const response = await axiosInstance.post(ROUTES.AUTH.LOGIN, {
    email,
    password,
  });
  return response;
}

export async function sendOtp(
  firstName: string,
  lastName: string,
  email: string,
) {
  const response = await axiosInstance.post(ROUTES.AUTH.SEND_OTP, {
    firstName,
    lastName,
    email,
  });
  return response;
}

export async function signup(
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  otp: string,
) {
  const response = await axiosInstance.post(ROUTES.AUTH.SIGNUP, {
    firstName,
    lastName,
    email,
    password,
    otp,
  });
  return response;
}

export async function userLogout() {
  const response = await axiosInstance.post(ROUTES.AUTH.LOGOUT);
  return response;
}
