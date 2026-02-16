import { BrowserRouter, Route, Routes } from "react-router";
import { Toaster } from "react-hot-toast";
import AdminRoute from "./routes/AdminRoute";
import UserRoute from "./routes/UserRoute";

function App() {
  return (
    <>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<UserRoute />} />
          <Route path="/admin/*" element={<AdminRoute />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
