'use client';

import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import {
  FiCreditCard,
  FiTrendingUp,
  FiTrendingDown,
  FiArrowUpRight,
  FiArrowDownRight,
} from "react-icons/fi";
import { useTheme } from "../../../../components/context/Themes.jsx";

const OverView = () => {
  const { theme } = useTheme();

  const [summary, setSummary] = useState({
    totalBalance: 0,
    totalIncome: 0,
    totalExpenses: 0,
  });
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    async function fetchOverview() {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          console.warn("No userId in localStorage");
          return;
        }

        // Fetch all transactions for the user
        const response = await axios.get("/api/controller/transaction/get", { params: { userId } });
        if (response.status === 200) {
          const data = response.data.data || [];
          setTransactions(data);

          // Calculate totals
          const totalIncome = data.filter(txn => txn.type === 'income').reduce((sum, txn) => sum + txn.amount, 0);
          const totalExpenses = data.filter(txn => txn.type === 'expense').reduce((sum, txn) => sum + txn.amount, 0);
          const totalBalance = totalIncome - totalExpenses;

          setSummary({ totalBalance, totalIncome, totalExpenses });
        }
      } catch (error) {
        console.error("Error fetching transactions", error);
      }
    }

    fetchOverview();
  }, []);

  const pieData = [
    { name: "Total Balance", value: summary.totalBalance, color: "#6d28d9" },
    { name: "Total Expenses", value: summary.totalExpenses, color: "#ef4444" },
    { name: "Total Income", value: summary.totalIncome, color: "#f97316" },
  ];

  return (
    <div className="p-6 space-y-6 bg-white dark:bg-gray-900 transition-colors duration-200">
      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-6 flex items-center gap-4 transition duration-200 hover:shadow-lg hover:-translate-y-1">
          <div className="p-4 rounded-full bg-purple-100 dark:bg-purple-700 text-purple-600 dark:text-purple-300">
            <FiCreditCard size={24} />
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Total Balance</p>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{`$${(summary.totalBalance || 0).toLocaleString()}`}</h2>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-6 flex items-center gap-4 transition duration-200 hover:shadow-lg hover:-translate-y-1">
          <div className="p-4 rounded-full bg-orange-100 dark:bg-orange-700 text-orange-600 dark:text-orange-300">
            <FiTrendingUp size={24} />
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Total Income</p>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{`$${(summary.totalIncome || 0).toLocaleString()}`}</h2>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-6 flex items-center gap-4 transition duration-200 hover:shadow-lg hover:-translate-y-1">
          <div className="p-4 rounded-full bg-red-100 dark:bg-red-700 text-red-600 dark:text-red-300">
            <FiTrendingDown size={24} />
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Total Expenses</p>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{`$${(summary.totalExpenses || 0).toLocaleString()}`}</h2>
          </div>
        </div>
      </div>

      {/* Chart and Transactions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Recent Transactions</h3>
          </div>
          <ul className="space-y-5 cursor-pointer" style={{ height: "420px", overflow: "auto" , overflowY:"hidden", overflowX:"hidden"}}>
            {transactions.map((t) => (
              <li key={t._id} className={`flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-lg p-3 group transition transform hover:scale-[1.02] hover:shadow-lg`}>
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors duration-200 ${
                    t.type === "income" ? "bg-green-100 dark:bg-green-900" : "bg-red-100 dark:bg-red-900"
                  } text-2xl`}>
                    {t.icon}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{t.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(t.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className={`font-semibold flex items-center gap-1 px-3 py-1 rounded-xl shadow-sm ${
                  t.type === "income" ? "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900" : "text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900"
                }`}>
                  {t.type === "income" ? <FiArrowUpRight size={16} /> : <FiArrowDownRight size={16} />}
                  {t.type === "income" ? `+$${t.amount.toLocaleString()}` : `-$${t.amount.toLocaleString()}`}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Pie Chart */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-6">
          <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-white">Financial Overview</h3>
          <div className="relative flex items-center justify-center min-h-[460px] sm:min-h-[420px]">
            <ResponsiveContainer width="100%" height={370}>
              <PieChart>
                <Pie data={pieData} dataKey="value" innerRadius={100} outerRadius={140} paddingAngle={2} stroke="#fff" strokeWidth={2} isAnimationActive>
                  {pieData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`$${value.toLocaleString()}`, name]} cursor={{ fill: "rgba(0,0,0,0.05)" }} />
                <Legend verticalAlign="bottom" iconSize={12} wrapperStyle={{ fontSize: "15px", color: theme === "dark" ? "white" : "black", marginTop: 15 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute w-full text-center" style={{ top: "41%" }}>
              <span className="text-gray-500 dark:text-gray-400 text-sm">Total Balance</span>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{`$${(summary.totalBalance || 0).toLocaleString()}`}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const pieData = [
  { name: "Total Balance", value: 0, color: "#6d28d9" },
  { name: "Total Expenses", value: 0, color: "#ef4444" },
  { name: "Total Income", value: 0, color: "#f97316" },
];

export default OverView;
