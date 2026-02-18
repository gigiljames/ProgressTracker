import { create } from "zustand";

type UserInfoStore = {
  email: string;
  token: string;
  role: string;
  fName: string;
  lName: string;
};

export const userInfoStore = create<UserInfoStore>((set) => ({
  email: "",
  token: "",
  role: "",
  fName: "",
  lName: "",
  setUserInfo: ({ email, token, role, fName, lName }: UserInfoStore) =>
    set((state) => ({ email, token, role, fName, lName })),
  clearUserInfo: () =>
    set((state) => ({ email: "", token: "", role: "", fName: "", lName: "" })),
}));
