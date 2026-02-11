import { Route, Routes } from "react-router"
import AdminUserManagement from "../pages/admin/AdminUserManagement"
import AdminDashboard from "../pages/admin/AdminDashboard"
import AdminLoginPage from "../pages/admin/AdminLoginPage"

function AdminRoute() {
  return (
    <Routes>
        <Route path="/login" element={<AdminLoginPage/>}/>
        <Route path="/dashboard" element={<AdminDashboard/>}/>
        <Route path="/users" element={<AdminUserManagement/>}/>
    </Routes>
  )
}

export default AdminRoute