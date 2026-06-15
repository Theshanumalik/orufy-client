import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Trash } from "lucide-react"
import { API } from "../lib/axios"
import type { AxiosError, AxiosResponse } from "axios"
import toast from "react-hot-toast"

export type TProduct = {
  _id: string,
  productName: string,
  productType: string,
  quantityStock: number,
  mrp: number,
  sellingPrice: number,
  brandName: string,
  exchangeEligibility: boolean,
  images: string[],
  isPublished: boolean
}

export type TProductCard = TProduct & {
  onEdit: (data: TProduct) => void
}

export const ProductCard = ({ isPublished, _id, onEdit, productName, productType, quantityStock, mrp, sellingPrice, brandName, exchangeEligibility: exchangeEligiblity, images }: TProductCard) => {

  const queryClient = useQueryClient()
  const publishMutation = useMutation({
    mutationFn: async () => {
      const res = await API.put(`/products/publish/${_id}`, { published: !isPublished })

      return res.data
    },
    onSuccess: (data: AxiosResponse) => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success("Visiblity Changed!");
    },

    onError: (error: AxiosError) => {
      toast.error(
        error?.response?.data?.message ??
        "Failed to change Visiblity!"
      );
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const res = await API.delete(`/products/${_id}`)
      return res.data
    },
    onSuccess: (data: AxiosResponse) => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success("Deleted!");
    },

    onError: (error: AxiosError) => {
      toast.error(
        error?.response?.data?.message ??
        "Failed to delete product!"
      );
    },
  })

  const handlePublish = () => {
    publishMutation.mutate();
  }

  const handleDelete = () => {
    deleteMutation.mutate()
  }
  return (
    <div className="border border-gray-300 rounded-xl p-4 bg-white">
      <div className="w-full border rounded-xl border-gray-200 max-h-52 aspect-video bg-gray-50">
        <img src={images[0]} className="w-full h-full object-contain" />
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">{productName}</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Product type -</span>
            <span>{productType}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Quantity Stock -</span>
            <span>{quantityStock}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">MRP -</span>
            <span>{mrp}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Selling Price-</span>
            <span>{sellingPrice}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Brand Name-</span>
            <span>{brandName}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Total Number of images -</span>
            <span>{images.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Exchange Eligiblity -</span>
            <span>{exchangeEligiblity ? 'YES' : "NO"}</span>
          </div>
        </div>
        <div className="flex justify-between items-center gap-2">
          <button className="bg-blue-700 text-white flex-1 rounded-md px-3 py-2" onClick={handlePublish}>{isPublished ? "Unpublished" : "Publish"}</button>
          <button className="border border-gray-600 flex-1 rounded-md px-3 py-2" onClick={() => onEdit({
            productName,
            productType,
            brandName,
            exchangeEligibility: exchangeEligiblity,
            sellingPrice,
            mrp,
            quantityStock,
            _id,
            images,
            isPublished
          })}>Edit</button>
          <button className="border border-gray-600 rounded-md px-3 py-2" onClick={handleDelete}><Trash />
          </button>
        </div>
      </div>
    </div>
  )
}
