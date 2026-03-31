import DashboardLayout from "../layouts/DashboardLayout";
import JobCard from "../components/JobCard";
import ApplicationCard from "../components/ApplicationCard";
import { useEffect, useState } from "react";
import api from "../api/api"


interface Job {
  id: number;
  title: string;
  company_name: string; // Use the name, not the ID
  category_name: string; // Use the name, not the ID
  job_type: string;
  skills: string[]; // This is now a list of strings
  salary: string;
  location: string;
}

function JobseekerDashboard() {

  // state for jobs
  const [jobs,setJobs]=useState<Job[]>([]);
  // state for application
  const [applications,setApplications]=useState([]);

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



  // to fetch jobs
  const fetchJobs = async()=>{
    try{
      const res=await api.get('jobs/');
      setJobs(res.data);
    }catch(err){
      console.log(err)
    }
  }

  //  to fetch applications
  const fetchApplications = async() => {
  try {
    const token = localStorage.getItem("token"); // Get the token
    const res = await api.get('applications/', {
      headers: {
        Authorization: `Bearer ${token}`, // Show the ID card to Django
      },
    });
    setApplications(res.data);
  } catch(err) {
    console.log(err);
  }
}

  // to apply job
 const applyJob = async (jobId: number, file: File | null) => {
  if (!file) {
    alert("Please select a resume file first!");
    return;
  }

  const token = localStorage.getItem("token");
  
  // Use FormData to send files to Django
  const formData = new FormData();
  formData.append("job", jobId.toString());
  formData.append("resume", file);

  try {
    await api.post("jobs/apply/", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data", // Required for file uploads
      },
    });

    alert("Applied Successfully!");
    fetchApplications(); // Refresh the applications list below
  } catch (err) {
    console.error(err);
    alert("Failed to apply. Check if you already applied for this job.");
  }
};

// logic for appied to change to already applied

const hasApplied = (jobId: number) => {
  // Check if any application in the list matches this jobId
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
      <h1 className="text-2xl font-bold text-gray-800 mb-10">
        Welcome back, {user?.username} 👋
      </h1>

      {/* Recommended Jobs */}
      <div className="mb-10">

        <h2 className="text-xl font-medium text-gray-700 mb-4">
          Available Jobs
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

          {jobs.map((job:any)=>(
            <JobCard key={job.id} job={job} onApply={applyJob}
            isApplied={hasApplied(job.id)}/>
          ))}

        </div>

      </div>

      {/* My Applications */}
      <div>

        <h2 className="text-xl font-medium text-gray-700 mb-4">
          My Applications
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

          {applications.map((app:any)=>(
            <ApplicationCard key={app.id} app={app}/>
          ))}

        </div>

      </div>

    </DashboardLayout>
  );
}

export default JobseekerDashboard;