import { BrowserRouter, Route, Routes } from "react-router";
import { Toaster } from "react-hot-toast";
import AdminRoute from "./routes/AdminRoute";
import UserRoute from "./routes/UserRoute";

function App() {
  return (
    <>
      <Toaster
        toastOptions={{
          style: {
            background: "#171717" /* neutral-900 */,
            color: "#e5e5e5" /* neutral-200 */,
            border: "1px solid #404040" /* neutral-700 */,
            borderRadius: "0.75rem",
            fontSize: "0.9rem",
          },
          success: {
            iconTheme: { primary: "#4ade80", secondary: "#171717" },
          },
          error: {
            iconTheme: { primary: "#f87171", secondary: "#171717" },
          },
        }}
      />
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
