'use client';

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Sector,
  Tooltip,
} from "recharts";
import { useTheme } from "../../../../components/context/Themes.jsx";

const COLORS = ["#6C5DD3", "#FF4D4F", "#FF914D", "#4D79FF", "#48BB78"];
const RADIAN = Math.PI / 180;

const Income = () => {
  const { theme } = useTheme();
  const [sources, setSources] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    async function fetchIncome() {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          console.warn("No userId in localStorage");
          return;
        }
        const res = await axios.get("/api/controller/transaction/get", {
          params: { userId, type: "income" },
        });
        if (res.status === 200) {
          const data = res.data.data || [];
          setSources(
            data.map((item) => ({
              id: item._id,
              name: item.title,
              amount: item.amount,
              date: new Date(item.date).toLocaleDateString(),
              icon: item.icon, 
            }))
          );
          const grouped = data.reduce((acc, curr) => {
            acc[curr.title] = (acc[curr.title] || 0) + curr.amount;
            return acc;
          }, {});
          const chartArr = Object.entries(grouped).map(([label, value]) => ({
            name: label,
            value,
          }));
          setChartData(chartArr);
        }
      } catch (error) {
        console.error("Error fetching income", error);
      }
    }
    fetchIncome();
  }, []);

  const totalIncome = sources.reduce((sum, item) => sum + item.amount, 0);
  const activeIncome = activeIndex !== null ? sources[activeIndex] : null;

  const renderActiveShape = (props) => {
    const {
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
    } = props;
    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          stroke={theme === "dark" ? "#ddd" : "#333"}
          strokeWidth={2}
        />
        <text
          x={cx}
          y={cy}
          dy={8}
          textAnchor="middle"
          fill={theme === "dark" ? "white" : "black"}
          fontWeight="bold"
          fontSize="16"
        >
          {payload.name}
        </text>
      </g>
    );
  };

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-gray-900 transition-colors duration-200">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex flex-col items-center transition-colors duration-200 relative overflow-visible">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Last 60 Days Income
        </h2>
        <div className="relative flex items-center justify-center w-full" style={{ height: 250, overflow: "visible" }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={75}
                outerRadius={95}
                paddingAngle={2}
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                isAnimationActive
                animationDuration={800}
                animationEasing="ease-out"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} style={{ transition: "transform 0.3s ease" }} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute left-0 right-0 top-[80px] flex flex-col items-center pointer-events-none">
            <p className="text-gray-500 dark:text-gray-400 text-sm">Total Income</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">${totalIncome.toLocaleString()}</p>
          </div>
          {activeIncome && (
            <div
              style={{
                position: "absolute",
                left: 250 + Math.cos((-chartData[activeIndex].value / totalIncome) * 2 * Math.PI - Math.PI / 2) * 140,
                top: 125 + Math.sin((-chartData[activeIndex].value / totalIncome) * 2 * Math.PI - Math.PI / 2) * 140,
                transform: "translate(-50%, -50%)",
                backgroundColor: theme === "dark" ? "#374151" : "#f3f4f6",
                padding: "12px",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                width: 180,
                zIndex: 1000,
                pointerEvents: "none",
              }}
              className="text-gray-900 dark:text-green"
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center dark:bg-gray-900">
                  {activeIncome.icon}
                </div>
                <span className="font-semibold">{activeIncome.name}</span>
              </div>
              <div className="text-sm text-gray-700 dark:text-green-300 mb-1">Date: {activeIncome.date}</div>
              <div className="font-bold text-green-500 dark:text-green-400 text-lg">+ ${activeIncome.amount.toLocaleString()}</div>
            </div>
          )}
        </div>
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          {chartData.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-2 cursor-pointer rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <span className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
              <span className="text-gray-700 dark:text-gray-300 text-sm">{item.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-colors duration-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Income</h2>
        </div>
        <ul className="space-y-5 overflow-hidden" style={{ height: "410px" }}>
          {sources.map((item) => (
            <li
              key={item.id}
              className="flex justify-between items-center cursor-pointer rounded-lg p-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300 transform hover:scale-[1.02]"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center transition-colors duration-200">
                  {item.icon}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{item.date}</p>
                </div>
              </div>
              <p className="text-green-500 dark:text-green-400 font-medium flex items-center gap-1">
                + ${item.amount.toLocaleString()}
                <span className="ml-1">↑</span>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Income;
