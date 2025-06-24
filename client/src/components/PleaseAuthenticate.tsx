import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { User } from "@auth0/auth0-react";

const AuthStatusPage: React.FC = () => {
  const { isAuthenticated, loginWithRedirect, logout, user, isLoading } =
    useAuth0();
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl text-gray-600 animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-200 px-4">
      <div className="bg-white shadow-2xl rounded-3xl p-10 text-center max-w-lg w-full border border-orange-300">
        {!isAuthenticated ? (
          <>
            <h1 className="text-4xl font-bold text-gray-800 mb-3">
              Welcome to Your Personal Finance App! 💸
            </h1>
            <p className="text-gray-600 mb-6">
              Please log in to access The Website.
            </p>
            <button
              onClick={() => loginWithRedirect()}
              className="bg-orange-500 hover:bg-orange-600 transition-colors text-white font-semibold px-6 py-3 rounded-xl shadow-md"
            >
              Log In
            </button>
          </>
        ) : (
          <>
            <h1 className="text-4xl font-bold text-gray-800 mb-3">
              You're Logged In 🎉
            </h1>
            <p className="text-gray-600 mb-2">
              Welcome back,{" "}
              <span className="font-semibold text-orange-600">
                {user?.name}
              </span>
              !
            </p>
            <p className="text-gray-500 mb-6 text-sm">Email: {user?.email}</p>
            <button
              onClick={() =>
                logout({ logoutParams: { returnTo: window.location.origin } })
              }
              className="bg-red-500 hover:bg-red-600 transition-colors text-white font-semibold px-6 py-3 rounded-xl shadow-md"
            >
              Log Out
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthStatusPage;
