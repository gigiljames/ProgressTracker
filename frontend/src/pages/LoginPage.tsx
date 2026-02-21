import { useState } from "react";
import { userLogin } from "../api/userAuthService";
import toast from "react-hot-toast";
import { Link } from "react-router";
import { userInfoStore } from "../zustand/userInfoStore";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const setUserInfo = userInfoStore((state) => state.setUserInfo);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  function handleLogin() {
    let valid = true;
    setLoading(true);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    const newErrors = {
      email: "",
      password: "",
    };

    if (!email.trim()) {
      valid = false;
      newErrors.email = "Enter your email";
    } else if (!emailRegex.test(email)) {
      valid = false;
      newErrors.email = "Enter a valid email";
    }

    if (!password.trim()) {
      valid = false;
      newErrors.password = "Enter your password";
    }

    setErrors(newErrors);

    if (!valid) return;

    userLogin(email, password)
      .then((response) => {
        const data = response.data;
        if (data.success) {
          setUserInfo({
            fName: data.data?.firstName as string,
            lName: data.data?.lastName as string,
            email: data.data?.email as string,
            token: data.data?.accessToken as string,
            role: "USER",
          });
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
        setLoading(false);
      })
      .catch((e) => {
        toast.error(
          e?.response?.data?.message || e?.message || "Login failed.",
        );
        setLoading(false);
      });
  }

  return (
    <>
      <div className="h-screen w-screen bg-neutral-950 flex justify-center pt-20">
        <div className="bg-neutral-900 flex flex-col gap-5 h-fit border border-neutral-700 px-8 py-10 rounded-lg min-w-100">
          <h1 className="text-neutral-300 text-center text-2xl font-extrabold">
            Login
          </h1>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <h2 className="font-medium text-neutral-300">Email</h2>
              <input
                className={`border border-neutral-800 rounded-md p-2 text-neutral-300 h-14 mb-1 ${
                  errors.email ? "ring ring-red-400" : ""
                }`}
                type="text"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && (
                <div className="text-red-400 pl-1">{errors.email}</div>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <h2 className="font-medium text-neutral-300">Password</h2>
              <input
                className={`border border-neutral-800 rounded-md p-2 text-neutral-300 h-14 mb-1 ${
                  errors.password ? "ring ring-red-400" : ""
                }`}
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && (
                <div className="text-red-400 pl-1">{errors.password}</div>
              )}
            </div>

            <button
              className="p-2 rounded-md bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-neutral-300 font-medium active:text-neutral-200 active:bg-neutral-600 h-14"
              onClick={handleLogin}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
          <div className="flex gap-2 justify-center">
            <span className="text-neutral-500">Doesn't have an account?</span>
            <Link
              to={"/signup"}
              className="text-neutral-300 font-medium hover:underline"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
