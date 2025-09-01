/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import React, { useState } from "react";
import { requestPasswordReset, changePasswordwithOtp } from "@/api/authApis";
import {
    forgotPasswordSchema,
    resetPasswordWithOtpSchema,
    type ForgotPasswordFormData,
    type ResetPasswordWithOtpFormData
} from "@/validation/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";

export default function ForgotPasswordForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState(1); // 1: Email step, 2: OTP and new password step
    const [email, setEmail] = useState("");
    const router = useRouter();

    // Form for step 1 (email)
    const {
        control: emailControl,
        handleSubmit: handleEmailSubmit,
        formState: { errors: emailErrors },
        setError: setEmailError
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: ""
        }
    });

    // Form for step 2 (OTP and new password)
    const {
        control: resetControl,
        handleSubmit: handleResetSubmit,
        formState: { errors: resetErrors },
        setError: setResetError,
    } = useForm<ResetPasswordWithOtpFormData>({
        resolver: zodResolver(resetPasswordWithOtpSchema),
        defaultValues: {
            otp: "",
            Newpassword: "",
        }
    });

    // Handle email submission (step 1)
    const onSubmitEmail = async (data: ForgotPasswordFormData) => {
        setIsLoading(true);
        try {
            const response = await requestPasswordReset(data.email);
            console.log("Password reset email sent:", response);
            setEmail(data.email);
            setStep(2); // Move to next step
        } catch (error: any) {
            console.error("Password reset request failed:", error);
            setEmailError("root", {
                type: "manual",
                message: error.response?.data?.message || "Failed to send reset email"
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Handle OTP and new password submission (step 2)
    const onSubmitReset = async (data: ResetPasswordWithOtpFormData) => {
        setIsLoading(true);
        try {
            const response = await changePasswordwithOtp(
                email,
                data.Newpassword,
                data.otp
            );
            console.log("Password reset successful:", response);

            // Redirect to login or show success message
            router.push("/");
        } catch (error: any) {
            console.error("Password reset failed:", error);
            setResetError("root", {
                type: "manual",
                message: error.response?.data?.message || "Failed to reset password"
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Go back to email step
    const handleBack = () => {
        setStep(1);
    };

    return (
        <div className="flex flex-col flex-1 lg:w-1/2 w-full">
            <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                <div>
                    <div className="mb-5 sm:mb-8">
                        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                            {step === 1 ? "Reset Password" : "Create New Password"}
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {step === 1
                                ? "Enter your email to receive a verification code"
                                : "Enter the verification code sent to your email and create a new password"
                            }
                        </p>
                    </div>

                    {step === 1 ? (
                        // Step 1: Email form
                        <form onSubmit={handleEmailSubmit(onSubmitEmail)}>
                            <div className="space-y-6">
                                <div>
                                    <Label htmlFor="forgot-email">
                                        Email <span className="text-error-500">*</span>{" "}
                                    </Label>
                                    <Controller
                                        name="email"
                                        control={emailControl}
                                        render={({ field }) => (
                                            <Input
                                                type="email"
                                                id="forgot-email"
                                                name="email"
                                                placeholder="info@gmail.com"
                                                error={!!emailErrors.email}
                                                defaultValue={field.value}
                                                onChange={field.onChange}
                                            />
                                        )}
                                    />
                                    {emailErrors.email && (
                                        <p className="mt-1 text-sm text-error-500">{emailErrors.email.message}</p>
                                    )}
                                </div>

                                {emailErrors.root && (
                                    <div className="p-3 text-sm text-error-500 bg-error-50 rounded-md dark:bg-error-950/20">
                                        {emailErrors.root.message}
                                    </div>
                                )}

                                <div>
                                    <Button
                                        type="submit"
                                        className="w-full"
                                        size="sm"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "Sending..." : "Send Verification Code"}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    ) : (
                        // Step 2: OTP and new password form
                        <form onSubmit={handleResetSubmit(onSubmitReset)}>
                            <div className="space-y-6">
                                <div>
                                    <Label htmlFor="reset-otp">
                                        Verification Code <span className="text-error-500">*</span>{" "}
                                    </Label>
                                    <Controller
                                        name="otp"
                                        control={resetControl}
                                        render={({ field }) => (
                                            <Input
                                                type="text"
                                                id="reset-otp"
                                                name="otp"
                                                placeholder="Enter 6-digit code"
                                                error={!!resetErrors.otp}
                                                defaultValue={field.value}
                                                onChange={field.onChange}
                                            />
                                        )}
                                    />
                                    {resetErrors.otp && (
                                        <p className="mt-1 text-sm text-error-500">{resetErrors.otp.message}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="reset-password">
                                        New Password <span className="text-error-500">*</span>{" "}
                                    </Label>
                                    <div className="relative">
                                        <Controller
                                            name="Newpassword"
                                            control={resetControl}
                                            render={({ field }) => (
                                                <Input
                                                    type={showPassword ? "text" : "password"}
                                                    id="reset-password"
                                                    name="Newpassword"
                                                    placeholder="Enter new password"
                                                    error={!!resetErrors.Newpassword}
                                                    defaultValue={field.value}
                                                    onChange={field.onChange}
                                                />
                                            )}
                                        />
                                        <span
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                                        >
                                            {showPassword ? (
                                                <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                                            ) : (
                                                <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                                            )}
                                        </span>
                                    </div>
                                    {resetErrors.Newpassword && (
                                        <p className="mt-1 text-sm text-error-500">{resetErrors.Newpassword.message}</p>
                                    )}
                                </div>

                                {resetErrors.root && (
                                    <div className="p-3 text-sm text-error-500 bg-error-50 rounded-md dark:bg-error-950/20">
                                        {resetErrors.root.message}
                                    </div>
                                )}

                                <div className="flex gap-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="flex-1"
                                        size="sm"
                                        onClick={handleBack}
                                        disabled={isLoading}
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="flex-1"
                                        size="sm"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "Resetting..." : "Reset Password"}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    )}

                    <div className="mt-6 text-center">
                        <Link
                            href="/"
                            className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                        >
                            <ChevronLeftIcon className="w-4 h-4 mr-1" />
                            Back to Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}