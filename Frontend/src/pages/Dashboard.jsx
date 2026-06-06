// src/pages/Dashboard.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardContent from "../components/DashboardContent";
import DashboardOverview from "../components/dashboard/DashboardOverview";
import { LayoutDashboard, Layers, LogOut } from "lucide-react";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-[#f8faff] text-slate-800 overflow-hidden relative">
      {/* Soft Pastel Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-300/40 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[10%] w-[50%] h-[50%] bg-blue-300/40 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-violet-200/50 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Logout Button */}
      <div className="absolute top-6 right-8 z-50">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-slate-500 hover:text-red-500 font-semibold transition-colors bg-white/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/50 shadow-sm hover:bg-white/80"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>

      <div className="flex-1 p-6 pt-16 pb-28 overflow-y-auto relative z-10">
        {activeTab === "overview" ? (
          <DashboardOverview />
        ) : (
          <div className="flex flex-col gap-12">
            <DashboardContent />
          </div>
        )}
        
        {/* Bottom Tab Navigation */}
        <div className="fixed bottom-6 left-0 right-0 flex justify-center items-center gap-3 z-50">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
              activeTab === "overview"
                ? "bg-[#7c3aed] text-white shadow-md"
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-100/50 bg-white/80 border border-white shadow-sm"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab("cards")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
              activeTab === "cards"
                ? "bg-[#7c3aed] text-white shadow-md"
                : "text-slate-500 hover:text-slate-800 hover:bg-slate-100/50 bg-white/80 border border-white shadow-sm"
            }`}
          >
            <Layers className="w-4 h-4" />
            Meeting Cards
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
