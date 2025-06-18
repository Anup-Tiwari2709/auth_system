"use client";

import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Calendar,
  Shield,
  Settings,
  Activity,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  UserCheck,
  Crown,
} from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Format date helper function
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return "N/A";
    }
  };

  // Calculate days since account creation
  const getDaysSinceCreation = (dateString) => {
    if (!dateString) return 0;
    try {
      const createdDate = new Date(dateString);
      const today = new Date();
      const diffTime = Math.abs(today - createdDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch (error) {
      return 0;
    }
  };

  const daysSinceCreation = getDaysSinceCreation(user?.created_at);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.first_name}! 👋
            </h1>
            <p className="text-primary-100 text-lg">
              Ready to manage your account? Here's what's happening today.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span className="text-sm font-medium">Account Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card hover:shadow-lg transition-shadow duration-200">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Full Name</p>
                <p className="text-xl font-bold text-gray-900 mt-1">
                  {user?.first_name} {user?.last_name}
                </p>
              </div>
              <div className="p-3 bg-primary-100 rounded-full">
                <User className="h-6 w-6 text-primary-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="card hover:shadow-lg transition-shadow duration-200">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Email Status
                </p>
                <p className="text-xl font-bold text-gray-900 mt-1 truncate">
                  {user?.email?.length > 15
                    ? `${user.email.substring(0, 15)}...`
                    : user?.email}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Mail className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="card hover:shadow-lg transition-shadow duration-200">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Member Since
                </p>
                <p className="text-xl font-bold text-gray-900 mt-1">
                  {formatDate(user?.created_at)}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="card hover:shadow-lg transition-shadow duration-200">
          <div className="card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Days Active</p>
                <p className="text-xl font-bold text-gray-900 mt-1">
                  {daysSinceCreation}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Account Status */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="card-header">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Account Overview
                </h3>
                <Shield className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div className="card-content">
              <div className="space-y-6">
                {/* Verification Status */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {user?.is_verified ? (
                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                    ) : (
                      <AlertCircle className="h-6 w-6 text-yellow-600" />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">
                        Email Verification
                      </p>
                      <p className="text-sm text-gray-600">
                        {user?.is_verified
                          ? "Your email address has been verified"
                          : "Please verify your email address"}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-full ${
                      user?.is_verified
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {user?.is_verified ? "Verified" : "Pending"}
                  </span>
                </div>

                {/* Account Type */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Crown className="h-6 w-6 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">Account Type</p>
                      <p className="text-sm text-gray-600">
                        Standard user with full access
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800">
                    Standard
                  </span>
                </div>

                {/* Security Status */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-6 w-6 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-900">
                        Security Status
                      </p>
                      <p className="text-sm text-gray-600">
                        Account is secure and protected
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800">
                    Secure
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">
                Quick Actions
              </h3>
            </div>
            <div className="card-content">
              <div className="space-y-3">
                <button
                  onClick={() => navigate("/profile")}
                  className="btn-primary w-full flex items-center justify-center space-x-2"
                >
                  <Settings className="h-4 w-4" />
                  <span>Update Profile</span>
                </button>
              </div>
            </div>
          </div>

          {/* Account Info */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">
                Account Details
              </h3>
            </div>
            <div className="card-content">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">User ID</span>
                  <span className="text-sm font-medium text-gray-900 font-mono">
                    {user?.id}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">User Name</span>
                  <span className="text-sm font-medium text-gray-900 font-mono">
                    {user?.first_name} {user?.last_name}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Last Login</span>
                  <span className="text-sm font-medium text-gray-900">
                    Today
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <div className="card-header">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Activity
            </h3>
            <Clock className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        <div className="card-content">
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Account Login
                </p>
                <p className="text-xs text-gray-600">
                  Successfully logged in to your account
                </p>
              </div>
              <span className="text-xs text-gray-500">Just now</span>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <div className="p-2 bg-blue-100 rounded-full">
                <User className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Profile Viewed
                </p>
                <p className="text-xs text-gray-600">
                  Accessed profile information
                </p>
              </div>
              <span className="text-xs text-gray-500">5 min ago</span>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
              <div className="p-2 bg-purple-100 rounded-full">
                <Shield className="h-4 w-4 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Security Check
                </p>
                <p className="text-xs text-gray-600">
                  Account security verified
                </p>
              </div>
              <span className="text-xs text-gray-500">1 hour ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
