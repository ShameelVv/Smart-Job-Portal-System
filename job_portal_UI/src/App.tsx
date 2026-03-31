
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";

import LandingPage from "./pages/LandingPage";
import JobSeekerDashboard from "./pages/JobSeekerDashboard"
import EmployerDashboard from "./pages/EmployerDashboard";
import Applicants from "./pages/Applicants";
import CreateJob from "./pages/CreateJob";

function App() {


  return (
    <>
    <Routes>
        <Route path="/" element={<LandingPage/>} />
        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/JobSeekerDashboard" element={<JobSeekerDashboard />} />
        <Route path="/employerDashboard" element={<EmployerDashboard />} />
        <Route path="/applicants/:jobId" element={<Applicants/>} />
        <Route path="/createJob" element={<CreateJob/>} />
        
      </Routes>
     
    </>
  )
}

export default App
