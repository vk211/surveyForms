import React from "react";
import { Link } from "react-router-dom";

const Home: React.FC = () => (
  <div className="max-w-xl mx-auto p-6 bg-white shadow rounded-2xl text-center">
    <h2 className="text-2xl font-bold mb-4">Welcome to the Waterlily Survey Form</h2>
    <p className="mb-6 text-gray-700">
      This survey collects demographic, health, and financial information to help us predict long-term care needs and costs. Your responses are confidential and will be used to improve our services.
    </p>
    <div className="flex justify-center gap-4">
      <Link to="/signup" className="inline-block px-4 py-2 rounded font-semibold text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white transition">Sign Up</Link>
      <Link to="/signin" className="inline-block px-4 py-2 rounded font-semibold text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white transition">Sign In</Link>
    </div>
  </div>
);

export default Home;
