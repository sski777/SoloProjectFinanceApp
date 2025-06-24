import { useState, useTransition } from "react";
import type { TransactionType, Transaction } from "../types/index";
import { v4 as uuidv4 } from "uuid";
import { useAuth0 } from "@auth0/auth0-react";
const serverurl = import.meta.env.VITE_ROOT_URL;
const audience = import.meta.env.VITE_AUTH0_AUDIENCE;
const categories = [
  "Food",
  "Rent",
  "Salary",
  "Transport",
  "Shopping",
  "Entertainment",
  "Utilities",
  "Other",
];

const MainPageComponent: React.FC = () => {
  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState<string>("");
  const [category, setCategory] = useState<string>(categories[0]);
  const [note, setNote] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const { user, getAccessTokenSilently, loginWithRedirect } = useAuth0();

  const handleSubmit = async () => {
    const change = parseInt(amount);
    if (change < 0) {
      setAmount("");
      setError(true);
      setTimeout(() => setError(false), 2000);
      return;
    }
    if (!amount || !category) {
      setAmount("");
      setError(true);
      setTimeout(() => setError(false), 2000);
      return;
    }
    // create the new tx to go into our table with the transaction type from the index.tsx file
    const newTx: Transaction = {
      auth0_id: user?.sub, // user object could be undefined if the user ends up on thisp age unauthenticated
      type,
      amount: parseFloat(amount),
      category,
      note,
      date: new Date().toISOString(),
    };

    const gettoken = await getAccessTokenSilently({
      authorizationParams: {
        audience: `${audience}`,
      },
    }); // async function wait for line to return promise
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${gettoken}`,
      },
      body: JSON.stringify(newTx), // send the transaction as a parsed JSON object
    };
    fetch(serverurl + "/addtx", options)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Request Could Not Be Processed!");
        }
        return response.json();
      })
      .then((data) => {
        setSubmitted(true);

        // Reset form after submission
        setAmount("");
        setNote("");
        setType("expense");
        setCategory(categories[0]);

        setTimeout(() => setSubmitted(false), 2000);
      })
      .catch((error) => {
        alert(error.message);
        setAmount("");
      });
  };

  return (
    <div className="w-screen h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-lg space-y-6">
        <h1 className="text-3xl font-bold text-center">💸 New Transaction</h1>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <select
              value={type}
              onChange={(e) => setType(e.target.value as TransactionType)}
              className="border px-3 py-2 rounded w-full"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>

            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border px-3 py-2 rounded w-full"
            />
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border px-3 py-2 rounded w-full"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Note (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="border px-3 py-2 rounded w-full"
          />

          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Add Transaction
          </button>

          {submitted && (
            <div className="text-green-600 text-center font-medium">
              ✅ Transaction submitted!
            </div>
          )}
          {error && (
            <div className="text-red-600 text-center font-medium">
              ❌ Transaction Failed!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainPageComponent;
