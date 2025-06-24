import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useAuth0 } from "@auth0/auth0-react";
import type { Transaction } from "../types";

const ROOTURL = import.meta.env.VITE_ROOT_URL;
const AUDIENCE = import.meta.env.VITE_AUTH0_AUDIENCE;

const CATEGORY_COLORS: Record<string, string> = {
  Food: "#4caf50",
  Rent: "#f44336",
  Salary: "#2196f3",
  Transport: "#ff9800",
  Shopping: "#9c27b0",
  Entertainment: "#00bcd4",
  Utilities: "#ffc107",
  Other: "#9e9e9e",
};

const COLOR_PALETTE = [
  "#4caf50",
  "#f44336",
  "#2196f3",
  "#ff9800",
  "#9c27b0",
  "#00bcd4",
  "#ffc107",
  "#795548",
];

const PieChartPage: React.FC = () => {
  const { getAccessTokenSilently, user, isAuthenticated } = useAuth0();
  const [pieData, setPieData] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      if (!isAuthenticated) return;

      const token = await getAccessTokenSilently({
        authorizationParams: { audience: `${AUDIENCE}` },
      });

      const res = await fetch(`${ROOTURL}/addtx/gettxs`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const allTxs: Transaction[] = await res.json();
      const userTxs = allTxs.filter((tx) => tx.auth0_id === user?.sub);

      const predefinedCategories = [
        "Food",
        "Rent",
        "Salary",
        "Transport",
        "Shopping",
        "Entertainment",
        "Utilities",
        "Other",
      ];

      const categoryTotals: Record<string, number> = {};
      for (const category of predefinedCategories) {
        categoryTotals[category] = 0;
      }

      userTxs.forEach((tx) => {
        const raw = tx.category || "Other";
        const category =
          raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();

        if (category in categoryTotals) {
          categoryTotals[category] += Number(tx.amount);
        } else {
          categoryTotals["Other"] += Number(tx.amount);
        }
      });

      const categoryToColor: Record<string, string> = {};
      let fallbackIndex = 0;
      for (const category of predefinedCategories) {
        categoryToColor[category] =
          CATEGORY_COLORS[category] ??
          COLOR_PALETTE[fallbackIndex++ % COLOR_PALETTE.length];
      }

      const chartDataWithColor = predefinedCategories.map((category) => ({
        name: category,
        value: categoryTotals[category],
        fill: categoryToColor[category],
      }));

      setPieData(chartDataWithColor);
    }

    fetchData();
  }, [isAuthenticated]);

  return (
    <div className="h-[500px] px-6 py-4">
      <h1 className="text-2xl font-bold mb-4">Spending by Category</h1>

      {pieData.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={130}
              label
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-full flex items-center justify-center">
          <p className="text-lg font-semibold animate-pulse">
            Loading chart or no data available.
          </p>
        </div>
      )}
    </div>
  );
};

export default PieChartPage;
