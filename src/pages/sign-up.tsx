import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

import { API } from "../lib/axios";

import {
  signupSchema,
  type SignupFormData,
} from "../schema/form-schemas";

export const SignupPage = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<SignupFormData>({
    resolver:
      zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: ""
    },
  });

  const createUserMutation =
    useMutation({
      mutationFn: async (
        data: SignupFormData
      ) => {
        const response =
          await API.post(
            "/users/create",
            data,
            {
              withCredentials: true,
            }
          );

        return response.data;
      },

      onSuccess: async () => {
        toast.success(
          "Registeration success! Please Login"
        );

        navigate(
          `/login/`
        );
      },

      onError: (
        error: any
      ) => {
        console.log(error)
        toast.error(
          error?.response
            ?.data?.message ??
          error.message
        );
      },
    });

  return (
    <div className="w-full max-w-lg">
      <h1 className="mb-6 text-2xl font-bold leading-tight text-[#131F68]">
        Create your Productr Account
      </h1>

      <form
        onSubmit={handleSubmit(
          (data) =>
            createUserMutation.mutate(
              data
            )
        )}
        className="space-y-3"
      >
        <div>
          <label className="mb-3 block text-sm font-medium">
            Full Name
          </label>

          <input
            type="text"
            placeholder="Enter your name"
            {...register("name")}
            className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 outline-none transition focus:border-gray-300"
          />

          {errors.name && (
            <p className="mt-1 text-sm text-red-600">
              {
                errors.name
                  .message
              }
            </p>
          )}
        </div>

        <div>
          <label className="mb-3 block text-sm font-medium">
            Email
          </label>

          <input
            type="email"
            placeholder="Enter email or phone"
            {...register(
              "email"
            )}
            className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 outline-none transition focus:border-gray-300"
          />

          {errors.email && (
            <p className="mt-1 text-sm text-red-600">
              {
                errors.email
                  .message
              }
            </p>
          )}
        </div>

        <div>
          <label className="mb-3 block text-sm font-medium">
            Phone Number
          </label>

          <input
            type="text"
            placeholder="Enter email or phone"
            {...register(
              "phoneNumber"
            )}
            className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 outline-none transition focus:border-gray-300"
          />

          {errors.phoneNumber && (
            <p className="mt-1 text-sm text-red-600">
              {
                errors.phoneNumber
                  .message
              }
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={createUserMutation.isPending ||
            isSubmitting
          }
          className="h-12 w-full rounded-xl bg-[#0B1484] font-semibold text-white"
        >
          {createUserMutation.isPending
            ? "Creating..."
            : "Create Account"}
        </button>
      </form>
    </div>
  );
};
