import { Route, Routes } from "react-router";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import SlotsPage from "../pages/SlotsPage";
import ExamsPage from "../pages/ExamsPage";
import TextbooksPage from "../pages/TextbooksPage";
import ViewTextbookPage from "../pages/ViewTextbookPage";
import UserProtectedRoute from "../utils/UserProtectedRoute";

function UserRoute() {
  return (
    <Routes>
      {/* Auth routes: only accessible when NOT logged in */}
      <Route element={<UserProtectedRoute type="auth" />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
      </Route>

      {/* Protected routes: only accessible when logged in */}
      <Route element={<UserProtectedRoute type="protected" />}>
        <Route path="" element={<SlotsPage />} />
        <Route path="exams" element={<ExamsPage />} />
        <Route path="books" element={<TextbooksPage />} />
        <Route path="books/:id" element={<ViewTextbookPage />} />
      </Route>
    </Routes>
  );
}

export default UserRoute;
