import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ThankYou: React.FC<{ onLogout?: () => void }> = ({ onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const answers = location.state?.answers || {};

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded-2xl">
      <h2 className="text-2xl font-bold mb-4 text-center">Thank You for Your Submission!</h2>
      <h3 className="text-lg font-semibold mb-2">Your Answers:</h3>
      <ul className="space-y-2 mb-4">
        {Object.entries(answers)
          .filter(([key]) => key !== "feedback")
          .map(([key, value]) => (
            <li key={key} className="bg-gray-100 p-2 rounded">
              <span className="font-semibold capitalize">{key}:</span> {String(value)}
            </li>
        ))}
      </ul>
      <div className="flex flex-col gap-2">
        <button
          className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition"
          onClick={() => navigate("/survey")}
        >
          Submit Another Response
        </button>
        <button
          className="bg-gray-300 text-gray-800 p-2 rounded-lg hover:bg-gray-400 transition"
          onClick={() => {
            if (onLogout) onLogout();
            navigate("/");
          }}
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default ThankYou;
