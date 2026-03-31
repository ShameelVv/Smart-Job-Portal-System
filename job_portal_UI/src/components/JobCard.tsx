import { useState } from "react";

// The 'job' prop contains job details, 'onApply' is the function passed from the parent,
// and 'isApplied' is a boolean checking if the user already applied to this specific ID.
function JobCard({ job, onApply, isApplied }: any) {
  // LOCAL STATE: Each card manages its own file selection independently.
  // This prevents one card's file from showing up on another job card.
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  return (
    // DYNAMIC STYLING: We use a template literal to change the card's look.
    // If 'isApplied' is true, we reduce opacity to visually "de-prioritize" the card.
    <div
      className={`bg-white p-5 rounded-xl shadow transition ${isApplied ? "opacity-75" : "hover:shadow-lg"}`}
    >
      {/* DATA BINDING: Displaying job information passed down via props */}
      <h2 className="text-lg font-bold text-gray-800">{job.title}</h2>
      <p className="text-gray-600">{job.company_name}</p>

      <div className="mt-1">
        <p className="text-sm text-gray-700">📍 {job.location}</p>
        <p className="text-sm text-gray-700">💰 {job.salary}</p>
      </div>
      <p className="text-sm text-gray-700 mt-2 italic">
        Category: {job.category_name}
      </p>

      <p className="text-sm text-red-500 mt-2"><span className="font-semibold">Type:</span> {job.job_type_name}</p>

      <div className="flex flex-wrap gap-2 mt-3">
        {job.skills_list?.map((skill: string, index: number) => (
          <span key={index} className="bg-violet-100 text-violet-700 px-2 py-1 text-[10px] font-bold rounded uppercase">
            {skill}
          </span>
        ))}
      </div>

      {/* CONDITIONAL RENDERING: We only show the file upload UI if the user hasn't applied.
          This cleans up the UI and prevents users from uploading files they can't submit. */}
      {!isApplied && (
        <div className="mt-4">
          <label className="text-xs font-medium text-gray-700 block mb-1">
            Upload Resume (PDF/Doc)
          </label>
          <input
            type="file"
            className="text-xs text-gray-500 file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 hover:cursor-pointer"
            // EVENT HANDLER: Updates the local state with the first file selected.
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
          />
          {/* LOGICAL AND (&&): Shows the filename only after a file is selected */}
          {selectedFile && (
            <p className="text-[10px] text-green-600 mt-1 font-semibold">
              ✔ {selectedFile.name}
            </p>
          )}
        </div>
      )}

      {/* ACTION BUTTON: 
          1. 'disabled' attribute stops the button from being clickable if applied.
          2. 'onClick' sends the Job ID AND the locally stored file back to the parent Dashboard.
          3. Dynamic classes switch the button from Dark Gray (Active) to Light Green (Success). */}
      <button
        disabled={isApplied}
        onClick={() => onApply(job.id, selectedFile)}
        className={`mt-4 w-full py-2 rounded-lg transition font-medium ${
          isApplied
            ? "bg-green-100 text-green-700 cursor-not-allowed border border-green-200"
            : "bg-gray-800 text-white hover:bg-gray-700 shadow-md"
        }`}
      >
        {/* TERNARY OPERATOR: Swaps the button text based on the application status */}
        {isApplied ? "✓ Already Applied" : "Apply Now"}
      </button>
    </div>
  );
}

export default JobCard;
