import React, { useState } from "react";
import {
  ProSidebar,
  Menu,
  MenuItem,
  SidebarHeader,
  SidebarContent,
} from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import {
  FaTachometerAlt,
  FaMicrophone,
  FaUser,
  FaSignOutAlt,
  FaFileAlt,
  FaKeyboard,
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Sidebar = ({ onDashboardClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState(null);

  const handleLogout = () => {
    toast.info("Logging out...", {
      autoClose: 1200,
      position: "top-center",
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
    });

    document.body.classList.add("fade-out");
    localStorage.removeItem("token");

    setTimeout(() => {
      navigate("/login");
    }, 500);
  };

  const isActive = (path) => {
    if (path === "/dashboard") return location.pathname === "/dashboard";
    return location.pathname === path;
  };

  const menuItems = [
    { icon: FaTachometerAlt, label: "Dashboard", onClick: onDashboardClick, path: "/dashboard" },
    { icon: FaMicrophone, label: "Live Meeting", onClick: () => navigate("/livemeeting"), path: "/livemeeting" },
    { icon: FaKeyboard, label: "Transcribe", onClick: () => navigate("/transcribe"), path: "/transcribe" },
    { icon: FaFileAlt, label: "Summarize", onClick: () => navigate("/summary"), path: "/summary" },
    { icon: FaUser, label: "Profile", onClick: () => navigate("/profile"), path: "/profile" },
  ];

  return (
    <>
      <style>{`
        .pro-sidebar {
          background: linear-gradient(180deg, #ede9fe 0%, #ddd6fe 100%) !important;
          box-shadow: 4px 0 24px rgba(139, 92, 246, 0.15);
          border-right: 1px solid #c4b5fd;
        }
        
        .pro-sidebar > .pro-sidebar-inner {
          background: transparent !important;
        }
        
        .pro-sidebar .pro-sidebar-layout {
          background: transparent !important;
        }
        
        .pro-sidebar,
        .pro-sidebar * {
          box-sizing: border-box;
        }
        
        .pro-sidebar .pro-menu {
          padding-top: 0 !important;
          background: transparent !important;
        }
        
        .pro-sidebar .pro-menu-item {
          margin: 8px 12px;
          border-radius: 12px;
          transition: all 0.3s ease;
        }
        
        .pro-sidebar .pro-menu-item:hover {
          background: rgba(139, 92, 246, 0.08) !important;
          transform: translateX(4px);
        }
        
        .pro-sidebar .pro-menu-item.active {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(167, 139, 250, 0.1)) !important;
          border-left: 3px solid #8b5cf6;
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.15);
        }
        
        .pro-sidebar .pro-inner-item {
          padding: 12px 20px !important;
          color: #6b21a8 !important;
          font-weight: 500;
          font-size: 0.95rem;
        }
        
        .pro-sidebar .pro-menu-item.active .pro-inner-item {
          color: #6b21a8 !important;
          font-weight: 600;
        }
        
        .pro-sidebar .pro-icon-wrapper {
          background: rgba(139, 92, 246, 0.1) !important;
          border-radius: 10px;
          padding: 8px;
          margin-right: 12px;
          transition: all 0.3s ease;
        }
        
        .pro-sidebar .pro-menu-item:hover .pro-icon-wrapper {
          background: rgba(139, 92, 246, 0.2) !important;
          transform: scale(1.1);
        }
        
        .pro-sidebar .pro-menu-item.active .pro-icon-wrapper {
          background: rgba(139, 92, 246, 0.25) !important;
        }
        
        .pro-sidebar .pro-icon {
          color: #8b5cf6 !important;
          font-size: 1.1rem;
        }
        
        .pro-sidebar .pro-menu-item.active .pro-icon {
          color: #7c3aed !important;
        }
        
        .logout-item {
          margin-top: auto !important;
          border-top: 1px solid #c4b5fd;
          padding-top: 12px !important;
        }
        
        .logout-item:hover {
          background: rgba(239, 68, 68, 0.08) !important;
        }
        
        .logout-item .pro-icon-wrapper {
          background: rgba(239, 68, 68, 0.1) !important;
        }
        
        .logout-item:hover .pro-icon-wrapper {
          background: rgba(239, 68, 68, 0.2) !important;
        }
        
        .logout-item .pro-icon {
          color: #ef4444 !important;
        }
        
        .sidebar-header-custom {
          padding: 24px;
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(167, 139, 250, 0.08));
          border-bottom: 1px solid #c4b5fd;
          position: relative;
          overflow: hidden;
        }
        
        .sidebar-header-custom::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #8b5cf6, transparent);
        }
        
        .sidebar-logo {
          font-size: 1.4rem;
          font-weight: 700;
          color: #6b21a8;
          text-align: center;
          letter-spacing: 0.5px;
        }
        
        .sidebar-logo-subtitle {
          font-size: 0.75rem;
          color: #a78bfa;
          text-align: center;
          margin-top: 4px;
          font-weight: 500;
          letter-spacing: 1px;
        }
      `}</style>
      
      <ProSidebar 
        breakPoint="md" 
        style={{ 
          height: "100vh", 
          position: "fixed",
          background: "linear-gradient(180deg, #ede9fe 0%, #ddd6fe 100%)",
          boxShadow: "4px 0 24px rgba(139, 92, 246, 0.15)",
          borderRight: "1px solid #c4b5fd"
        }}
      >
        <SidebarHeader>
          <div className="sidebar-header-custom">
            <div className="sidebar-logo">StandNote.AI</div>
            <div className="sidebar-logo-subtitle">MEETING INTELLIGENCE</div>
          </div>
        </SidebarHeader>

        <SidebarContent style={{ paddingTop: "20px", paddingBottom: "20px", display: "flex", flexDirection: "column" }}>
          <Menu iconShape="circle">
            {menuItems.map((item, index) => (
              <MenuItem
                key={index}
                icon={<item.icon />}
                onClick={item.onClick}
                className={isActive(item.path) ? "active" : ""}
                onMouseEnter={() => setHoveredItem(index)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {item.label}
              </MenuItem>
            ))}
            
            <MenuItem 
              icon={<FaSignOutAlt />} 
              onClick={handleLogout}
              className="logout-item"
              style={{ marginTop: "auto" }}
            >
              Logout
            </MenuItem>
          </Menu>
        </SidebarContent>
      </ProSidebar>

      <ToastContainer />
    </>
  );
};

export default Sidebar;
