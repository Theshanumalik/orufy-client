import { Handbag, HomeIcon } from "lucide-react"
import { Link, useLocation } from "react-router"
import { cn } from "../lib/lib"

const listItems = [
  {
    title: "Home",
    icon: <HomeIcon size={18} />,
    url: "/"
  },
  {
    title: "Products",
    icon: <Handbag size={18} />,
    url: "/products"
  }
]
export const Sidebar = () => {
  const location = useLocation()
  return (
    <aside className="col-span-2 px-3 bg-neutral-700 space-y-4 text-white">
      <div className="flex flex-col gap-y-2 mt-8">
        <h3 className="font-semibold text-lg">Logo</h3>
        <input placeholder="Search" type="text" className="bg-neutral-600 rounded-lg px-3 py-2 outline-none" />
      </div>
      <hr className="border-neutral-600" />
      <div>
        <ul className="space-y-4 text-gray-300">
          {listItems.map((item) => (
            <Link
              to={item.url}
              className={cn(
                "flex gap-x-2 items-center text-lg hover:text-gray-50",
                {
                  "text-gray-50":
                    item.url === "/"
                      ? location.pathname === "/"
                      : location.pathname.startsWith(item.url),
                }
              )}
            >
              {item.icon}
              {item.title}
            </Link>
          ))}
        </ul>
      </div>
    </aside>
  )
}
