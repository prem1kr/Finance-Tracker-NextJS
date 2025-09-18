'use client';

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { FaDownload } from "react-icons/fa";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { useTheme } from "../../../components/context/Themes.jsx";
import AddIncome from "../dashboard/addincome/page.jsx";
import EditIncome from "../dashboard/edit/page.jsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const barColors = ["#8b5cf6", "#c4b5fd"];

export default function Income() {
  const { theme } = useTheme();

  const [sources, setSources] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedSource, setSelectedSource] = useState(null);

  const refetchSources = useCallback(async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        console.warn("No userId in localStorage");
        return;
      }
      const response = await axios.get(`/api/controller/transaction/get`, {
        params: { userId, type: "income" },
      });
      if (response.status === 200) {
        setSources(response.data.data || []);
        setChartData(
          (response.data.data || []).map((s) => ({ label: s.title, value: s.amount }))
        );
      } else {
        console.error("Failed to fetch income data", response);
      }
    } catch (error) {
      console.error("Error fetching income data", error);
    }
  }, []);

  useEffect(() => {
    refetchSources();
  }, [refetchSources]);

  const handleAddSuccess = async (newSource) => {
    setShowAddModal(false);
    alert("Income added successfully");
    await refetchSources();
  };

 

  const handleEdit = async (source) => {
    setSelectedSource(source);
    setEditModalOpen(true);
    await refetchSources();

  };

  const handleDelete = async (source) => {
  if (!window.confirm(`Are you sure you want to delete ${source.title}?`)) return;
  try {
    const userId = localStorage.getItem("userId");
    const response = await axios.delete('/api/controller/transaction/delete', {
      params: { id: source._id, userId }
    });
    if (response.status === 200) {
      alert("Income source deleted successfully!");
      await refetchSources();
    } else {
      alert("Failed to delete income source");
    }
  } catch (error) {
    alert("Error deleting income source: " + error.message);
  }
};


  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Income Sources", 14, 22);

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 14;
    const tableWidth = pageWidth - 2 * margin;

    const tableColumn = ["Name", "Date", "Amount"];
    const tableRows = sources.map((src) => [
      src.title,
      new Date(src.date).toLocaleDateString(),
      `$${src.amount.toLocaleString()}`,
    ]);

    autoTable(doc, {
      startY: 30,
      head: [tableColumn],
      body: tableRows,
      theme: "grid",
      headStyles: { fillColor: [139, 92, 246] },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      tableWidth,
      styles: { cellWidth: "wrap" },
      columnStyles: {
        0: { cellWidth: tableWidth * 0.5 },
        1: { cellWidth: tableWidth * 0.3 },
        2: { cellWidth: tableWidth * 0.2 },
      },
    });

    doc.save("income_sources.pdf");
  };

  return (
    <>
      <div className="space-y-8 bg-white dark:bg-gray-900 transition-colors duration-200 min-h-screen w-full px-4 md:px-6 mt-6">
        <div className="w-full rounded-xl shadow-lg bg-white dark:bg-gray-800 backdrop-blur-sm p-5 md:p-8 relative transition-colors duration-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-6">
            <div>
              <h2 className="text-xl md:text-2xl font-semibold mb-1 text-gray-900 dark:text-white">
                Income Overview
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm">
                Track your earnings over time and analyze your income trends.
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                className="bg-purple-600 text-white rounded px-4 py-2 hover:bg-purple-700 transition cursor-pointer"
                onClick={() => setShowAddModal(true)}
              >
                + Add Income
              </button>
            </div>
          </div>
          <div className="w-full h-64 flex items-end">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barCategoryGap="20%" margin={{ top: 10, right: 30, left: 0, bottom: 15 }}>
                <XAxis
                  dataKey="label"
                  tick={{
                    fill: theme === "dark" ? "#94a3b8" : "#52525b",
                    fontSize: 12,
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, "dataMax + 5000"]}
                  tick={{
                    fill: theme === "dark" ? "#94a3b8" : "#52525b",
                    fontSize: 12,
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  wrapperClassName="!rounded-lg !shadow-lg !text-xs"
                  contentStyle={{
                    background: theme === "dark" ? "#111827ed" : "#fff",
                    color: theme === "dark" ? "#fff" : "#333",
                    borderRadius: "0.75rem",
                    border: "none",
                  }}
                  labelStyle={{ color: "#7c3aed", fontWeight: "bold" }}
                  cursor={{
                    fill: theme === "dark" ? "#3b0764" : "#ede9fe",
                    opacity: 0.32,
                  }}
                />
                <Bar dataKey="value" radius={[10, 10, 0, 0]} isAnimationActive animationDuration={900}>
                  {chartData.map((_, idx) => (
                    <Cell key={idx} fill={barColors[idx % barColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="w-full rounded-xl shadow-[0_8px_40px_rgba(80,40,160,0.18)] bg-white dark:bg-gray-800 backdrop-blur-sm p-5 md:p-8 transition-colors duration-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">
              Income Sources
            </h2>
            <button
              className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-lg px-3 py-2 text-sm font-medium shadow transition-all flex items-center cursor-pointer"
              onClick={downloadPDF}
              aria-label="Download Income Sources as PDF"
            >
              <FaDownload className="mr-2" />
              Download
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-2">
            {sources.map((src) => (
              <div
                key={src._id}
                className={`group relative flex items-center justify-between rounded-lg px-2 py-3 shadow transition-all duration-300
                  bg-gray-50 dark:bg-gray-700
                  hover:bg-gray-100 dark:hover:bg-gray-600
                 `}
              >
                <div className="flex items-center space-x-3">
                  <span className="p-2 rounded-full text-xl bg-white/80 dark:bg-gray-900/80">{src.icon ?? "❓"}</span>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">{src.title}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{new Date(src.date).toLocaleDateString()}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-green-500 dark:text-green-400 font-bold text-base">+ ${src.amount.toLocaleString()}</span>
                  <div className="opacity-0 group-hover:opacity-100 flex space-x-2 ml-4 transition-opacity duration-300">
                    <button
                      onClick={() => handleEdit(src)}
                      className="text-gray-600 dark:text-gray-300 hover:text-purple-600 cursor-pointer"
                      aria-label="Edit Income Source"
                    >
                      <FiEdit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(src)}
                      className="text-gray-600 dark:text-gray-300 hover:text-red-600 cursor-pointer"
                      aria-label="Delete Income Source"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showAddModal && <AddIncome onClose={() => setShowAddModal(false)} onSuccess={handleAddSuccess} />}
        {editModalOpen && selectedSource && (
          <EditIncome
            source={selectedSource}
            onClose={() => {
              setEditModalOpen(false);
              setSelectedSource(null);
            }}
            onUpdate={handleEdit}
          />
        )}
      </div>
    </>
  );
}
