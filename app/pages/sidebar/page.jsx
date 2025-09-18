"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiLayout, FiDollarSign, FiFileText, FiLogOut, FiBook } from "react-icons/fi";
import { useRouter } from "next/navigation";

export default function Sidebar({ sidebarOpen, setSidebarOpen, currentView, setCurrentView }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [avatarSeed, setAvatarSeed] = useState("default");
  const router = useRouter();

  // Fetch user
  useEffect(() => {
    async function fetchUser() {
      try {
        const storedUserId = localStorage.getItem("userId");
        if (!storedUserId) {
          setLoading(false);
          return;
        }
        const response = await axios.get(`/api/controller/auth/user`, {
          params: { userId: storedUserId },
        });

        if (response.status === 200 && response.data.data) {
          setUser(response.data.data);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();

    // Random avatar seed (saved in localStorage so it's consistent)
    let savedSeed = localStorage.getItem("avatarSeed");
    if (!savedSeed) {
      savedSeed = Math.random().toString(36).substring(7);
      localStorage.setItem("avatarSeed", savedSeed);
    }
    setAvatarSeed(savedSeed);
  }, []);

  // 🔥 Generate new avatar when clicked
  const handleAvatarClick = () => {
    const newSeed = Math.random().toString(36).substring(7);
    setAvatarSeed(newSeed);
    localStorage.setItem("avatarSeed", newSeed);
  };

  const menuItems = [
    { name: "Dashboard", icon: <FiLayout size={20} /> },
    { name: "Income", icon: <FiDollarSign size={20} /> },
    { name: "Expense", icon: <FiFileText size={20} /> },
    { name: "All Transaction", icon: <FiBook size={20} /> },
  ];

  const handleMenuClick = (itemName) => {
    setCurrentView(itemName);
    if (window.innerWidth <= 1080) setSidebarOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("user");
    localStorage.removeItem("avatarSeed");
    setUser(null);
    router.push("/pages/auth/login");
  };

  return (
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-white/80 dark:bg-gray-800/90 shadow-2xl z-50 mt-20 flex flex-col backdrop-blur-md border-r border-gray-200 dark:border-gray-700 transition-colors duration-300 overflow-hidden ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } transform transition-transform duration-300 ease-in-out`}
    >
      <div className="absolute left-0 top-0 h-full w-2 bg-gradient-to-b from-purple-500 via-pink-500 to-orange-400 rounded-tr-3xl rounded-br-3xl" />

      {/* User Info */}
      <div className="flex flex-col items-center py-7 border-b border-gray-200 dark:border-gray-700 relative z-10 bg-opacity-80 ">
        <div className="relative cursor-pointer" onClick={handleAvatarClick} title="Click to change avatar">
          <img
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`}
            alt="user avatar"
            className="w-20 h-20 rounded-full mb-2 ring-4 ring-purple-400/40 transition-all duration-300 hover:scale-105"
          />
        </div>
        {loading ? (
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white tracking-wide drop-shadow ">
            Loading...
          </h2>
        ) : user ? (
          <>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white tracking-wide drop-shadow flex justify-self-center text-center">
              {user.name}
            </h2>
            {user.premium && (
              <p className="text-xs mt-1 font-medium text-purple-500 dark:text-purple-300">
                Premium Member
              </p>
            )}
          </>
        ) : (
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white tracking-wide drop-shadow">
            Not signed in
          </h2>
        )}
      </div>

      {/* Menu Items */}
      <nav className="flex flex-col flex-grow p-5 space-y-2 relative z-10 ">
        {menuItems.map((item, idx) => (
          <button
            key={idx}
            onClick={() => handleMenuClick(item.name)}
            className={`flex items-center gap-3 px-4 py-2 font-semibold rounded-xl transition-all duration-300 w-full text-left cursor-pointer ${
              item.name === currentView
                ? "bg-gradient-to-r from-purple-600 to-pink-400 text-white shadow-lg"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow"
            } hover:from-pink-500 hover:to-orange-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-300 transform hover:scale-105 active:scale-95 animate-fadeIn`}
            style={{ animationDelay: `${idx * 75}ms`, animationFillMode: "backwards" }}
            aria-current={item.name === currentView ? "page" : undefined}
          >
            <span
              className={`${
                item.name === currentView
                  ? "text-white"
                  : idx === 1
                  ? "text-emerald-500"
                  : idx === 2
                  ? "text-red-500"
                  : idx === 3
                  ? "text-orange-400"
                  : "text-gray-500"
              }`}
            >
              {item.icon}
            </span>
            <span>{item.name}</span>
          </button>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="p-4 mt-auto relative z-10" style={{ marginBottom: "100px" }}>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 rounded-xl font-semibold bg-gradient-to-r from-red-300 to-red-400 text-white shadow hover:brightness-110 transition-all duration-300 w-full text-left cursor-pointer"
        >
          <FiLogOut size={20} />
          Logout
        </button>
      </div>

      {/* Animation styles */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(16px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.4s cubic-bezier(0.68, -0.6, 0.32, 1.6) both;
          }
        `}
      </style>
    </div>
  );
}
