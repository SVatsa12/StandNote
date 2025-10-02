import React from "react";
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
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Sidebar = ({ onDashboardClick }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Show toast
    toast.info("Logging out...", {
      autoClose: 1200,
      position: "top-center",
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
    });

    // Add fade-out class
    document.body.classList.add("fade-out");

    // Clear token
    localStorage.removeItem("token");

    // Navigate after 0.5s
    setTimeout(() => {
      navigate("/login");
    }, 500);
  };

  return (
    <>
      <ProSidebar breakPoint="md" style={{ height: "100vh", position: "fixed" }}>
        <SidebarHeader
          style={{
            padding: "24px",
            fontSize: "1.2rem",
            fontWeight: "bold",
            background: "#4F46E5",
            color: "#fff",
            textAlign: "center",
          }}
        >
          StandNote.AI
        </SidebarHeader>

        <SidebarContent style={{ paddingTop: "20px" }}>
          <Menu iconShape="circle">
            <MenuItem icon={<FaTachometerAlt />} onClick={onDashboardClick}>
              Dashboard
            </MenuItem>

            <MenuItem icon={<FaMicrophone />} onClick={() => navigate("/livemeeting")}>
              Live Meeting
            </MenuItem>

            <MenuItem icon={<FaKeyboard />} onClick={() => navigate("/transcribe")}>
              Transcribe
            </MenuItem>

            <MenuItem icon={<FaFileAlt />} onClick={() => navigate("/summary")}>
              Summarize
            </MenuItem>

            <MenuItem icon={<FaUser />} onClick={() => navigate("/profile")}>
              Profile
            </MenuItem>

            <MenuItem icon={<FaSignOutAlt />} onClick={handleLogout}>
              Logout
            </MenuItem>
          </Menu>
        </SidebarContent>
      </ProSidebar>

      {/* Toast container once per app */}
      <ToastContainer />
    </>
  );
};

export default Sidebar;
