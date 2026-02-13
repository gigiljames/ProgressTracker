import { useState } from "react";
import { userLogin } from "../api/userAuthService";
import toast from "react-hot-toast";

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
      <input
        type="text"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </>
  );
}

export default LoginPage;
