// App.tsx
// Main entry point for the survey frontend


import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import SurveyForm from './components/SurveyForm';
import SurveyReview from './components/SurveyReview';
import Signup from './components/Signup';
import Signin from './components/Signin';
import Home from './components/Home'; // Import Home component
import ThankYou from './components/ThankYou';

const ProtectedRoute: React.FC<{ isAuth: boolean; children: React.ReactNode }> = ({ isAuth, children }) => {
  return isAuth ? <>{children}</> : <Navigate to="/signin" replace />;
};

const App: React.FC = () => {
  const [isAuth, setIsAuth] = useState(() => !!localStorage.getItem("jwtToken"));
  const [userEmail, setUserEmail] = useState(() => localStorage.getItem("userEmail") || "");
  const [jwtToken, setJwtToken] = useState<string | null>(() => localStorage.getItem("jwtToken"));

  const handleSignup = (email: string, password: string) => {
    setIsAuth(false); // Do not authenticate on signup
    setUserEmail("");
    setJwtToken(null);
    localStorage.removeItem("userEmail");
    localStorage.removeItem("jwtToken");
  };
  const handleSignin = (email: string, password: string, token: string) => {
    setIsAuth(true);
    setUserEmail(email);
    setJwtToken(token);
    localStorage.setItem("userEmail", email);
    localStorage.setItem("jwtToken", token);
  };
  const handleLogout = () => {
    setIsAuth(false);
    setUserEmail("");
    setJwtToken(null);
    localStorage.removeItem("userEmail");
    localStorage.removeItem("jwtToken");
  };

  return (
    <Router>
      <nav className="flex justify-end p-4">
        {isAuth && (
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg">Logout</button>
        )}
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup onSignup={handleSignup} />} />
        <Route path="/signin" element={<Signin onSignin={handleSignin} />} />
        <Route path="/survey" element={
          <ProtectedRoute isAuth={isAuth}>
            <SurveyForm userEmail={userEmail} jwtToken={jwtToken} />
          </ProtectedRoute>
        } />
        <Route path="/thankyou" element={<ThankYou onLogout={handleLogout} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
