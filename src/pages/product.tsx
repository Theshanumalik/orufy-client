import { useState } from "react"
import { AddProductModal } from "../components/add-product-form"
import { Empty } from "../components/empty"
import { useQuery } from "@tanstack/react-query";
import { API } from "../lib/axios";
import { ProductCard, type TProduct } from "../components/product-card";
import { PlusIcon } from "lucide-react";

export const ProductPage = () => {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"edit" | "create">("create")
  const [productData, setProductData] = useState<TProduct>();
  const { data, isPending, error, isError } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      return await API.get('/products');
    }
  });

  const handleEdit = (data: TProduct) => {
    setOpen(true);
    setMode('edit');
    setProductData(data);
  }
  if (isPending) {
    return (
      <div>Loading..</div>
    )
  }
  if (isError) {
    return (
      <div>{error.message}</div>
    )
  }
  if (!data.data.length) {
    return (
      <div className="grid place-items-center gap-2">
        <Empty message="Feels a little empyt here!" />
        <button className="h-12 w-full max-w-sm rounded-xl bg-[#0B1484] font-semibold text-white transition hover:opacity-95" onClick={() => setOpen(true)}>
          Add your product
        </button>
        <AddProductModal open={open} onClose={() => setOpen(false)} mode="create" />
      </div>
    )
  }
  return (
    <div className="">
      <nav className="flex justify-between my-4">
        <h2 className="text-xl text-gray-600 font-semibold">Products</h2>
        <button className="text-md h-12 px-6 rounded-xl flex justify-center items-center gap-2 transition hover:opacity-95" onClick={() => setOpen(true)}>
          <PlusIcon className="text-gray-600" size={"18"} /> <span>Add Products </span>
        </button>
      </nav>
      <div className="grid gap-2 grid-cols-3">
        {data.data.map((item: TProduct) => (
          <ProductCard {...item} key={item._id} onEdit={handleEdit} />
        ))}
      </div>
      <AddProductModal product={productData} mode={mode} open={open} onClose={() => setOpen(false)} />
    </div>
  )
}
