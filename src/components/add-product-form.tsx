import { X } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Modal } from "./modal";
import { cn } from "../lib/lib";

import {
  addProductSchema,
  type AddProductFormData,
} from "../schema/form-schemas";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API } from "../lib/axios";
import toast from "react-hot-toast";
import type { TProduct } from "./product-card";

type Props = {
  open: boolean;
  onClose: () => void;
  mode: "edit" | "create",
  product?: TProduct
};

const PRODUCT_TYPES = [
  "Foods",
  "Electronics",
  "Fashion",
  "Books",
  "Beauty",
  "Home",
  "Sports",
  "Other",
] as const;

export const AddProductModal = ({
  open,
  onClose,
  mode,
  product
}: Props) => {
  const queryClient = useQueryClient();
  const [existingImages, setExistingImages] =
    useState<string[]>([]);

  const [newImages, setNewImages] =
    useState<File[]>([]);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: {
      errors,
      dirtyFields,
      isSubmitting,
    },
  } = useForm({
    resolver: zodResolver(addProductSchema),
    defaultValues: {
      brandName: "",
      productType: "",
      quantityStock: 0,
      mrp: 0,
      sellingPrice: 0,
      productName: "",
      exchangeEligibility: "no",
      images: []
    },
  });

  const addProduct = useMutation({
    mutationFn: async (
      data: AddProductFormData
    ) => {
      let uploadedImages: {
        url: string;
        publicId: string;
      }[] = [];

      if (newImages.length > 0) {
        const formData = new FormData();

        newImages.forEach((image) => {
          formData.append("images", image);
        });

        const uploadResponse =
          await API.post(
            "/upload",
            formData,
            {
              headers: {
                "Content-Type":
                  "multipart/form-data",
              },
              withCredentials: true,
            }
          );

        uploadedImages =
          uploadResponse.data.images;
      }

      const productResponse =
        await API.post(
          "/products",
          {
            ...data,
            images: uploadedImages.map(img => img.url),
            exchangeEligibility: data.exchangeEligibility == "yes"
          },
          {
            withCredentials: true,
          }
        );

      return productResponse.data;
    },

    onSuccess: () => {
      toast.dismiss()
      queryClient.invalidateQueries({ queryKey: ["products"] })
      toast.success(
        "Product added successfully"
      );
      setNewImages([])
      reset();
      onClose();
    },
    onError: (error) => {
      toast.dismiss()
      console.error(error);

      toast.error(
        "Failed to add product"
      );
    },
    onMutate: () => {
      toast.dismiss()
      toast.loading(
        "Adding new product",
      )
    }
  });

  const updateProduct = useMutation({
    mutationFn: async (
      data: AddProductFormData
    ) => {
      let uploadedImages: {
        url: string;
        publicId: string;
      }[] = [];

      if (newImages.length > 0) {
        const formData =
          new FormData();

        newImages.forEach(
          (image) => {
            formData.append(
              "images",
              image
            );
          }
        );

        const response =
          await API.post(
            "/upload",
            formData,
            {
              withCredentials: true,
            }
          );

        uploadedImages =
          response.data.images;
      }

      return API.put(
        `/products/${product?._id}`,
        {
          ...data,
          images: [
            ...existingImages,
            ...uploadedImages.map(
              (img) => img.url
            ),
          ],
          exchangeEligibility:
            data.exchangeEligibility ==
            "yes",
        }
      );
    },

    onSuccess: () => {
      toast.dismiss()
      queryClient.invalidateQueries({ queryKey: ["products"] })
      toast.success(
        "Product updated"
      );
      onClose();
    },
    onMutate: () => {
      toast.loading(
        "Adding new product",
      )
    }
  });
  const onSubmit: SubmitHandler<
    AddProductFormData
  > = async (data) => {
    if (mode == "edit") {
      updateProduct.mutate(data);
    } else {
      addProduct.mutate(data);
    }
  };

  useEffect(() => {
    if (mode == "edit") {
      if (!product) return;
      reset({
        exchangeEligibility: product.exchangeEligibility ? "yes" : "no",
        productName: product.productName,
        productType: product.productType,
        brandName: product.brandName,
        quantityStock: product.quantityStock,
        sellingPrice: product.sellingPrice,
        mrp: product.mrp,
      })
      if (product.images.length > 0) {
        setExistingImages(product.images);
      }
    }
  }, [product, mode, reset])

  console.log(watch('exchangeEligibility'))


  return (
    <Modal
      isOpen={open}
      onClose={onClose}
    >
      <div className="w-full max-w-2xl">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-6"
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {mode == "create" ? "Add Product" : "Edit Product"}
            </h2>

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1 hover:bg-slate-100"
            >
              <X size={18} />
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="productName"
                className="text-sm text-gray-800"
              >
                Product Name
              </label>

              <input
                id="productName"
                type="text"
                placeholder="Cakezone Walnut Brownie"
                {...register("productName")}
                className={cn(
                  "rounded-md border border-gray-400 px-3 py-2 outline-none",
                  {
                    "border-red-600":
                      errors.productName,
                  }
                )}
              />

              {dirtyFields.productName &&
                errors.productName && (
                  <p className="text-sm text-red-600">
                    {
                      errors.productName
                        .message
                    }
                  </p>
                )}
            </div>

            {/* Brand Name */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="brandName"
                className="text-sm text-gray-800"
              >
                Brand Name
              </label>

              <input
                id="brandName"
                type="text"
                placeholder="Cakezone"
                {...register("brandName")}
                className={cn(
                  "rounded-md border border-gray-400 px-3 py-2 outline-none",
                  {
                    "border-red-600":
                      errors.brandName,
                  }
                )}
              />

              {dirtyFields.brandName &&
                errors.brandName && (
                  <p className="text-sm text-red-600">
                    {
                      errors.brandName
                        .message
                    }
                  </p>
                )}
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="productType"
                className="text-sm text-gray-800"
              >
                Product Type
              </label>

              <select
                id="productType"
                {...register("productType")}
                className={cn(
                  "rounded-md border border-gray-400 px-3 py-2 outline-none",
                  {
                    "border-red-600":
                      errors.productType,
                  }
                )}
              >
                <option value="">
                  Select Product Type
                </option>

                {PRODUCT_TYPES.map(
                  (type) => (
                    <option
                      key={type}
                      value={type}
                    >
                      {type}
                    </option>
                  )
                )}
              </select>

              {dirtyFields.productType &&
                errors.productType && (
                  <p className="text-sm text-red-600">
                    {
                      errors.productType
                        .message
                    }
                  </p>
                )}
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="quantity"
                className="text-sm text-gray-800"
              >
                Quantity
              </label>

              <input
                id="quantity"
                type="number"
                min={0}
                {...register("quantityStock", {
                  valueAsNumber: true,
                })}
                className={cn(
                  "rounded-md border border-gray-400 px-3 py-2 outline-none",
                  {
                    "border-red-600":
                      errors.quantityStock,
                  }
                )}
              />

              {dirtyFields.quantityStock &&
                errors.quantityStock && (
                  <p className="text-sm text-red-600">
                    {
                      errors.quantityStock
                        .message
                    }
                  </p>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="mrp"
                  className="text-sm text-gray-800"
                >
                  MRP
                </label>

                <input
                  id="mrp"
                  type="number"
                  min={0}
                  {...register("mrp", {
                    valueAsNumber: true,
                  })}
                  className={cn(
                    "rounded-md border border-gray-400 px-3 py-2 outline-none",
                    {
                      "border-red-600":
                        errors.mrp,
                    }
                  )}
                />

                {dirtyFields.mrp &&
                  errors.mrp && (
                    <p className="text-sm text-red-600">
                      {
                        errors.mrp
                          .message
                      }
                    </p>
                  )}
              </div>


              <div className="flex flex-col gap-2">
                <label
                  htmlFor="sellingPrice"
                  className="text-sm text-gray-800"
                >
                  Selling Price
                </label>

                <input
                  id="sellingPrice"
                  type="number"
                  min={0}
                  {...register(
                    "sellingPrice",
                    {
                      valueAsNumber:
                        true,
                    }
                  )}
                  className={cn(
                    "rounded-md border border-gray-400 px-3 py-2 outline-none",
                    {
                      "border-red-600":
                        errors.sellingPrice,
                    }
                  )}
                />

                {dirtyFields.sellingPrice &&
                  errors.sellingPrice && (
                    <p className="text-sm text-red-600">
                      {
                        errors
                          .sellingPrice
                          .message
                      }
                    </p>
                  )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-800">
                  Upload Product Images
                </label>

                <label
                  htmlFor="upload"
                  className="cursor-pointer text-sm text-gray-800"
                >
                  Add more photos
                </label>
              </div>

              <div className="grid min-h-20 place-items-center bg-gray-100 p-4">
                <label
                  htmlFor="upload"
                  className={cn("text-gray-600", {
                    hidden:
                      existingImages.length +
                      newImages.length >
                      0,
                  })}
                >
                  Browse
                </label>

                <input
                  id="upload"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    const files = Array.from(
                      e.target.files ?? []
                    );

                    setNewImages((prev) => [
                      ...prev,
                      ...files,
                    ]);
                  }}
                />

                <div className="grid grid-cols-4 gap-2">
                  {/* Existing Images */}
                  {existingImages.map((image) => (
                    <div
                      key={image}
                      className="relative"
                    >
                      <img
                        src={image}
                        alt="product"
                        className="h-24 w-24 rounded object-cover"
                      />

                      <button
                        type="button"
                        className="absolute -right-2 -top-1 cursor-pointer bg-blue-100"
                        onClick={() => {
                          setExistingImages(
                            (prev) =>
                              prev.filter(
                                (img) =>
                                  img !== image
                              )
                          );
                        }}
                      >
                        <X />
                      </button>
                    </div>
                  ))}

                  {/* New Images */}
                  {newImages.map((file) => (
                    <div
                      key={`${file.name}-${file.lastModified}`}
                      className="relative"
                    >
                      <img
                        src={URL.createObjectURL(
                          file
                        )}
                        alt={file.name}
                        className="h-24 w-24 rounded object-cover"
                      />

                      <button
                        type="button"
                        className="absolute -right-2 -top-1 cursor-pointer bg-blue-100"
                        onClick={() => {
                          setNewImages(
                            (prev) =>
                              prev.filter(
                                (img) =>
                                  img !== file
                              )
                          );
                        }}
                      >
                        <X />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="exchangeEligible"
                className="text-sm text-gray-800"
              >
                Exchange or return eligibility
              </label>

              <select
                id="exchangeEligible"
                {...register(
                  "exchangeEligibility"
                )}
                className="rounded-md border border-gray-400 px-3 py-2 outline-none"
              >
                <option value="yes">
                  Yes
                </option>
                <option value="no">
                  No
                </option>
              </select>

              {errors.exchangeEligibility && (
                <p className="text-sm text-red-600">
                  {
                    errors
                      .exchangeEligibility
                      .message
                  }
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full rounded-md bg-black px-4 py-2 text-white"
              disabled={isSubmitting}
            >
              {mode === "edit"
                ? "Update Product"
                : "Add Product"}
            </button>          </div>
        </form>
      </div>
    </Modal>
  );
};
