import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { useEffect, useState } from "react";
import api from "../api/api";

function Applicants() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  //   to search bar
  const [search, setSearch] = useState("");

  //   to filter the applicants
  const [filter, setFilter] = useState("all");
  // to fetch appplicant
  const [applicants, setApplicants] = useState<any[]>([]);

  const fetchApplicants = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await api.get(`jobs/${jobId}/applications/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setApplicants(res.data);
    } catch (err:any) {
      if (err.response?.status===403){
        alert("you are not allowed to view this")
      }else{
        console.log(err)
      }
    }
  };
  //   to update the status
  const updateStatus = async (applicationId: number, status: string) => {
    const token = localStorage.getItem("token");

    try {
      await api.patch(
        `applications/${applicationId}/status/`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Status updated");

      fetchApplicants();
    } catch (err) {
      console.log(err);
      alert("Failed to update");
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, []);

  const filteredApplicants = applicants
  .filter((app) =>
    filter === "all" ? true : app.status === filter
  )
  .filter((app) =>
    app.applicant_name.toLowerCase().includes(search.toLowerCase()) ||
    app.applicant_email.toLowerCase().includes(search.toLowerCase())
  );

//   creating a variable to store the count of person on each respective tabs
  const counts={
    all:applicants.length,
    pending:applicants.filter(a=>a.status === "pending").length,
    shortlisted:applicants.filter(a=>a.status === "shortlisted").length,
    rejected:applicants.filter(a=>a.status === "rejected").length,
    hired:applicants.filter(a=>a.status === "hired").length,
  }
  return (
    <DashboardLayout>
      <button
        onClick={() => navigate("/employerDashboard")} // 3. Tell it where to go
        className="flex items-center text-violet-700 hover:text-violet-900 font-medium mb-6 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Dashboard
      </button>
      <h1 className="text-2xl font-semibold mb-4">
        Applicants ({filteredApplicants.length})
      </h1>
    <div className="flex gap-6 ">
             
      <div className="flex gap-2 mb-4">
        {["all", "pending", "shortlisted", "rejected", "hired"].map(
          (status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1 rounded text-sm capitalize
        ${
          filter === status
            ? "bg-gray-800 text-white"
            : "bg-gray-200 text-gray-700"
        }
      `}
            >
              {status} ({counts[status as keyof typeof counts]}) {/* implementing the count variable */}
            </button>
          ),
        )}
      </div>
         <input
        type="text"
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-4 px-3 py-2 border rounded-lg text-sm w-1/2 ml-auto"
      />
    </div>
      {filteredApplicants.length === 0 && (
        <p className="text-gray-500 text-sm">No applicants yet</p>
      )}
      {filteredApplicants.map((app) => (
        <div key={app.id} className="bg-white p-4 rounded shadow mb-3">
          <p className="font-semibold">{app.applicant_name}</p>
          <p className="text-sm text-gray-500">{app.applicant_email}</p>

          <p
            className={`text-xs font-semibold px-2 py-1 rounded inline-block
            ${app.status === "pending" && "bg-yellow-100 text-yellow-700"}
            ${app.status === "shortlisted" && "bg-blue-100 text-blue-700"}
            ${app.status === "hired" && "bg-green-100 text-green-700"}
            ${app.status === "rejected" && "bg-red-100 text-red-700"}
            `}
          >
            {app.status.toUpperCase()}
          </p>

          <div className="flex gap-2 mt-2">
            {app.status === "pending" && (
              <>
                <button
                  onClick={() => updateStatus(app.id, "shortlisted")}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Shortlist
                </button>

                <button
                  onClick={() => updateStatus(app.id, "rejected")}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Reject
                </button>
              </>
            )}

            {app.status === "shortlisted" && (
              <>
                <button
                  onClick={() => updateStatus(app.id, "hired")}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  Hire
                </button>

                <button
                  onClick={() => updateStatus(app.id, "rejected")}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Reject
                </button>
              </>
            )}
            {(app.status === "hired" || app.status === "rejected") && (
              <p className="text-xs text-gray-400 mt-2">Final decision made</p>
            )}
          </div>
        </div>
      ))}
    </DashboardLayout>
  );
}

export default Applicants;
