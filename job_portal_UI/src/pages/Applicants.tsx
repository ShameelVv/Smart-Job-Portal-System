import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { useEffect, useState } from "react";
import api from "../api/api";

function Applicants() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
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
    } catch (err: any) {
      if (err.response?.status === 403) {
        alert("you are not allowed to view this");
      } else {
        console.log(err);
      }
    }
  };

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
        }
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
    .filter((app) => (filter === "all" ? true : app.status === filter))
    .filter(
      (app) =>
        app.applicant_name.toLowerCase().includes(search.toLowerCase()) ||
        app.applicant_email.toLowerCase().includes(search.toLowerCase())
    );

  const counts = {
    all: applicants.length,
    pending: applicants.filter((a) => a.status === "pending").length,
    shortlisted: applicants.filter((a) => a.status === "shortlisted").length,
    rejected: applicants.filter((a) => a.status === "rejected").length,
    hired: applicants.filter((a) => a.status === "hired").length,
  };

  return (
    <DashboardLayout>

      {/* Back */}
      <button
        onClick={() => navigate("/employerDashboard")}
        className="flex items-center text-violet-700 hover:text-violet-900 font-medium mb-6 transition-colors"
      >
        ← Back to Dashboard
      </button>

      {/* Heading */}
      <h1 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight">
        Applicants <span className="text-violet-700">({filteredApplicants.length})</span>
      </h1>

      {/* Filters + Search */}
      <div className="flex gap-6 items-center mb-6 flex-wrap">

        <div className="flex gap-2 flex-wrap">
          {["all", "pending", "shortlisted", "rejected", "hired"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3 py-1 rounded-full text-sm capitalize font-medium border transition
                  ${
                    filter === status
                      ? "bg-violet-700 text-white border-violet-700 shadow-md shadow-violet-200"
                      : "bg-white text-gray-600 border-violet-100 hover:bg-violet-50 hover:text-violet-700"
                  }
                `}
              >
                {status} ({counts[status as keyof typeof counts]})
              </button>
            )
          )}
        </div>

        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-1/2 ml-auto px-4 py-2 rounded-xl border border-violet-100 bg-white/80 backdrop-blur-md text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-300 shadow-sm"
        />
      </div>

      {/* Empty */}
      {filteredApplicants.length === 0 && (
        <p className="text-gray-500 text-sm">No applicants yet</p>
      )}

      {/* List */}
      {filteredApplicants.map((app) => (
        <div
          key={app.id}
          className="bg-white/80 backdrop-blur-md p-5 rounded-2xl shadow-lg shadow-violet-100 border border-violet-100 mb-4 hover:shadow-xl hover:shadow-violet-200 transition-all duration-300"
        >
          <p className="font-semibold text-gray-900">{app.applicant_name}</p>
          <p className="text-sm text-gray-500">{app.applicant_email}</p>

          <p
            className={`text-xs font-semibold px-3 py-1 rounded-full inline-block mt-2 border
              ${app.status === "pending" && "bg-yellow-100 text-yellow-700 border-yellow-200"}
              ${app.status === "shortlisted" && "bg-violet-100 text-violet-700 border-violet-200"}
              ${app.status === "hired" && "bg-green-100 text-green-700 border-green-200"}
              ${app.status === "rejected" && "bg-red-100 text-red-700 border-red-200"}
            `}
          >
            {app.status.toUpperCase()}
          </p>

          <div className="flex gap-2 mt-3">
            {app.status === "pending" && (
              <>
                <button
                  onClick={() => updateStatus(app.id, "shortlisted")}
                  className="bg-violet-700 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-violet-800 shadow-md shadow-violet-200 transition"
                >
                  Shortlist
                </button>

                <button
                  onClick={() => updateStatus(app.id, "rejected")}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-red-600 transition"
                >
                  Reject
                </button>
              </>
            )}

            {app.status === "shortlisted" && (
              <>
                <button
                  onClick={() => updateStatus(app.id, "hired")}
                  className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-green-700 transition"
                >
                  Hire
                </button>

                <button
                  onClick={() => updateStatus(app.id, "rejected")}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-red-600 transition"
                >
                  Reject
                </button>
              </>
            )}

            {(app.status === "hired" || app.status === "rejected") && (
              <p className="text-xs text-gray-400 mt-2">
                Final decision made
              </p>
            )}
          </div>
        </div>
      ))}
    </DashboardLayout>
  );
}

export default Applicants;