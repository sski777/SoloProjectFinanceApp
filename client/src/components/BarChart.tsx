import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useAuth0 } from "@auth0/auth0-react";
import type { Transaction } from "../types";

const ROOTURL = import.meta.env.VITE_ROOT_URL;
const AUDIENCE = import.meta.env.VITE_AUTH0_AUDIENCE;

const BarChartPage: React.FC = () => {
  const { getAccessTokenSilently, user, isAuthenticated } = useAuth0();
  const [monthlyData, setMonthlyData] = useState<any[]>([]);

  useEffect(() => {
    async function fetchTransactions() {
      if (!isAuthenticated) return;

      try {
        const token = await getAccessTokenSilently({
          authorizationParams: { audience: `${AUDIENCE}` },
        });

        const res = await fetch(`${ROOTURL}/addtx/gettxs`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const allTxs: Transaction[] = await res.json();
        const userTxs = allTxs.filter((tx) => tx.auth0_id === user?.sub);

        const monthlyTotals: Record<
          string,
          { income: number; expense: number }
        > = {};

        userTxs.forEach((tx) => {
          const dateObj = new Date(tx.date);
          const key = `${(dateObj.getMonth() + 1)
            .toString()
            .padStart(2, "0")}/${dateObj.getFullYear()}`;

          if (!monthlyTotals[key]) {
            monthlyTotals[key] = { income: 0, expense: 0 };
          }

          const amount = Number(tx.amount);

          if (tx.type === "income") {
            monthlyTotals[key].income += amount;
          } else {
            monthlyTotals[key].expense += amount;
          }
        });

        const chartData = Object.entries(monthlyTotals).map(
          ([month, values]) => ({
            month,
            ...values,
          })
        );

        chartData.sort((a, b) => {
          const [am, ay] = a.month.split("/").map(Number);
          const [bm, by] = b.month.split("/").map(Number);
          return (
            new Date(ay, am - 1).getTime() - new Date(by, bm - 1).getTime()
          );
        });

        setMonthlyData(chartData);
      } catch (error) {
        console.error(
          "Error fetching transactions or generating chart data:",
          error
        );
      }
    }

    fetchTransactions();
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen px-6 py-4">
      <h1 className="text-2xl font-bold mb-4">Monthly Income vs Expense</h1>

      <div className="h-[500px]">
        {monthlyData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="income" fill="#4caf50" name="Income" />
              <Bar dataKey="expense" fill="#f44336" name="Expense" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-lg font-semibold animate-pulse">
              Loading chart or no data available.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BarChartPage;
