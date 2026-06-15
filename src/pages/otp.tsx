import { useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { API } from "../lib/axios";
import {
  otpSchema,
  type OtpFormData,
} from "../schema/form-schemas";
import type { AxiosResponse } from "axios";
import { useUser } from "../context/user-context";

export const OtpPage = () => {
  const navigate = useNavigate();
  const [search] = useSearchParams()
  const { setUser } = useUser()

  const inputsRef =
    useRef<(HTMLInputElement | null)[]>(
      []
    );

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const otp = watch("otp");

  const verifyOtp = useMutation({
    mutationFn: async (
      data: OtpFormData
    ) => {
      const response = await API.post(
        "/users/verifyOTP",
        {
          ...data,
          user: search.get('user')
        },
        {
          withCredentials: true,
        }
      );

      return response.data;
    },

    onSuccess: (data: AxiosResponse) => {
      setUser(data.data)
      toast.success(
        "Logged in successfully"
      );

      navigate("/");
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data
          ?.message ??
        "Invalid OTP"
      );
    },
  });

  const handleOtpChange = (
    index: number,
    value: string
  ) => {
    if (!/^\d?$/.test(value)) {
      return;
    }

    const otpArray = (
      otp || ""
    ).split("");

    otpArray[index] = value;

    const newOtp =
      otpArray.join("");

    setValue("otp", newOtp, {
      shouldValidate: true,
    });

    if (
      value &&
      index < 5
    ) {
      inputsRef.current[
        index + 1
      ]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (
      e.key === "Backspace" &&
      !otp?.[index] &&
      index > 0
    ) {
      inputsRef.current[
        index - 1
      ]?.focus();
    }
  };

  const onSubmit = (
    data: OtpFormData
  ) => {
    verifyOtp.mutate(data);
  };

  return (
    <div className="w-full max-w-md">
      <h1 className="mb-12 text-2xl font-bold leading-tight text-[#131F68]">
        Login to your Productr Account
      </h1>

      <form
        onSubmit={handleSubmit(
          onSubmit
        )}
        className="space-y-6"
      >
        <div>
          <label className="mb-3 block text-sm font-medium text-black">
            Enter OTP
          </label>

          <div className="grid grid-cols-6 gap-x-4">
            {Array.from({
              length: 6,
            }).map((_, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputsRef.current[
                    index
                  ] = el;
                }}
                type="text"
                maxLength={1}
                value={
                  otp?.[index] || ""
                }
                onChange={(e) =>
                  handleOtpChange(
                    index,
                    e.target.value
                  )
                }
                onKeyDown={(e) =>
                  handleKeyDown(
                    index,
                    e
                  )
                }
                className="h-12 w-full rounded-xl border border-slate-200 bg-white text-center outline-none transition focus:border-slate-300"
              />
            ))}
          </div>

          {errors.otp && (
            <p className="mt-2 text-sm text-red-600">
              {errors.otp.message}
            </p>
          )}
          <p>Use OTP: {search.get('otp')}</p>
        </div>

        <button
          type="submit"
          disabled={
            verifyOtp.isPending
          }
          className="h-12 w-full rounded-xl bg-[#0B1484] font-semibold text-white transition hover:opacity-95 disabled:opacity-50"
        >
          {verifyOtp.isPending
            ? "Verifying..."
            : "Verify OTP"}
        </button>

        <p>
          Didn't receive OTP?{" "}
          <Link
            className="text-[#0B1484]"
            to="/"
          >
            Resend
          </Link>
        </p>
      </form>

      <div className="mt-48 rounded-2xl border border-[#D7D7DC] bg-white/50 p-6 text-center backdrop-blur-sm">
        <p className="text-sm text-[#8B8F9B]">
          Don't have a Productr
          Account
        </p>

        <button
          type="button"
          className="mt-1 font-semibold text-[#131F68]"
        >
          SignUp Here
        </button>
      </div>
    </div>
  );
};
