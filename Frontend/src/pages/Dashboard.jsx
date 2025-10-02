// src/pages/Dashboard.jsx
import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import DashboardContent from "../components/DashboardContent";
import AnimatedText from "../components/AnimatedText";



const Dashboard = () => {
  const [showDashboard, setShowDashboard] = useState(false);

  return (
    <div className="flex">
      <Sidebar onDashboardClick={() => setShowDashboard(true)} />

      <div className="flex-1 ml-64 bg-gray-100 min-h-screen">
        <main className="p-8">
          {!showDashboard ? (
            <div className="h-screen flex flex-col items-center justify-center bg-transparent text-center">
              <AnimatedText text="Live. Transcribe. Summarize" />
            </div>
          ) : (
            <div className="flex flex-col gap-12">
              <DashboardContent />
               {/* ✅ Added here */}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
