import { useState } from "react"
import { AddProductModal } from "../components/add-product-form"
import { Empty } from "../components/empty"
import { useQuery } from "@tanstack/react-query";
import { API } from "../lib/axios";
import { ProductCard, type TProduct } from "../components/product-card";
import { Filter } from "../components/filter";

export const HomePage = () => {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"edit" | "create">("create")
  const [productData, setProductData] = useState<TProduct>();
  const [filter, setFilter] = useState<
    | "published"
    | "unpublished" | undefined
  >();
  const { data, isPending, error, isError } = useQuery({
    queryKey: ['products', filter],
    queryFn: async () => {
      return await API.get('/products', {
        params: {
          filter
        }
      });
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
      <Filter
        value={filter}
        onFilter={(value) =>
          setFilter(value)
        }
      />
      <div className="grid gap-2 grid-cols-3">
        {data.data.map((item: TProduct) => (
          <ProductCard {...item} key={item._id} onEdit={handleEdit} />
        ))}
      </div>
      <AddProductModal product={productData} mode={mode} open={open} onClose={() => setOpen(false)} />
    </div>
  )
}
