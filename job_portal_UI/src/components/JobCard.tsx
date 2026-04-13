import { useState } from "react";

// The 'job' prop contains job details, 'onApply' is the function passed from the parent,
// and 'isApplied' is a boolean checking if the user already applied to this specific ID.
function JobCard({ job, onApply, isApplied }: any) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  return (
    <div
      className={`bg-white/80 backdrop-blur-md p-5 rounded-2xl shadow-lg shadow-violet-100 border border-violet-100 transition-all duration-300 ${
        isApplied ? "opacity-75" : "hover:shadow-xl hover:shadow-violet-200 hover:-translate-y-1"
      }`}
    >
      <h2 className="text-lg font-bold text-gray-900">{job.title}</h2>
      <p className="text-gray-500">{job.company_name}</p>

      <div className="mt-1">
        <p className="text-sm text-gray-500">📍 {job.location}</p>
        <p className="text-sm text-gray-500">💰 {job.salary}</p>
      </div>

      <p className="text-sm text-gray-400 mt-2 italic">
        Category: {job.category_name}
      </p>

      <p className="text-sm text-red-700 mt-2 font-medium">
        <span className="font-semibold">Type:</span> {job.job_type_name}
      </p>

      <div className="flex flex-wrap gap-2 mt-3">
        {job.skills_list?.map((skill: string, index: number) => (
          <span
            key={index}
            className="bg-violet-100 text-violet-700 px-2 py-1 text-[10px] font-bold rounded-md uppercase border border-violet-200"
          >
            {skill}
          </span>
        ))}
      </div>

      {!isApplied && (
        <div className="mt-4">
          <label className="text-xs font-medium text-gray-600 block mb-1">
            Upload Resume (PDF/Doc)
          </label>
          <input
            type="file"
            className="text-xs text-gray-500 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 hover:cursor-pointer"
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
          />

          {selectedFile && (
            <p className="text-[10px] text-violet-600 mt-1 font-semibold">
              ✔ {selectedFile.name}
            </p>
          )}
        </div>
      )}

      <button
        disabled={isApplied}
        onClick={() => onApply(job.id, selectedFile)}
        className={`mt-4 w-full py-2 rounded-lg transition font-semibold shadow-md ${
          isApplied
            ? "bg-violet-100 text-violet-700 cursor-not-allowed border border-violet-200"
            : "bg-violet-700 text-white hover:bg-violet-800 shadow-violet-200"
        }`}
      >
        {isApplied ? "✓ Already Applied" : "Apply Now"}
      </button>
    </div>
  );
}

export default JobCard;