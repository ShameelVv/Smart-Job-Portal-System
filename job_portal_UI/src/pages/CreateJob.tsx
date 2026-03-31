import DashboardLayout from "../layouts/DashboardLayout";
import { useState, useEffect } from "react";
import api from "../api/api";

function CreateJob() {
  // for jobtype and skills
  const [jobTypes, setJobTypes] = useState([]);
  const [jobType, setJobType] = useState<number | "">("");

  const [skills, setSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState<number[]>([]);

  // for categories dropdown and selelction
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
          category:Number(category),
          job_type: Number(jobType),
          skills: selectedSkills,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Job created successfully");

      // reset form
      setTitle("");
      setDescription("");
      setSalary("");
      setLocation("");
      setCategory(""); // Add this
      setJobType(""); // Add this
      setSelectedSkills([]); // Add this
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
      <h1 className="text-2xl font-semibold mb-6">Create Job</h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <input
          type="text"
          placeholder="Job Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />

        <input
          type="text"
          placeholder="Salary"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />

        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        >
          <option value="">Select Category</option>

          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <select
          value={jobType}
          onChange={(e) => setJobType(Number(e.target.value))}
          className="w-full px-3 py-2 border rounded"
        >
          <option value="">Select Job Type</option>

          {jobTypes.map((type: any) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>

        <div className="border p-3 rounded">
          <p className="text-sm mb-2">Select Skills</p>

          {skills.map((skill: any) => (
            <label key={skill.id} className="block text-sm">
              <input
                type="checkbox"
                value={skill.id}
                checked={selectedSkills.includes(skill.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedSkills([...selectedSkills, skill.id]);
                  } else {
                    setSelectedSkills(
                      selectedSkills.filter((id) => id !== skill.id),
                    );
                  }
                }}
              />

              <span className="ml-2">{skill.name}</span>
            </label>
          ))}
        </div>

        <button className="bg-gray-800 text-white px-4 py-2 rounded">
          Create Job
        </button>
      </form>
    </DashboardLayout>
  );
}

export default CreateJob;
