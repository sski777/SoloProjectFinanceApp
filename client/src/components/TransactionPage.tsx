import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { isRouteErrorResponse, Link } from "react-router-dom";
import type { Transaction } from "../types";
const ROOTURL = import.meta.env.VITE_ROOT_URL;
const AUDIENCE = import.meta.env.VITE_AUTH0_AUDIENCE;
const TransactionsPage: React.FC = () => {
  const { getAccessTokenSilently, user, isAuthenticated } = useAuth0();
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filters, setFilters] = useState({
    type: "All",
    month: "",
    year: "",
  });

  useEffect(() => {
    async function GetTxs(): Promise<void> {
      if (!isAuthenticated) {
        return;
      }
      // the function shouldnt actually return something and it is a async function so we will be dealing with promises
      const gettoken = await getAccessTokenSilently({
        authorizationParams: {
          audience: `${AUDIENCE}`,
        },
      });
      const options = {
        method: "GET",
        headers: { Authorization: `Bearer ${gettoken}` },
      };
      fetch(ROOTURL + "/addtx/gettxs", options)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Request Could Not Be Processed!");
          }
          return response.json();
        })
        .then((data) => {
          const onlyusertransactions = [];
          //console.log(user?.sub);
          //console.log(isAuthenticated);
          for (let i = 0; i < data.length; i++) {
            let variable = data[i];
            if (variable.auth0_id === user?.sub) {
              onlyusertransactions.push(variable);
            }
          }
          setTransactions(onlyusertransactions);
          setAllTransactions(onlyusertransactions);
          //console.log("Transactions Have Been Retrieved!");
        })
        .catch((error) => {
          alert(error.message);
        });
    }
    GetTxs(); // will run the function
  }, [isAuthenticated]);

  useEffect(() => {
    const newarrayfilters = [];
    for (const transaction of allTransactions) {
      const { category, date } = transaction;

      const typeMatch = filters.type === "All" || category === filters.type;

      let monthMatch = true;
      let yearMatch = true;

      if (date) {
        const year = date.slice(0, 4);
        const month = date.slice(6, 7);

        if (filters.month) {
          monthMatch = month === filters.month;
        }

        if (filters.year) {
          yearMatch = year === filters.year;
        }
      }

      if (typeMatch && monthMatch && yearMatch) {
        newarrayfilters.push(transaction);
      }
    }
    setTransactions(newarrayfilters);
  }, [filters, allTransactions]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Transactions</h1>
      <div className="flex gap-4 mb-4">
        <select
          onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}
        >
          <option value="All">All</option>
          <option value="Food">Food</option>
          <option value="Rent">Rent</option>
          <option value="Salary">Salary</option>
          <option value="Transport">Transport</option>
          <option value="Shopping">Shopping</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Utilities">Utilities</option>
          <option value="Other">Other</option>
        </select>
        <input
          type="number"
          placeholder="Month"
          min="1"
          max="12"
          onChange={(e) => setFilters((f) => ({ ...f, month: e.target.value }))}
        />
        <input
          type="number"
          placeholder="Year"
          onChange={(e) => setFilters((f) => ({ ...f, year: e.target.value }))}
        />
      </div>
      <ul className="space-y-2">
        {transactions.map((tx: any) => (
          <li key={tx.id} className="border p-2 rounded">
            <div className="flex justify-between items-center">
              <Link to="/rendertask" state={{ id: tx.id }}>
                {tx.description}
              </Link>
              <Link
                className={`font-bold ${
                  tx.type === "income" ? "text-green-600" : "text-red-500"
                }`}
                to="/rendertask"
                state={{ id: tx.id }}
              >
                ${tx.amount}
              </Link>
            </div>

            {tx.note && (
              <Link
                className="text-sm text-gray-600 italic"
                to="/rendertask"
                state={{ id: tx.id }}
              >
                📝 {tx.note}
              </Link>
            )}

            <div className="text-sm text-gray-500">
              {tx.category} | {new Date(tx.date).toLocaleDateString()} |{" "}
              <Link
                className={`uppercase font-semibold ${
                  tx.type === "income" ? "text-green-500" : "text-red-400"
                }`}
                to="/rendertask"
                state={{ id: tx.id }}
              >
                {tx.type}
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionsPage;
