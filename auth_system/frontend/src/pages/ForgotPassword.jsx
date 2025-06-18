"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../contexts/AuthContext";
import { Mail, ArrowLeft, Shield } from "lucide-react";

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Email, 2: OTP
  const [email, setEmail] = useState("");
  const { forgotPassword, verifyOtp } = useAuth();
  const navigate = useNavigate();

  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors },
  } = useForm();

  const {
    register: registerOtp,
    handleSubmit: handleOtpSubmit,
    formState: { errors: otpErrors },
  } = useForm();

  const onEmailSubmit = async (data) => {
    setLoading(true);
    const result = await forgotPassword(data.email);
    if (result.success) {
      setEmail(data.email);
      setStep(2);
    }
    setLoading(false);
  };

  const onOtpSubmit = async (data) => {
    setLoading(true);
    const result = await verifyOtp(email, data.otp);
    if (result.success) {
      // Navigate to reset password with email and OTP
      navigate(
        `/reset-password?email=${encodeURIComponent(email)}&otp=${data.otp}`
      );
    }
    setLoading(false);
  };

  if (step === 2) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-primary-100">
              <Shield className="h-6 w-6 text-primary-600" />
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Enter OTP
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              We've sent a 6-digit code to{" "}
              <span className="font-medium">{email}</span>
            </p>
          </div>

          <div className="card">
            <div className="card-content">
              <form
                className="space-y-6"
                onSubmit={handleOtpSubmit(onOtpSubmit)}
              >
                <div className="form-group">
                  <label htmlFor="otp" className="form-label">
                    Verification Code
                  </label>
                  <input
                    id="otp"
                    type="text"
                    maxLength="6"
                    className={`input text-center text-lg tracking-widest ${
                      otpErrors.otp ? "border-red-500" : ""
                    }`}
                    placeholder="000000"
                    {...registerOtp("otp", {
                      required: "OTP is required",
                      pattern: {
                        value: /^\d{6}$/,
                        message: "Please enter a valid 6-digit OTP",
                      },
                    })}
                  />
                  {otpErrors.otp && (
                    <p className="form-error">{otpErrors.otp.message}</p>
                  )}
                </div>

                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full"
                  >
                    {loading ? "Verifying..." : "Verify OTP"}
                  </button>

                  <div className="flex items-center justify-between text-sm">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-primary-600 hover:text-primary-500"
                    >
                      Use different email
                    </button>
                    <button
                      type="button"
                      onClick={() => onEmailSubmit({ email })}
                      disabled={loading}
                      className="text-primary-600 hover:text-primary-500"
                    >
                      Resend OTP
                    </button>
                  </div>

                  <Link
                    to="/login"
                    className="btn-secondary w-full inline-flex items-center justify-center"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to login
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Forgot your password?
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email address and we'll send you a verification code to
            reset your password.
          </p>
        </div>

        <div className="card">
          <div className="card-content">
            <form
              className="space-y-6"
              onSubmit={handleEmailSubmit(onEmailSubmit)}
            >
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    className={`input pl-10 ${
                      emailErrors.email ? "border-red-500" : ""
                    }`}
                    placeholder="Enter your email"
                    {...registerEmail("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Please enter a valid email address",
                      },
                    })}
                  />
                </div>
                {emailErrors.email && (
                  <p className="form-error">{emailErrors.email.message}</p>
                )}
              </div>

              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full"
                >
                  {loading ? "Sending..." : "Send verification code"}
                </button>

                <Link
                  to="/login"
                  className="btn-secondary w-full inline-flex items-center justify-center"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
