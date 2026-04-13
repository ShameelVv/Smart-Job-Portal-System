import DashboardLayout from "../layouts/DashboardLayout";
import { useState, useEffect } from "react";
import api from "../api/api";

function CreateJob() {
  const [jobTypes, setJobTypes] = useState([]);
  const [jobType, setJobType] = useState<number | "">("");

  const [skills, setSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState<number[]>([]);

  const [categories, setCategories] = useState<any[]>([]);
  const [category, setCategory] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [salary, setSalary] = useState("");
  const [location, setLocation] = useState("");

  const fetchCategories = async () => {
    try {
      const res = await api.get("job-categories/");
      setCategories(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchJobTypes = async () => {
    const res = await api.get("job-type/");
    setJobTypes(res.data);
  };

  const fetchSkills = async () => {
    const res = await api.get("skills/");
    setSkills(res.data);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    try {
      await api.post(
        "jobs/create/",
        {
          title,
          description,
          salary,
          location,
          category: Number(category),
          job_type: Number(jobType),
          skills: selectedSkills,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Job created successfully");

      setTitle("");
      setDescription("");
      setSalary("");
      setLocation("");
      setCategory("");
      setJobType("");
      setSelectedSkills([]);
    } catch (err) {
      console.log(err);
      alert("Failed to create job");
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchJobTypes();
    fetchSkills();
  }, []);

  return (
    <DashboardLayout>

      {/* Heading */}
      <h1 className="text-2xl font-bold text-gray-900 mb-8 tracking-tight">
        Create a <span className="text-violet-700">New Job</span>
      </h1>

      {/* Form Card */}
      <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg shadow-violet-100 border border-violet-100 max-w-xl">

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Title */}
          <input
            type="text"
            placeholder="Job Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-violet-100 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
          />

          {/* Description */}
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-violet-100 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
          />

          {/* Salary */}
          <input
            type="text"
            placeholder="Salary"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-violet-100 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
          />

          {/* Location */}
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-violet-100 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
          />

          {/* Category */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-violet-100 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Job Type */}
          <select
            value={jobType}
            onChange={(e) => setJobType(Number(e.target.value))}
            className="w-full px-4 py-2 rounded-xl border border-violet-100 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
          >
            <option value="">Select Job Type</option>
            {jobTypes.map((type: any) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>

          {/* Skills */}
          <div className="border border-violet-100 p-4 rounded-xl bg-violet-50/40">
            <p className="text-sm font-semibold text-gray-700 mb-2">
              Select Skills
            </p>

            <div className="grid grid-cols-2 gap-2">
              {skills.map((skill: any) => (
                <label key={skill.id} className="flex items-center text-sm text-gray-600 gap-2">
                  <input
                    type="checkbox"
                    value={skill.id}
                    checked={selectedSkills.includes(skill.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedSkills([...selectedSkills, skill.id]);
                      } else {
                        setSelectedSkills(
                          selectedSkills.filter((id) => id !== skill.id)
                        );
                      }
                    }}
                    className="accent-violet-600"
                  />
                  {skill.name}
                </label>
              ))}
            </div>
          </div>

          {/* Button */}
          <button className="w-full bg-violet-700 text-white py-2 rounded-xl font-semibold hover:bg-violet-800 transition shadow-md shadow-violet-200">
            Create Job
          </button>

        </form>
      </div>

    </DashboardLayout>
  );
}

export default CreateJob;