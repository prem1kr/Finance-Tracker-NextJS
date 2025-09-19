"use client";

import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import Google from "../google/page.jsx";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      setLoading(true);
      await axios.post("/api/controller/auth/signup", formData);
      setFormData({ name: "", email: "", password: "", confirmPassword: "" });
      alert("User created successfully");
    } catch (error) {
      if (error.response.data.error === "User already registered, please login.") {
      setError("User already registered, please login.");
      console.log(error.response.data.error);
      } else{

      console.log("Internal server error");
      alert("Internal server Error");
      }
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Side panel */}
      <div className="hidden md:flex w-1/2 flex-col items-center justify-center relative overflow-hidden text-white p-8">
        <div className="absolute inset-0 animate-gradient bg-gradient-to-r from-emerald-500 via-green-400 to-emerald-600 bg-[length:400%_400%]"></div>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 flex flex-col items-center text-center">
          <img src="/favicon.png" alt="Finance Tracker Logo" className="w-20 h-20 mb-4" />
          <h1 className="text-3xl font-bold mb-1">Finance Tracker</h1>
          <p className="text-base max-w-sm">Create your free account and take control of your money.</p>
        </div>
      </div>

      {/* Main form */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-gray-50 p-8">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-4">
            <img src="/favicon.png" alt="Finance Tracker Logo" className="w-16 h-16" />
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Create your account</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-400 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-400 focus:outline-none"
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
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-400 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-400 focus:outline-none"
                required
              />
            </div>
            {error && (
              <div className="text-red-500 text-sm font-semibold text-center">{error}</div>
            )}
            <button
              type="submit"
              className="w-full rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white transition hover:bg-emerald-700 cursor-pointer"
              disabled={loading}
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
          </form>


          <div className="mt-2">
               <Google/>
          </div>
         
          <div className="mt-4 text-center text-sm text-gray-600">
            <p>
              Already have an account?{" "}
              <Link href="login" >
              <span className="font-medium text-emerald-600 cursor-pointer">
                Log In
              </span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
