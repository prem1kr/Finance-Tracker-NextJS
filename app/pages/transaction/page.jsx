'use client';

import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaDownload } from "react-icons/fa";
import { useTheme } from "../../../components/context/Themes.jsx";
import iconMap from "../../../components/utils/iconMap.jsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Transactions = () => {
  const { theme } = useTheme();
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          console.warn("No userId in localStorage");
          return;
        }
        const response = await axios.get(`/api/controller/transaction/get?userId=${userId}`);
        if (response.status === 200) {
          setTransactions(response.data.data || []);
        } else {
          console.error("Failed to fetch transactions", response);
        }
      } catch (error) {
        console.error("Error fetching transactions", error);
      }
    }
    fetchTransactions();
  }, []);

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("All Transactions", 14, 22);
    const tableColumn = ["Title", "Date", "Amount", "Type"];
    const tableRows = transactions.map(txn => [
      txn.title,
      new Date(txn.date).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }),
      txn.amount.toLocaleString(),
      txn.type,
    ]);
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      theme: "grid",
      headStyles: { fillColor: [139, 92, 246] },
      alternateRowStyles: { fillColor: [240, 240, 240] },
    });
    doc.save("transactions.pdf");
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden bg-white dark:bg-gray-900 min-h-screen transition-colors duration-200 mt-4">
      <div className="px-3 sm:px-6 pt-4 space-y-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow transition-colors duration-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              All Transactions
            </h2>
            <button
              onClick={downloadPDF}
              className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 rounded-lg px-3 py-2 text-sm font-medium shadow flex items-center transition-all whitespace-nowrap cursor-pointer"
              aria-label="Download Transactions List as PDF c"
            >
              <FaDownload className="mr-2 " />
              Download
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8">
            {transactions.map((txn) => {
              const isIncome = txn.type === "income";
              const iconFn = iconMap[txn.title.toLowerCase()];
              const iconElement = iconFn ? iconFn() : <span className="text-xl">{txn.icon || "❓"}</span>;
              return (
                <div
                  key={txn._id}
                  className={`flex items-center justify-between p-3 rounded-lg transition-shadow duration-300
                    ${isIncome
                      ? "bg-green-50 dark:bg-green-900 hover:bg-green-100 dark:hover:bg-green-800"
                      : "bg-red-50 dark:bg-red-900 hover:bg-red-100 dark:hover:bg-red-800"
                    } cursor-pointer`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="w-11 h-11 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-sm flex-shrink-0 text-2xl">
                      {iconElement}
                    </span>
                    <div className="min-w-0 flex flex-col overflow-hidden">
                      <p className={`font-semibold truncate 
                        ${isIncome ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"}`}>
                        {txn.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {new Date(txn.date).toLocaleDateString(undefined, {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <span className={`px-3 py-1 rounded-xl text-sm font-semibold whitespace-nowrap 
                      ${isIncome
                        ? "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/60"
                        : "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/60"
                      }`}>
                      {isIncome ? "+" : "-"}${txn.amount.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
