import { useEffect, useState } from "react";
import api from "../api/api";
import DashboardLayout from "../layouts/DashboardLayout";

function AdminJobs() {
  const [jobs, setJobs] = useState<any[]>([]);

  //   for deleting
  const dltUser = async (jobId: number) => {
    const token = localStorage.getItem("token");
    try {
      await api.delete(
        `admin/delete-job/${jobId}/`,
    
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      alert("Job has been deleted");
      fetchJobs();
    } catch (err) {
      console.error("failed to delete the job");
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const token = localStorage.getItem("token");

    const res = await api.get("admin/jobs/", {
      headers: { Authorization: `Bearer ${token}` },
    });

    setJobs(res.data);
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-semibold mb-6">Jobs</h1>

      {jobs.map((job) => (
        <div
          key={job.id}
          className="bg-white p-4 mb-2 rounded shadow flex justify-between"
        >
          <div>
            <p className="font-semibold">{job.title}</p>
            <p className="text-sm text-gray-500">{job.company_name}</p>
          </div>

          <button className="text-red-500 text-sm"
          onClick={()=>dltUser(job.id)}>Delete</button>
        </div>
      ))}
    </DashboardLayout>
  );
}

export default AdminJobs;
