'use client';

import React, { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import { ThemeProvider } from "../../../../components/context/Themes.jsx";
import Sidebar from "../../sidebar/page.jsx";
import Navbar from "../../navbar/page.jsx";
import Income from "../../income/page.jsx";
import Expense from "../../expanse/page.jsx";
import Transactions from "../../transaction/page.jsx";
import Home from "../home/page.jsx";

function HomeContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const [currentView, setCurrentView] = useState("Dashboard");

  useEffect(() => {
    setHydrated(true);

    function handleResize() {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth < 1080) {
        setSidebarOpen(false);
      }
    }

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!hydrated) return null;

  const shouldShowSidebar = windowWidth > 1080;
  const showMenuButton = windowWidth <= 1080;
  const isExtraSmallScreen = windowWidth <= 480;

  const renderCurrentView = () => {
    switch (currentView) {
      case "Income":
        return <Income />;
      case "Expense":
        return <Expense />;
      case "All Transaction":
        return <Transactions />;
      case "Dashboard":
      default:
        return <Home />;
    }
  };

  return (
    <div
      className="bg-gray-100 dark:bg-gray-900 min-h-screen font-inter transition-colors duration-200 text-gray-900 dark:text-gray-100"
      style={{ fontFeatureSettings: '"cv11", "ss03"' }}
    >
      <Navbar showMenuButton={showMenuButton} onMenuClick={() => setSidebarOpen(true)} />
      <div className="pt-16 flex">
        <div>
          {shouldShowSidebar && (
            <div className="w-64 fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white dark:bg-gray-800 shadow-md z-40 transition-colors duration-200 border-r border-gray-200 dark:border-gray-700">
              <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                currentView={currentView}
                setCurrentView={setCurrentView}
              />
            </div>
          )}
          {!shouldShowSidebar && (
            <div
              className={`fixed inset-0 z-50 bg-black/40 dark:bg-black/60 transition-opacity duration-300 ${
                sidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
              }`}
              onClick={() => setSidebarOpen(false)}
              aria-hidden="true"
            >
              <div
                className={`bg-white dark:bg-gray-800 w-64 shadow-md h-full transform relative transition-all duration-300 ease-in-out ${
                  sidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="absolute top-2 right-2 p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
                  aria-label="Close sidebar"
                >
                  <FiX size={24} />
                </button>
                <Sidebar
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={setSidebarOpen}
                  currentView={currentView}
                  setCurrentView={setCurrentView}
                />
              </div>
            </div>
          )}
        </div>
        {/* Main content */}
        <main
          className={`flex-1 transition-all duration-300 ease-in-out ${
            shouldShowSidebar ? "lg:ml-64" : ""
          } p-0`}
        >
          {renderCurrentView()}
        </main>
      </div>
    </div>
  );
}

export default function DashboardHome() {
  return (
    <ThemeProvider>
      <HomeContent />
    </ThemeProvider>
  );
}
