import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { googleLogin, sendOtp, signup } from "../api/userAuthService";
import toast from "react-hot-toast";
import OtpModal from "../components/OtpModal";
import { GoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import { userInfoStore } from "../zustand/userInfoStore";

function SignupPage() {
  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [otpModal, setOtpModal] = useState(false);
  const [otpModalLoading, setOtpModalLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const setUserInfo = userInfoStore((state) => state.setUserInfo);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({
    fName: "",
    lName: "",
    email: "",
    password: "",
    rePassword: "",
  });

  function resetFormStates() {
    setFName("");
    setLName("");
    setEmail("");
    setPassword("");
    setRePassword("");
  }

  function handleSignup() {
    let valid = true;
    setLoading(true);
    const newErrors = {
      fName: "",
      lName: "",
      email: "",
      password: "",
      rePassword: "",
    };

    if (!fName.trim()) {
      valid = false;
      newErrors.fName = "Enter a valid first name";
    }

    if (!lName.trim()) {
      valid = false;
      newErrors.lName = "Enter a valid last name";
    }

    if (!email.trim()) {
      valid = false;
      newErrors.email = "Enter a valid email";
    }

    if (!password.trim()) {
      valid = false;
      newErrors.password = "Enter a valid password";
    }

    if (!rePassword.trim()) {
      valid = false;
      newErrors.rePassword = "Enter a valid re-password";
    } else if (password.trim() !== rePassword.trim()) {
      valid = false;
      newErrors.rePassword = "Passwords do not match";
    }

    setErrors(newErrors);

    if (!valid) {
      setLoading(false);
      return;
    }

    sendOtp(fName, lName, email)
      .then((response) => {
        if (response.data.success) {
          toast.success("OTP sent successfully.");
          setOtpModal(true);
        } else {
          toast.error(response.data.message);
        }
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        toast.error("An error has occured.");
        setLoading(false);
      });
  }

  function handleOtpSubmit(otp: string) {
    setOtpModalLoading(true);
    signup(fName, lName, email, password, otp)
      .then((response) => {
        if (response.data.success) {
          toast.success(response.data.message);
          resetFormStates();
          setOtpModalLoading(false);
          setOtpModal(false);
        } else {
          toast.error(response.data.message);
        }
        setOtpModalLoading(false);
      })
      .catch((e) => {
        console.log(e);
        toast.error("An error has occured.");
        setOtpModalLoading(false);
      });
  }

  const handleGoogleSuccess = (credential: string) => {
    setLoading(true);
    googleLogin(credential)
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
          navigate("/");
        } else {
          toast.error(data.message);
        }
        setLoading(false);
      })
      .catch((e) => {
        toast.error(
          e?.response?.data?.message || e?.message || "Google login failed.",
        );
        setLoading(false);
      });
  };

  return (
    <>
      <OtpModal
        isOpen={otpModal}
        onClose={() => setOtpModal(false)}
        email={email}
        onSubmit={handleOtpSubmit}
        isLoading={otpModalLoading}
      />
      <div className="h-screen w-screen bg-neutral-950 flex justify-center pt-20 overflow-y-auto pb-20">
        <div className="bg-neutral-900 flex flex-col gap-5 h-fit border border-neutral-700 px-8 py-10 rounded-lg min-w-100">
          <h1 className="text-neutral-300 text-center text-2xl font-extrabold">
            Sign up
          </h1>

          <div className="flex flex-col gap-3">
            <div className="relative group/google w-full">
              <button
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 p-2 rounded-md bg-transparent border border-neutral-700 text-neutral-300 group-hover/google:bg-neutral-800 group-hover/google:text-white font-medium transition-all h-14 disabled:opacity-50"
              >
                <FcGoogle className="text-2xl" />
                Sign up with Google
              </button>
              <div className="absolute inset-0 opacity-0 overflow-hidden scale-[2] origin-center">
                <GoogleLogin
                  onSuccess={(credentialResponse) => {
                    if (credentialResponse.credential) {
                      handleGoogleSuccess(credentialResponse.credential);
                    }
                  }}
                  onError={() => {
                    toast.error("Google Login Failed");
                  }}
                  useOneTap
                  theme="filled_black"
                  shape="rectangular"
                  width="100%"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-[1px] bg-neutral-800"></div>
              <span className="text-neutral-600 text-sm">OR</span>
              <div className="flex-1 h-[1px] bg-neutral-800"></div>
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="font-medium text-neutral-300">First name</h2>
              <input
                className={`border border-neutral-800 rounded-md p-2 text-neutral-300 h-14 mb-1 ${
                  errors.fName ? "ring ring-red-400" : ""
                }`}
                type="text"
                placeholder="Enter your first name"
                value={fName}
                onChange={(e) => setFName(e.target.value)}
              />
              {errors.fName && (
                <div className="text-red-400 pl-1">{errors.fName}</div>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="font-medium text-neutral-300">Last name</h2>
              <input
                className={`border border-neutral-800 rounded-md p-2 text-neutral-300 h-14 mb-1 ${
                  errors.lName ? "ring ring-red-400" : ""
                }`}
                type="text"
                placeholder="Enter your last name"
                value={lName}
                onChange={(e) => setLName(e.target.value)}
              />
              {errors.lName && (
                <div className="text-red-400 pl-1">{errors.lName}</div>
              )}
            </div>
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
                <div className="text-red-400 pl-1 max-w-90">
                  {errors.password}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="font-medium text-neutral-300">
                Re-enter password
              </h2>
              <input
                className={`border border-neutral-800 rounded-md p-2 text-neutral-300 h-14 mb-1 ${
                  errors.rePassword ? "ring ring-red-400" : ""
                }`}
                type="password"
                placeholder="Re-enter password"
                value={rePassword}
                onChange={(e) => setRePassword(e.target.value)}
              />
              {errors.rePassword && (
                <div className="text-red-400 pl-1">{errors.rePassword}</div>
              )}
            </div>{" "}
            <button
              className="p-2 rounded-md bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-neutral-300 font-medium h-14 active:text-neutral-200 active:bg-neutral-600"
              onClick={handleSignup}
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Sign up"}
            </button>
          </div>
          <div className="flex gap-2 justify-center">
            <span className="text-neutral-500">Already have an account?</span>
            <Link
              to={"/login"}
              className="text-neutral-300 font-medium hover:underline"
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignupPage;
