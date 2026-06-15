import { useLocation } from "react-router";
import { useUser } from "../context/user-context"
import { ChevronDown } from "lucide-react";

export const Navbar = () => {
  const { user } = useUser();
  const location = useLocation()
  return (
    <div className="flex justify-between items-center">
      <h3 className="font-semibold capitalize text-xl">{location.pathname.split('/')[1] || 'Home'}</h3>
      <div className="flex gap-1 items-center">
        {user?.name || "admin"} <ChevronDown />
      </div>
    </div>
  )
}
