import { useState } from "react";
import { userLogin } from "../api/userAuthService";
import toast from "react-hot-toast";
import { Link } from "react-router";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin() {
    userLogin(email, password)
      .then((response) => {
        console.log(response);
      })
      .catch((e) => {
        toast.error(e);
      });
  }

  return (
    <>
      <div className="h-screen w-screen bg-neutral-950 flex justify-center pt-20">
        <div className="bg-neutral-900 flex flex-col gap-5 h-fit border border-neutral-700 px-8 py-10 rounded-lg">
          <h1 className="text-neutral-300 text-center text-2xl font-extrabold">
            Login
          </h1>
          <div className="flex flex-col gap-3">
            <input
              className="border border-neutral-800 rounded-md p-2 text-neutral-300"
              type="text"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="border border-neutral-800 rounded-md p-2 text-neutral-300"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className="p-2 rounded-md bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-neutral-300 font-medium active:text-neutral-200 active:bg-neutral-600"
              onClick={handleLogin}
            >
              Login
            </button>
          </div>
          <div className="flex gap-2">
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
