import { create } from "zustand";
import { persist } from "zustand/middleware";

type UserInfoStore = {
  email: string;
  token: string;
  role: string;
  fName: string;
  lName: string;
  setUserInfo: (userInfo: {
    email: string;
    token: string;
    role: string;
    fName: string;
    lName: string;
  }) => void;
  clearUserInfo: () => void;
  setToken: (token: string) => void;
  removeToken: () => void;
};

export const userInfoStore = create<UserInfoStore>()(
  persist(
    (set) => ({
      email: "",
      token: "",
      role: "",
      fName: "",
      lName: "",
      setUserInfo: ({
        email,
        token,
        role,
        fName,
        lName,
      }: {
        email: string;
        token: string;
        role: string;
        fName: string;
        lName: string;
      }) => set(() => ({ email, token, role, fName, lName })),
      clearUserInfo: () =>
        set(() => ({ email: "", token: "", role: "", fName: "", lName: "" })),
      setToken: (token: string) => set((state) => ({ ...state, token })),
      removeToken: () => set((state) => ({ ...state, token: "", role: "" })),
    }),
    {
      name: "user-info", // key in localStorage
    },
  ),
);
