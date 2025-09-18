'use client';

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  Tooltip,
} from "recharts";
import { FiArrowDown } from "react-icons/fi";
import { useTheme } from "../../../../components/context/Themes.jsx";

const CustomTick = (props) => {
  const { x, y, payload } = props;
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        y={20}
        textAnchor="middle"
        fontSize={16}
        fontWeight={600}
        fill="#ef4444"  
        style={{ opacity: 0.75, textTransform: "lowercase" }}
      >
        {payload.value}
      </text>
      <rect
        x={-24}
        y={27}
        width={48}
        height={2}
        rx={1}
        fill="#ef4444"
        opacity={0.37}
      />
    </g>
  );
};

const Expense = () => {
  const { theme } = useTheme();
  const [sources, setSources] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    async function fetchExpenses() {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          console.warn("No userId in localStorage");
          return;
        }
        const response = await axios.get(`/api/controller/transaction/get`, {
          params: { userId, type: "expense" },
        });
        if (response.status === 200) {
          const data = response.data.data || [];
          setSources(
            data.map((item) => ({
              id: item._id,
              title: item.title,
              amount: item.amount,
              dateFormatted: new Date(item.date).toLocaleDateString(),
              icon: item.icon || <FiArrowDown size={20} />,
            }))
          );

          const grouped = data.reduce((acc, curr) => {
            acc[curr.title] = (acc[curr.title] || 0) + curr.amount;
            return acc;
          }, {});
          const chartArr = Object.entries(grouped).map(([label, value]) => ({
            label,
            value,
          }));
          setChartData(chartArr);
        }
      } catch (error) {
        console.error("Error fetching expenses", error);
      }
    }

    fetchExpenses();
  }, []);

  const barColor = theme === "dark" ? "#ef4444" : "#dc2626"; 

  return (
    <div className="p-6 space-y-6 bg-white dark:bg-gray-900 transition-colors duration-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-6">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-4">
            Recent Expenses
          </h3>
          <ul
            className="space-y-5 cursor-pointer"
            style={{ height: "420px", overflow: "hidden" }}
          >
            {sources.map(({ id, title, amount, dateFormatted, icon }) => (
              <li
                key={id}
                className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded-lg p-3 group transition transform hover:scale-[1.02] hover:shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors duration-200 ${
                      theme === "dark" ? "bg-red-900" : "bg-red-100"
                    } text-2xl`}
                  >
                    {icon}
                  </div>
                  <div>
                    <p className="capitalize font-medium text-gray-900 dark:text-white">
                      {title}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {dateFormatted}
                    </p>
                  </div>
                </div>
                <div
                  className={`font-semibold flex items-center gap-1 px-3 py-1 rounded-xl shadow-sm ${
                    theme === "dark"
                      ? "text-red-400 bg-red-900"
                      : "text-red-600 bg-red-50"
                  }`}
                >
                  <FiArrowDown size={16} />
                  -${amount.toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-6 flex flex-col items-center min-h-[460px] transition-colors duration-200">
          <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-white">
            Top Expense Categories
          </h3>
          <div className="relative w-full flex-grow min-h-[370px] " >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 24, right: 24, left: 24, bottom: 40 }}
                barCategoryGap="40%"
              >
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={<CustomTick />}
                  interval={0}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 15,
                    fill: theme === "dark" ? "#b3b3bb" : "#9ca3af",
                    opacity: 0.7,
                  }}
                  width={58}
                  style={{ fontWeight: 500 }}
                />
                <Tooltip
                  cursor={false}
                  contentStyle={{
                    background: theme === "dark" ? "#422727" : "#fff5f5",
                    color: theme === "dark" ? "#fca5a5" : "#b91c1c",
                    fontWeight: 700,
                    borderRadius: 12,
                    border: "none",
                    boxShadow: "none",
                  }}
                  labelStyle={{ color: barColor, fontWeight: 700, fontSize: 16 }}
                  itemStyle={{ color: barColor }}
                  formatter={(val) => `$${val.toLocaleString()}`}
                />
                <Bar
                  dataKey="value"
                  fill={barColor}
                  barSize={64}
                  radius={[16, 16, 16, 16]}
                >
                  {chartData.map((bar, idx) => (
                    <Cell key={`cell-${idx}`} fill={barColor} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Expense;
