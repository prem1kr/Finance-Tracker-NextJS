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
      const res = await axios.post("/api/controller/auth/google", {
        token: credentialResponse.credential,
      });

      if (res.data.status === "NEW_USER") {
        setGoogleData({
          ...res.data,
          token: credentialResponse.credential,
        });
        setStep("PASSWORD");
      } else if (res.data.status === "SUCCESS") {
        localStorage.setItem("token", res.data.token);
        router.push("/pages/dashboard/dashboardhome");
      }
    } catch (err) {
      console.error("Google login error:", err.response?.data || err.message);
      alert("Google login failed ");
    }
  };

  const handlePasswordSubmit = async () => {
    try {
      const res = await axios.post("/api/controller/auth/google", {
        token: googleData.token,
        password,
      });

      if (res.data.status === "SUCCESS") {
        localStorage.setItem("token", res.data.token);
        router.push("/pages/dashboard/dashboardhome");
      }
    } catch (err) {
      console.error("Password setup error:", err.response?.data || err.message);
      alert("Signup failed ");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {step === "LOGIN" && (
        <div className="rounded-lg text-center">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => console.log("Google Login Failed")}
          />
        </div>
      )}

      {step === "PASSWORD" && (
        <div className="p-6 bg-white shadow-md rounded-lg text-center">
          <h1 className="text-xl font-semibold mb-4">
            Welcome {googleData?.name}, set your password
          </h1>
          <input
            type="password"
            placeholder="Enter password"
            className="border px-3 py-2 rounded w-full mb-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={handlePasswordSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Complete Signup
          </button>
        </div>
      )}
    </div>
  );
}

export default Google;
