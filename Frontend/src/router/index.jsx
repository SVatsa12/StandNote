// src/router/index.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import PrivateRoute from "../components/PrivateRoute";
import Profile from "../pages/Profile";
import SummarizationPage from "../pages/SummarizationPage";
import { Navigate } from "react-router-dom";
import TranscribePage from "../pages/TranscribePage";
import LiveMeetingPage from "../pages/LiveMeetingPage";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- Public Routes --- */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/summarize" element={<SummarizationPage />} />
        <Route path="/summary" element={<Navigate to="/summarize" replace />} />
        <Route path="/transcribe" element={<TranscribePage />} />
         <Route path="/livemeeting" element={<LiveMeetingPage />} />

        {/* --- Protected Routes --- */}
        {/*
          NOTE: We can use the newer "wrapper" syntax for react-router-dom v6
          to make this even cleaner. Both routes below are now protected.
        */}
        <Route element={<PrivateRoute />}>
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />
          <Route
            path="/profile"
            element={<Profile />} // ✅ THIS IS THE FIX
          />
        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;