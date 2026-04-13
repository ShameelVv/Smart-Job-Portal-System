import { useEffect, useState } from "react";
import api from "../api/api";
import DashboardLayout from "../layouts/DashboardLayout";

function Profile() {
  const [form, setForm] = useState<any>({});
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("profile/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForm(res.data);
    } catch (err) {
      console.error("Error fetching profile", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      await api.patch("profile/", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Profile updated successfully!");
    } catch (err) {
      alert("Error updating profile");
    }
  };

  if (loading) return <p className="p-10 text-gray-500">Loading profile...</p>;

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">

        {/* Heading */}
        <h1 className="text-2xl font-bold text-gray-900 mb-8 tracking-tight">
          My <span className="text-violet-700">Profile</span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* LEFT: Profile Card */}
          <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-lg shadow-violet-100 border border-violet-100 text-center">

            <div className="w-24 h-24 bg-gradient-to-br from-violet-700 to-purple-500 text-white text-3xl font-bold rounded-full flex items-center justify-center mx-auto mb-4 shadow-md shadow-violet-200">
              {form.username?.charAt(0).toUpperCase()}
            </div>

            <h2 className="text-xl font-bold text-gray-900">{form.username}</h2>
            <p className="text-gray-500 text-sm mb-4">{form.email}</p>

            <div className="text-left border-t border-violet-100 pt-4">
              <p className="text-xs font-bold text-gray-400 uppercase">
                Category
              </p>
              <p className="text-sm text-gray-700">
                {form.preferred_category_name || "Not set"}
              </p>
            </div>
          </div>

          {/* RIGHT: Form */}
          <div className="md:col-span-2 bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-lg shadow-violet-100 border border-violet-100">

            <form onSubmit={handleSubmit} className="space-y-5">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Username */}
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">
                    Username
                  </label>
                  <input
                    name="username"
                    value={form.username || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-xl border border-violet-100 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-1">
                    Email Address
                  </label>
                  <input
                    name="email"
                    value={form.email || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-xl border border-violet-100 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
                  />
                </div>

              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">
                  Professional Bio
                </label>
                <textarea
                  name="bio"
                  value={form.bio || ""}
                  onChange={handleChange}
                  placeholder="Tell us about yourself..."
                  className="w-full px-4 py-2 rounded-xl border border-violet-100 bg-white text-sm h-32 focus:outline-none focus:ring-2 focus:ring-violet-300"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-1">
                  Preferred Job Category
                </label>
                <input
                  name="preferred_category_name"
                  value={form.preferred_category_name || ""}
                  disabled
                  className="w-full px-4 py-2 rounded-xl border border-violet-100 bg-violet-50 text-gray-500 text-sm"
                />
              </div>

              {/* Button */}
              <div className="pt-4">
                <button className="bg-violet-700 hover:bg-violet-800 text-white font-semibold py-2 px-6 rounded-xl transition shadow-md shadow-violet-200">
                  Update Profile
                </button>
              </div>

            </form>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}

export default Profile;