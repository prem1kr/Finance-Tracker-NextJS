'use client';

import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Google from "../google/page.jsx";

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post("/api/controller/auth/login", formData);

      const userId = response.data.userId || response.data.user?._id || response.data.id;

      if (userId) {
        localStorage.setItem("userId", userId);
        alert("User Login Successful");
        router.push("/pages/dashboard/dashboardhome");
        setFormData({ email: "", password: "" });
        setError("");
      } else {
        setError("Login failed: No userId returned from server");
      }
    } catch (error) {
      if (error.response?.data?.error === "user not found, Signup first") {
        setError("User not found, Signup First");
      } else if (error.response?.data?.error === "Incorrect password") {
        setError("Incorrect password, please try again.");
      } else {
        setError("Internal server error. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Side panel */}
      <div className="hidden md:flex w-1/2 flex-col items-center justify-center relative overflow-hidden text-white p-8">
        <div className="absolute inset-0 animate-gradient bg-gradient-to-r from-emerald-500 via-green-400 to-emerald-700 bg-[length:200%_200%]" />
        <div className="relative z-10 flex flex-col items-center">
          <img src="/favicon.png" alt="Finance Tracker Logo" className="w-24 h-24 mb-6" />
          <h1 className="text-4xl font-bold mb-2">Finance Tracker</h1>
          <p className="text-lg max-w-sm text-center">
            Take control of your money. Manage your expenses and savings easily.
          </p>
        </div>
      </div>

      {/* Main form */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-gray-50 p-10">
        <div className="w-full max-w-lg">
          <div className="flex justify-center mb-6">
            <img src="/favicon.png" alt="Finance Tracker Logo" className="w-20 h-20" />
          </div>

          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Sign in to your account</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-400 focus:outline-none "
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-400 focus:outline-none "
                required
              />
            </div>

            {error && <div className="text-red-500 text-sm font-semibold text-center">{error}</div>}

            <button
              type="submit"
              className="w-full rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white transition hover:bg-emerald-700 cursor-pointer"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>
           <div className="mt-2">
            <Google/>
          </div> 
          
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>
              Don’t have an account?{" "}
              <Link href="/pages/auth/signup">
                <span className="font-medium text-emerald-600 cursor-pointer">Sign Up</span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


