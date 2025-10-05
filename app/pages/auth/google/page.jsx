'use client';

import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useRouter } from "next/navigation";

function Google() {
  const [step, setStep] = useState("LOGIN");
  const [googleData, setGoogleData] = useState(null);
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const token = credentialResponse?.credential;
      if (!token) {
        alert("No token received from Google.");
        return;
      }

      // Send token to backend for verification or signup
      const res = await axios.post("/api/controller/auth/google", { token });

      if (res.data.status === "NEW_USER") {
        setGoogleData({
          ...res.data.user,
          token,
        });
        setStep("PASSWORD");
      } else if (res.data.status === "SUCCESS") {
        localStorage.setItem("token", res.data.token);
        router.push("/pages/dashboard/dashboardhome");
      } else {
        alert(res.data.message || "Unexpected response from server");
      }
    } catch (err) {
      console.error("Google login error:", err.response?.data || err.message);
      alert("Google login failed. Please try again.");
    }
  };

  const handlePasswordSubmit = async () => {
    try {
      if (!password.trim()) {
        alert("Please enter a password.");
        return;
      }

      const res = await axios.post("/api/controller/auth/google", {
        token: googleData?.token,
        password,
      });

      if (res.data.status === "SUCCESS") {
        localStorage.setItem("token", res.data.token);
        router.push("/pages/dashboard/dashboardhome");
      } else {
        alert(res.data.message || "Signup failed.");
      }
    } catch (err) {
      console.error("Password setup error:", err.response?.data || err.message);
      alert("Signup failed. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {step === "LOGIN" && (
        <div className="rounded-lg text-center shadow-md p-6 bg-white">
          <h1 className="text-lg font-semibold mb-3">
            Sign in with Google
          </h1>
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => console.log("Google Login Failed")}
          />
        </div>
      )}

      {step === "PASSWORD" && (
        <div className="p-6 bg-white shadow-md rounded-lg text-center w-80">
          <h1 className="text-xl font-semibold mb-4">
            Welcome {googleData?.name || "User"}, set your password
          </h1>
          <input
            type="password"
            placeholder="Enter password"
            className="border px-3 py-2 rounded w-full mb-3 focus:outline-none focus:ring focus:ring-blue-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={handlePasswordSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
          >
            Complete Signup
          </button>
        </div>
      )}
    </div>
  );
}

export default Google;
