import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../api/api";
import EmployerJobCard from "../components/EmployersJobCard";


function EmployerDashboard() {

    const [jobs,setJobs]=useState([]);

     // for users name and mail displaying
  const [user,SetUser] = useState<any>(null);

  const fetchUser = async()=>{
    try{
      const token = localStorage.getItem("token");
      const res = await api.get("me/",{
        headers:{
          Authorization : `Bearer ${token}`,
        },
      });
      SetUser(res.data);
    }catch(err){
      console.log(err)
    }
  }

  const fetchJob=async()=>{
    try{
      const res=await api.get('jobs/');
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

      <h1 className="text-2xl font-semibold mb-6">
        welcome back, {user?.username} 👋
      </h1>

      {/* My Jobs */}
      <div>
        <h2 className="text-xl mb-3">My Jobs</h2>
        <div className="grid grid-cols-3 gap-4">
          {jobs.map((job:any)=>(
            <EmployerJobCard key={job.id} job={job}/>
          ))}
        </div>
      </div>

    </DashboardLayout>
  );
}

export default EmployerDashboard;