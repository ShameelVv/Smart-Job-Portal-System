import { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

function Register() {
  
  const navigate = useNavigate();


  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("jobseeker");

  const [companyName, setCompanyName] = useState("");

  // for categories
  const [categories, setCategories] = useState<any[]>([]);
  const [preferredCategory, setPreferredCategory] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get("job-categories/");
      setCategories(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
     const data:any={
      username,
      email,
      password,
      role
     };
     if (role==="jobseeker"){
      data.preferred_category = preferredCategory;
     }
     if (role==="employer"){
      data.company_name = companyName
     }
      const response = await api.post("register/",data)

      alert("Registration successful");
      // for redirecting to respective dashboard after registering
      const userRole = response.data.role;
      if(userRole==="employer"){
        navigate("/login");
      }else{
        navigate("/login");
      }
    } catch (error: any) {
      alert("Registration failed");
      // Log the actual error from Django to see exactly what failed
      console.log("Django Error Details:", error.response?.data);
      alert("Registration failed: " + JSON.stringify(error.response?.data));
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
          <span className="text-2xl font-extrabold text-violet-700 tracking-tight">
            Jobify
          </span>
          <h2 className="text-xl font-bold text-gray-800 mt-1">
            Create Account
          </h2>
          <p
            className="text-sm text-gray-400 mt-1"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Start your career journey today
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600">
              Username
            </label>
            <input
              type="text"
              placeholder="Enter username"
              className="w-full mt-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent text-sm transition-all"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              placeholder="Enter email"
              className="w-full mt-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent text-sm transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter password"
              className="w-full mt-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent text-sm transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">Role</label>
            <select
              className="w-full mt-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent text-sm transition-all bg-white"
              value={role}
              onChange={(e) => {
                const newRole = e.target.value;
                setRole(newRole);
                if (newRole === "employer") {
                  setPreferredCategory("");
                }
                if (newRole === "jobseeker") {
                  setCompanyName("");
                }
              }}
            >
              <option value="jobseeker">Job Seeker</option>
              <option value="employer">Employer</option>
            </select>
          </div>

          {/* only show if role = jobseeker */}
          {role === "jobseeker" && (
            <div>
              <label className="text-sm font-medium text-gray-600">
                Preferred Category
              </label>
              <select
                className="w-full mt-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent text-sm transition-all bg-white"
                value={preferredCategory}
                onChange={(e) => setPreferredCategory(e.target.value)}
                required
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          {/* Employer */}
          {role === "employer" && (
            <div>
              <label className="text-sm font-medium text-gray-600">
                Company Name
              </label>

              <input
                type="text"
                className="w-full mt-1 px-4 py-2.5 border rounded-xl"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-violet-700 text-white py-2.5 rounded-xl hover:bg-violet-800 transition-all font-semibold text-sm shadow-md shadow-violet-200 mt-2"
          >
            Create Account
          </button>
        </form>

        {/* Login link */}
        <p
          className="text-center text-sm text-gray-400 mt-5"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          Already have an account?{" "}
          <a
            href="/login"
            className="text-violet-700 font-semibold hover:underline"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

export default Register;
