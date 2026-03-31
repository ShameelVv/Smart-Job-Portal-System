import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/login/",
        {
          username,
          password
        }
      );

      localStorage.setItem("token", response.data.access);
      localStorage.setItem("role", response.data.role);
     
       // In your Login.tsx handleSubmit, after successful login:
      localStorage.setItem("username", response.data.username)
      localStorage.setItem("email", response.data.email)

      alert("Login successful");
           const userRole = response.data.role;
      if(userRole==="employer"){
        navigate("/employerDashboard");
      }else{
        navigate("/JobSeekerDashboard");
      }

    } catch (error) {
      alert("Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-purple-50 to-violet-100 relative overflow-hidden">

      {/* Decorative blobs — same as LandingPage */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-violet-300/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-24 w-72 h-72 rounded-full bg-purple-300/25 blur-3xl pointer-events-none" />

      <div className="relative z-10 bg-white/80 backdrop-blur-md shadow-xl shadow-violet-100 rounded-2xl p-8 w-full max-w-md border border-white/80">

        {/* Logo */}
        <div className="text-center mb-6">
          <span className="text-2xl font-extrabold text-violet-700 tracking-tight">Jobify</span>
          <h2 className="text-xl font-bold text-gray-800 mt-1">Welcome Back</h2>
          <p className="text-sm text-gray-400 mt-1" style={{ fontFamily: "Inter, sans-serif" }}>
            Login to continue your career journey
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="text-sm font-medium text-gray-600">Username</label>
            <input
              type="text"
              placeholder="Enter username"
              className="w-full mt-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent text-sm transition-all"
              value={username}
              onChange={(e)=>setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              className="w-full mt-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent text-sm transition-all"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-violet-700 text-white py-2.5 rounded-xl hover:bg-violet-800 transition-all font-semibold text-sm shadow-md shadow-violet-200 mt-2"
          >
            Login
          </button>

        </form>

        {/* Register link */}
        <p className="text-center text-sm text-gray-400 mt-5" style={{ fontFamily: "Inter, sans-serif" }}>
          Don't have an account?{" "}
          <a href="/register" className="text-violet-700 font-semibold hover:underline">
            Register
          </a>
        </p>

      </div>
    </div>
  );
}

export default Login;