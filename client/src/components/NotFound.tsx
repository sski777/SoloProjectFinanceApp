import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-12">
      <div className="max-w-3xl w-full flex flex-col items-center text-center space-y-6">
        <img
          src="/notfoundimg.png"
          alt="Not Found Illustration"
          className="w-72 md:w-96"
        />

        <h1 className="text-5xl font-extrabold text-gray-800">
          Page Not Found
        </h1>
        <p className="text-lg text-gray-600 max-w-md">
          The page you're looking for doesn’t exist or has been moved. Maybe try
          heading back to the homepage?
        </p>

        <Link
          to="/"
          className="inline-block px-6 py-3 bg-black text-white text-lg font-medium rounded-lg hover:bg-gray-800 transition"
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
