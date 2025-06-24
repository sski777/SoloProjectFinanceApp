import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()}{" "}
        <span className="font-medium text-gray-700">Finance App</span>. All
        rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
