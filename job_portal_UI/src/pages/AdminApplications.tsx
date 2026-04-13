import { useEffect, useState } from "react";
import api from "../api/api";
import DashboardLayout from "../layouts/DashboardLayout";


function AdminApplications() {

  const [apps, setApps] = useState<any[]>([]);

  useEffect(() => {
    fetchApps();
  }, []);

  

  const fetchApps = async () => {
    const token = localStorage.getItem("token");

    const res = await api.get("admin/applications/", {
      headers: { Authorization: `Bearer ${token}` }
    });

    setApps(res.data);
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-semibold mb-6">Applications</h1>

      {apps.map((app) => (
        <div key={app.id} className="bg-white p-4 mb-2 rounded shadow">
          <p className="font-semibold">{app.job_title}</p>
          <p className="text-sm text-gray-500">{app.company}</p>
          <p className="text-sm text-gray-500">{app.applicant_name}</p>
          <p className="text-sm text-gray-500">{app.applicant_email}</p>
          <p className="text-sm">Status: {app.status}</p>
        </div>
      ))}
    </DashboardLayout>
  );
}

export default AdminApplications;