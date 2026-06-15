import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { API } from "../lib/axios";
import {
  loginSchema,
  type LoginFormData,
} from "../schema/form-schemas";
import { Link, useNavigate } from "react-router";
import type { AxiosError, AxiosResponse } from "axios";

export const LoginPage = () => {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (
      data: LoginFormData
    ) => {
      const isEmail = /^\w+@\w+\.\[a-zA-Z]+$/.test(data.identifier);
      const isNumber = /^[6-9]\d{9}/.test(data.identifier);
      if (!isEmail && !isNumber) {
        throw new Error("Invalid username")
      }
      const response = await API.post(
        "/users/generateOTP",
        {
          email: isEmail ? data.identifier : undefined,
          phoneNumber: isNumber ? data.identifier : undefined
        },
        {
          withCredentials: true,
        }
      );

      return response.data;
    },

    onSuccess: (data: AxiosResponse) => {
      console.log(data)
      navigate(`/login/otp?user=${data.data._id}&otp=${data.data.otp}`)
      toast.success("OTP sent");
    },

    onError: (error: AxiosError) => {
      toast.error(
        error?.response?.data?.message ??
        "Failed to send OTP"
      );
    },
  });

  const onSubmit: SubmitHandler<
    LoginFormData
  > = (data) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="w-full max-w-lg">
      <h1 className="mb-12 text-2xl font-bold leading-tight text-[#131F68]">
        Login to your Productr Account
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <div>
          <label className="mb-3 block text-sm font-medium text-black">
            Email or Phone number
          </label>

          <input
            type="text"
            placeholder="Enter email or phone number"
            className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 outline-none transition focus:border-gray-300"
            {...register("identifier")}
          />

          {errors.identifier && (
            <p className="mt-1 text-sm text-red-600">
              {errors.identifier.message}
            </p>
          )}
          <span>{}</span>
        </div>

        <button
          type="submit"
          disabled={
            loginMutation.isPending ||
            isSubmitting
          }
          className="h-12 w-full rounded-xl bg-[#0B1484] font-semibold text-white transition hover:opacity-95 disabled:opacity-50"
        >
          {loginMutation.isPending
            ? "Sending OTP..."
            : "Login"}
        </button>
      </form>

      <div className="mt-48 rounded-2xl border border-[#D7D7DC] bg-white/50 p-6 text-center backdrop-blur-sm">
        <p className="text-sm text-[#8B8F9B]">
          Don't have a Productr Account
        </p>

        <Link to={'/signup'} className="mt-1 font-semibold text-[#131F68]"
        >
          SignUp Here
        </Link>
      </div>
    </div>
  );
};
