import { Route, Routes } from "react-router"
import LoginPage from "../pages/LoginPage"
import SignupPage from "../pages/SignupPage"
import SlotsPage from "../pages/SlotsPage"
import ExamsPage from "../pages/ExamsPage"
import TextbooksPage from "../pages/TextbooksPage"
import ViewTextbookPage from "../pages/ViewTextbookPage"

function UserRoute() {
  return (
    <Routes>
        <Route path="login" element={<LoginPage/>}/>
        <Route path="signup" element={<SignupPage/>}/>
        <Route path="" element={<SlotsPage/>}/>
        <Route path="exams" element={<ExamsPage/>}/>
        <Route path="books" element={<TextbooksPage/>}/>
        <Route path="books/:id" element={<ViewTextbookPage/>}/>
    </Routes>
  )
}

export default UserRoute