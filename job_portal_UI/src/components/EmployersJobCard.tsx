import { useNavigate } from "react-router-dom";

function EmployerJobCard({ job }: any) {
  const navigate = useNavigate();
  return (
    <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl shadow-lg shadow-violet-100 border border-violet-100 hover:shadow-xl hover:shadow-violet-200 hover:-translate-y-1 transition-all duration-300">
      
      <div className="flex justify-between items-start">
        <h2 className="text-lg font-semibold text-gray-900">
          {job.title}
        </h2>

        {job.applicant_count > 0 && (
          <div>
            <span className="bg-violet-100 text-violet-700 text-xs font-semibold px-2 py-1 rounded-full border border-violet-200">
              🔴 {job.applicant_count} Applicants
            </span>
          </div>
        )}
      </div>

      <p className="text-gray-500">{job.company_name}</p>

      <p className="text-sm text-gray-400 mt-1">📍 {job.location}</p>

      <button
        className="mt-4 bg-violet-700 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-violet-800 transition-all shadow-md shadow-violet-200"
        onClick={() => navigate(`/applicants/${job.id}`)}
      >
        View Applicants
      </button>
    </div>
  );
}

export default EmployerJobCard;