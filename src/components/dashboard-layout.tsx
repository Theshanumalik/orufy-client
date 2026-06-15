import { Outlet, useNavigate } from "react-router"
import { Sidebar } from "./sidebar"
import { Navbar } from "./nav"
import { useUser } from "../context/user-context"
import { useEffect } from "react"

export const DashboardLayout = () => {
  const { user, isLoading } = useUser();
  const navigate = useNavigate()
  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  return (
    <main className="bg-blue-50 min-h-screen grid grid-cols-12">
      <Sidebar />
      <aside className="col-span-10 bg-red-50 p-4">
        <Navbar />
        <Outlet />
      </aside>
    </main>
  )
}
