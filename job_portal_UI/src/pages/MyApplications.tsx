import { useEffect, useState } from "react";
import api from "../api/api";
import DashboardLayout from "../layouts/DashboardLayout";
import ApplicationCard from "../components/ApplicationCard";

interface Application {
  id: number;
  job_title: string;
  status: string;
  applied_on: string;
  company: string;
}

function MyApplications() {

  const [search,setSearch] = useState("")
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get('applications/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const searchJobs = applications.filter((app)=>
    app.job_title.toLowerCase().includes(search.toLowerCase()) ||
    app.company.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    fetchApplications();
  }, []);

  return (
    <DashboardLayout>

      {/* Heading */}
      <h1 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight">
        My <span className="text-violet-700">Applications</span>
      </h1>

      {/* Search */}
      <div className="flex justify-end mb-6">
        <input
          type="text"
          placeholder="Search by job or company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-1/3 px-4 py-2 rounded-xl border border-violet-100 bg-white/80 backdrop-blur-md text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-300 shadow-sm"
        />
      </div>

      {/* Loading */}
      {loading ? (
        <p className="text-gray-500 text-sm">Loading your applications...</p>
      ) : applications.length > 0 ? (

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {searchJobs.map((app: Application) => (
            <ApplicationCard key={app.id} app={app} />
          ))}
        </div>

      ) : (

        <div className="text-center py-20 bg-white/70 backdrop-blur-md rounded-2xl border border-violet-100 shadow-sm">
          <p className="text-gray-500">
            You haven't applied to any jobs yet.
          </p>
        </div>

      )}

    </DashboardLayout>
  );
}

export default MyApplications;