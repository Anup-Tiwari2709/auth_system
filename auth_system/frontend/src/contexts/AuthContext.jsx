"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/api";
import toast from "react-hot-toast";

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on app start
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Verify token and get user data
      authAPI
        .getProfile()
        .then((response) => {
          console.log("Profile fetch response:", response.data);
          // Handle the nested response structure
          const userData =
            response.data.data?.user || response.data.user || response.data;
          setUser(userData);
        })
        .catch((error) => {
          console.error("Profile fetch error:", error);
          localStorage.removeItem("token");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      console.log("Login attempt with:", { email, password: "***" });
      const response = await authAPI.login({ email, password });
      console.log("Login response:", response.data);

      // Handle the nested response structure
      const { user, token } = response.data.data || response.data;

      localStorage.setItem("token", token);
      setUser(user);
      toast.success("Login successful!");
      return { success: true };
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      const message = error.response?.data?.message || "Login failed";
      toast.error(message);
      return { success: false, message };
    }
  };

  const signup = async (userData) => {
    try {
      console.log("Signup attempt with data:", userData);

      const response = await authAPI.signup(userData);
      console.log("Signup response:", response.data);

      // Check if the response indicates success
      if (response.data.success) {
        // Handle the nested response structure
        const { user, token } = response.data.data;

        localStorage.setItem("token", token);
        setUser(user);
        toast.success(response.data.message || "Account created successfully!");
        return { success: true };
      } else {
        throw new Error(response.data.message || "Signup failed");
      }
    } catch (error) {
      console.error("Signup error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config,
      });

      const message =
        error.response?.data?.message || error.message || "Signup failed";
      toast.error(message);
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    toast.success("Logged out successfully!");
  };

  const forgotPassword = async (email) => {
    try {
      await authAPI.forgotPassword({ email });
      toast.success("OTP sent to your email!");
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Failed to send OTP";
      toast.error(message);
      return { success: false, message };
    }
  };

  const verifyOtp = async (email, otp) => {
    try {
      const response = await authAPI.verifyOtp({ email, otp });
      toast.success("OTP verified successfully!");
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || "Invalid OTP";
      toast.error(message);
      return { success: false, message };
    }
  };

  const resetPassword = async (
    email,
    otp,
    currentPassword,
    newPassword,
    confirmNewPassword
  ) => {
    try {
      console.log("Reset password attempt with:", {
        email,
        otp,
        currentPassword: "***",
        newPassword: "***",
        confirmNewPassword: "***",
      });

      const response = await authAPI.resetPassword({
        email,
        otp,
        currentPassword,
        newPassword,
        confirmNewPassword,
      });

      console.log("Reset password response:", response.data);
      toast.success(response.data.message || "Password reset successfully!");
      return { success: true };
    } catch (error) {
      console.error(
        "Reset password error:",
        error.response?.data || error.message
      );
      const message =
        error.response?.data?.message || "Failed to reset password";
      toast.error(message);
      return { success: false, message };
    }
  };

  const updateProfile = async (profileData) => {
    try {
      console.log("Update profile attempt with:", profileData);
      const response = await authAPI.updateProfile(profileData);
      console.log("Update profile response:", response.data);

      // Handle the nested response structure
      const updatedUser =
        response.data.data?.user || response.data.user || response.data;
      setUser(updatedUser);
      toast.success(response.data.message || "Profile updated successfully!");
      return { success: true };
    } catch (error) {
      console.error(
        "Update profile error:",
        error.response?.data || error.message
      );
      const message =
        error.response?.data?.message || "Failed to update profile";
      toast.error(message);
      return { success: false, message };
    }
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    forgotPassword,
    verifyOtp,
    resetPassword,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
