import DashboardLayout from "../layouts/DashboardLayout";
import JobCard from "../components/JobCard";
import { useEffect, useState } from "react";
import api from "../api/api"

interface Job {
  id: number;
  title: string;
  company_name: string;
  category_name: string;
  job_type: string;
  skills: string[];
  salary: string;
  location: string;
}

function JobseekerDashboard() {

  const [search,setSearch] = useState("")
  const [jobs,setJobs]=useState<Job[]>([]);
  const [applications,setApplications]=useState([]);
  const [user,SetUser] = useState<any>(null);

  const fetchUser = async()=>{
    try{
      const token = localStorage.getItem("token");
      const res = await api.get("me/",{
        headers:{ Authorization : `Bearer ${token}` },
      });
      SetUser(res.data);
    }catch(err){
      console.log(err)
    }
  }

  const searchJobs = jobs.filter((job)=>
    job.title.toLowerCase().includes(search.toLowerCase()) ||
    job.company_name.toLowerCase().includes(search.toLowerCase())
  )

  const fetchJobs = async()=>{
    try{
      const res=await api.get('jobs/');
      setJobs(res.data);
    }catch(err){
      console.log(err)
    }
  }

  const fetchApplications = async() => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get('applications/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(res.data);
    } catch(err) {
      console.log(err);
    }
  }

  const applyJob = async (jobId: number, file: File | null) => {
    if (!file) {
      alert("Please select a resume file first!");
      return;
    }

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("job", jobId.toString());
    formData.append("resume", file);

    try {
      await api.post("jobs/apply/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Applied Successfully!");
      fetchApplications();
    } catch (err) {
      console.error(err);
      alert("Failed to apply. Check if you already applied for this job.");
    }
  };

  const hasApplied = (jobId: number) => {
    return applications.some((app: any) => app.job === jobId);
  };

  useEffect(()=>{
    fetchJobs();
    fetchApplications();
    fetchUser();
  },[])

  return (
    <DashboardLayout>

      {/* Heading */}
      <h1 className="text-2xl font-bold text-gray-900 mb-10 tracking-tight">
        Welcome back, <span className="text-violet-700">{user?.username}</span> 👋
      </h1>

      {/* Jobs Section */}
      <div className="mb-10">

        <div className="flex justify-between gap-10 items-center mb-4">
          
          <h2 className="text-xl font-semibold text-gray-800">
            Available Jobs
          </h2>

          <input
            type="text"
            placeholder="Search by job or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-1/3 px-4 py-2 rounded-xl border border-violet-100 bg-white/80 backdrop-blur-md text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-300 shadow-sm"
          />
        </div>

        {/* Job Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {searchJobs.map((job : any)=>(
            <JobCard
              key={job.id}
              job={job}
              onApply={applyJob}
              isApplied={hasApplied(job.id)}
            />
          ))}
        </div>

      </div>

    </DashboardLayout>
  );
}

export default JobseekerDashboard;