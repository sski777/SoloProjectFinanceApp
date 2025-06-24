import React from "react";
import { useState, useEffect } from "react";
import type { Transaction } from "../types";
import { useLocation, Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
const AUDIENCE = import.meta.env.VITE_AUTH0_AUDIENCE;
const ROOTURL = import.meta.env.VITE_ROOT_URL;
const RenderTask: React.FC = () => {
  const { getAccessTokenSilently } = useAuth0();
  let location = useLocation();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [userederict, setUseRederict] = useState<boolean>(false);
  useEffect(() => {
    async function GetTaskWithId() {
      let stateobject = location.state;
      if (stateobject == undefined) {
        return setUseRederict(true);
      }
      let getid = stateobject.id;
      const gettoken = await getAccessTokenSilently({
        authorizationParams: {
          audience: `${AUDIENCE}`,
        },
      });
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${gettoken}`,
        },
        body: JSON.stringify({ id: getid }),
      };
      fetch(ROOTURL + "/addtx/getonetx", options)
        .then((response) => {
          if (!response.ok) {
            // checking meta data of response
            throw new Error(`${response}`);
          }
          return response.json();
        })
        .then((data) => {
          setTransaction(data[0]);
        })
        .catch((error) => {
          alert(error.message);
        });
    }
    GetTaskWithId();
  }, []);

  if (userederict) {
    return <Navigate to="*"></Navigate>;
  }
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Task Details
        </h1>
        {transaction ? (
          <div className="space-y-3 border border-gray-200 bg-white p-6 rounded-lg shadow-md">
            <p>
              <span className="font-semibold text-gray-700">Type:</span>{" "}
              {transaction.type}
            </p>
            <p>
              <span className="font-semibold text-gray-700">Amount:</span> $
              {transaction.amount}
            </p>
            <p>
              <span className="font-semibold text-gray-700">Category:</span>{" "}
              {transaction.category}
            </p>
            <p>
              <span className="font-semibold text-gray-700">Date:</span>{" "}
              {new Date(transaction.date).toLocaleDateString()}
            </p>
            {transaction.note && (
              <p>
                <span className="font-semibold text-gray-700">Note:</span>{" "}
                {transaction.note}
              </p>
            )}
          </div>
        ) : (
          <p className="text-gray-500 text-center">Loading task...</p>
        )}
      </div>
    </div>
  );
};

export default RenderTask;
