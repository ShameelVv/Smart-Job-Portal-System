import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../api/api";
import EmployerJobCard from "../components/EmployersJobCard";

function EmployerDashboard() {

  const [jobs,setJobs]=useState([]);
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

  const fetchJob=async()=>{
    try{
      const token = localStorage.getItem("token");
      const res=await api.get('jobs/',{
        headers:{ Authorization :`Bearer ${token}` }
      })
      setJobs(res.data);
    }catch(err){
      console.log(err)
    }
  }

  useEffect(()=>{
    fetchUser();
    fetchJob();
  },[])

  return (
    <DashboardLayout>

      {/* Heading */}
      <h1 className="text-2xl font-bold text-gray-900 mb-8 tracking-tight">
        Welcome back, <span className="text-violet-700">{user?.username}</span> 👋
      </h1>

      {/* Jobs Section */}
      <div className="bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-lg shadow-violet-100 border border-violet-100">

        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold text-gray-800">
            My Jobs
          </h2>

          {/* Optional CTA */}
          {/* <button
            onClick={() => window.location.href = "/createJob"}
            className="bg-violet-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-violet-800 transition shadow-md shadow-violet-200"
          >
            + Post Job
          </button> */}
        </div>

        {/* Empty State */}
        {jobs.length === 0 && (
          <p className="text-gray-500 text-sm">
            You haven’t posted any jobs yet.
          </p>
        )}

        {/* Jobs Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job:any)=>(
            <EmployerJobCard key={job.id} job={job}/>
          ))}
        </div>

      </div>

    </DashboardLayout>
  );
}

export default EmployerDashboard;