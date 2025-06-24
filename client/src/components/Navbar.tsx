import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Link, useLocation } from "react-router-dom";

const Navbar: React.FC = () => {
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();
  const location = useLocation();

  const linkClass = (path: string) =>
    `px-3 py-2 rounded-md text-sm font-medium transition ${
      location.pathname === path
        ? "bg-blue-100 text-blue-700"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
    }`;

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-white shadow-sm sticky top-0 z-50">
      <div className="text-xl font-bold text-gray-800">
        <Link to="/">💰 Finance App</Link>
      </div>

      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <>
            <Link to="/transactions" className={linkClass("/transactions")}>
              📄 Transactions
            </Link>
            <Link to="/barchart" className={linkClass("/barchart")}>
              📊 Bar Chart
            </Link>
            <Link to="/piechart" className={linkClass("/piechart")}>
              🥧 Pie Chart
            </Link>

            <Link to="/profile" className="flex items-center gap-2">
              {user?.picture && (
                <img
                  src={user.picture}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
              )}
              <span className="text-gray-700 hover:text-gray-900 text-sm font-medium">
                {user?.name || "Profile"}
              </span>
            </Link>

            <button
              onClick={() =>
                logout({ logoutParams: { returnTo: window.location.origin } })
              }
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => loginWithRedirect()}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
