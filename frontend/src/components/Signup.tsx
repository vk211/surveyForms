import React, { useState } from "react";
import { Link } from "react-router-dom";

const Signup: React.FC<{ onSignup: (email: string, password: string) => void }> = ({ onSignup }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");
    if (!email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    try {
      console.log('Backend URL:', import.meta.env.VITE_BACKEND_URL);
      console.log('Making request to:', `${import.meta.env.VITE_BACKEND_URL}/api/signup`);
      
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      console.log('Response status:', res.status);
      console.log('Response:', res);
      
      if (res.status === 201) {
        setSuccess("Signup successful! You can now sign in.");
        onSignup(email, password);
      } else {
        const data = await res.json();
        console.log('Error response data:', data);
        setError(data.message || "Signup failed");
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError(`Network error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white shadow rounded-2xl space-y-5">
      <h2 className="text-2xl font-bold text-center">New user?</h2>
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
      <input
        type="password"
        placeholder="Confirm Password"
        className="w-full p-2 border rounded-lg"
        value={confirmPassword}
        onChange={e => setConfirmPassword(e.target.value)}
        required
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {success && <p className="text-green-600 text-sm">{success}</p>}
      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition">
        Sign Up
      </button>
      <div className="text-center mt-4">
        <span className="text-gray-600">Already have an account? </span>
        <Link to="/signin" className="text-blue-600 hover:underline">Sign in here</Link>
      </div>
    </form>
  );
};

export default Signup;
