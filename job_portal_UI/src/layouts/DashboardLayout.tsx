import { useEffect, useState,} from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
function DashboardLayout({ children }: any) {
 const navigate = useNavigate()

  const [open, setOpen] = useState(true);
  // for users name and mail displaying
  const [user, SetUser] = useState<any>(null);
  // for avatar menu
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

  // logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${open ? "w-64" : "w-16"} bg-white border-r p-4`}>
        {/* Logo */}
        <div className="mb-6">
          <h2 className="font-bold text-lg">{open ? "Jobify" : "J"}</h2>
        </div>

        {/* Menu */}
        {/* --- ROLE BASED NAVIGATION --- */}
        <div className="space-y-2">
          
          {/* 1. EMPLOYER LINKS */}
          {user?.role === "employer" && (
            <>
              <button onClick={() => navigate("/employerDashboard")} className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-sm">
                📊 Dashboard
              </button>
              {/* <button onClick={() => navigate("/employer-dashboard")} className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-sm">
                👥 Applications
              </button> */}
              <button onClick={() => navigate("/createJob")} className="w-full text-left px-3 py-2 rounded hover:bg-violet-50 text-violet-700 font-medium text-sm">
                ➕ Post a Job
              </button>
            </>
          )}

          {/* 2. JOBSEEKER LINKS */}
          {user?.role === "jobseeker" && (
            <>
              <button onClick={() => navigate("/jobseeker-dashboard")} className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-sm">
                🏠 Dashboard
              </button>
              <button onClick={() => navigate("/my-applications")} className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-sm">
                📂 My Applications
              </button>
              <button onClick={() => navigate("/saved-jobs")} className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-sm">
                ⭐ Saved Jobs
              </button>
            </>
          )}

          {/* 3. COMMON LINKS (Profile) */}
          <button onClick={() => navigate("/profile")} className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-sm border-t mt-4">
            👤 Profile
          </button>
        </div>
      </div>
      

      {/* Main Area */}
      <div className="flex-1">
        {/* Topbar */}
        <div className="flex justify-between items-center bg-white border-b p-4">
          {/* Left */}
          {/* <button onClick={() => setOpen(!open)}>
              ☰
             </button> */}

          {/* Right */}
          <div className="flex items-center gap-3 ml-auto">
            {/* Avatar */}
            <div
              className="w-8 h-8 bg-blue-600 text-white flex items-center justify-center rounded-full"
              onClick={() => setOpenMenu(!openMenu)}
            >
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            {openMenu && (
              <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-lg border">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}

            <div>
              <p className="text-sm font-semibold">{user?.username}</p>
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
