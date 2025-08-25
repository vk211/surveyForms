import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Signin: React.FC<{ onSignin: (email: string, password: string, token: string) => void }> = ({ onSignin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }
    setError("");
    try {
      const res = await fetch("http://localhost:3000/api/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        const data = await res.json();
        setSuccess("Signin successful!");
        onSignin(email, password, data.token);
        navigate("/survey");
      } else {
        const data = await res.json();
        setError(data.message || "Signin failed");
      }
    } catch (err) {
      setError("Signin failed. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white shadow rounded-2xl space-y-5">
      <h2 className="text-2xl font-bold text-center">Existing User</h2>
      <input
        type="email"
        placeholder="Email"
        className="w-full p-2 border rounded-lg"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full p-2 border rounded-lg"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {success && <p className="text-green-600 text-sm">{success}</p>}
      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition">
        Sign In
      </button>
      <div className="text-center mt-4">
        <span className="text-gray-600">New user? </span>
        <Link to="/signup" className="text-blue-600 hover:underline">Sign up here</Link>
      </div>
    </form>
  );
};

export default Signin;
