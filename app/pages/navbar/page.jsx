'use client'
import React from "react";
import { FiMenu, FiBell, FiUser, FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "../../../components/context/Themes.jsx";

export default function Navbar({ showMenuButton, onMenuClick }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between bg-white dark:bg-gray-800 p-4 shadow h-16 transition-colors duration-200">
      {showMenuButton && (
        <button
          onClick={onMenuClick}
          className="text-gray-700 dark:text-gray-300 cursor-pointer "
          aria-label="Open sidebar"
        >
          <FiMenu size={24} />
        </button>
      )}
      <h1 className="text-lg font-bold text-purple-700 dark:text-purple-400">Finance Traker</h1>
      <div className="flex items-center gap-4">
        {/* <button
          onClick={toggleTheme}
          className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition cursor-pointer"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <FiMoon size={20} /> : <FiSun size={20} />}
        </button>
      */}
      </div>
    </nav>
  );
}