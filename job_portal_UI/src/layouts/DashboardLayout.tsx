import { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import NotificationBell from "../components/NotificaionBell"

function DashboardLayout({ children }: any) {
  const navigate = useNavigate();

  const [notification, setNotification] = useState<string | null>(null);

  const [open, setOpen] = useState(true);
  const [user, SetUser] = useState<any>(null);
  const [openMenu, setOpenMenu] = useState(false);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("me/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      SetUser(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };
useEffect(() => {
  fetchUser();

  // ✅ Get token from localStorage
  const token = localStorage.getItem("token");
const socket = new WebSocket(`ws://127.0.0.1:8000/ws/notifications/?token=${token}`);

  socket.onopen = () => {
    console.log("WebSocket Connected ✅");
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    setNotification(data.message);
    setTimeout(() => setNotification(null), 5000)
    if ((window as any).refreshNotifications) {
    (window as any).refreshNotifications()
  }
  };

  socket.onerror = (error) => {
    console.error("WebSocket Error ❌", error);
  };

  return () => {
    if (
      socket.readyState === WebSocket.OPEN ||
      socket.readyState === WebSocket.CONNECTING
    ) {
      socket.close();
    }
  };
}, []);

  return (
    <div className="flex min-h-screen bg-violet-50">
      {/* Sidebar */}
      <div
        className={`${open ? "w-64" : "w-16"} bg-white/80 backdrop-blur-md border-r border-violet-100 p-4 shadow-sm`}
      >
        {/* Logo */}
        <div className="mb-6">
          <h2 className="font-extrabold text-lg text-violet-700 tracking-tight">
            {open ? "Jobify" : "J"}
          </h2>
        </div>

        {/* Menu */}
        <div className="space-y-2">
          {/* EMPLOYER */}
          {user?.role === "employer" && (
            <>
              <button
                onClick={() => navigate("/employerDashboard")}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-violet-50 text-sm text-gray-600 hover:text-violet-700 transition"
              >
                📊 Dashboard
              </button>

              <button
                onClick={() => navigate("/createJob")}
                className="w-full text-left px-3 py-2 rounded-lg bg-violet-50 text-violet-700 font-semibold text-sm border border-violet-100"
              >
                ➕ Post a Job
              </button>
              <button
                onClick={() => navigate("/profile")}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-violet-50 text-sm text-gray-600 hover:text-violet-700 transition border-t border-violet-100 mt-4 pt-4"
              >
                👤 Profile
              </button>
            </>
          )}

          {/* JOBSEEKER */}
          {user?.role === "jobseeker" && (
            <>
              <button
                onClick={() => navigate("/JobSeekerDashboard")}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-violet-50 text-sm text-gray-600 hover:text-violet-700 transition"
              >
                🏠 Dashboard
              </button>

              <button
                onClick={() => navigate("/my-applications")}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-violet-50 text-sm text-gray-600 hover:text-violet-700 transition"
              >
                📂 My Applications
              </button>
              <button
                onClick={() => navigate("/profile")}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-violet-50 text-sm text-gray-600 hover:text-violet-700 transition border-t border-violet-100 mt-4 pt-4"
              >
                👤 Profile
              </button>
            </>
          )}
          {user?.role === "admin" && (
            <>
              <button
                onClick={() => navigate("/adminUser")}
                className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-sm"
              >
                👤 Users
              </button>

              <button
                onClick={() => navigate("/adminJobs")}
                className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-sm"
              >
                💼 Jobs
              </button>

              <button
                onClick={() => navigate("/adminApplications")}
                className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-sm"
              >
                📄 Applications
              </button>
            </>
          )}

          {/* COMMON */}
        </div>
      </div>

      {/* Main */}
      <div className="flex-1">
        {/* Topbar */}
        <div className="flex justify-between items-center bg-white/80 backdrop-blur-md border-b border-violet-100 p-4 shadow-sm z-50 relative overflow-visible">
          {/* Right */}
          <div className="flex items-center gap-3 ml-auto relative z-50">
             <NotificationBell />
            {/* Avatar */}
            <div
              className="w-9 h-9 bg-gradient-to-br from-violet-700 to-purple-500 text-white flex items-center justify-center rounded-full text-sm font-bold cursor-pointer shadow-md shadow-violet-200"
              onClick={() => setOpenMenu(!openMenu)}
            >
              {user?.username?.charAt(0).toUpperCase()}
            </div>

            {openMenu && (
              <div className="absolute right-0 top-12 w-36 bg-white rounded-xl shadow-xl border border-violet-100 overflow-hidden">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-violet-50 hover:text-violet-700 transition"
                >
                  Logout
                </button>
              </div>
            )}
            {notification && (
              <div className="fixed top-5 right-5 bg-violet-600 text-white px-6 py-3 rounded-lg shadow-2xl animate-bounce z-50">
                🚀 {notification}
              </div>
            )}
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {user?.username}
              </p>
              <p className="text-xs text-gray-400">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export default DashboardLayout;
