import { useNavigate } from "react-router-dom";



function EmployerJobCard({ job }: any) {

    const navigate = useNavigate();
  return (
    <div className="bg-white p-5 rounded-xl shadow">

      <h2 className="text-lg font-semibold">{job.title}</h2>

      <p className="text-gray-600">{job.company_name}</p>

      <p className="text-sm text-gray-500">
        📍 {job.location}
      </p>

      <button className="mt-3 bg-blue-600 text-white px-3 py-1 rounded"
      onClick={() => navigate(`/applicants/${job.id}`)}>
        View Applicants
      </button>

    </div>
  );
}

export default EmployerJobCard;