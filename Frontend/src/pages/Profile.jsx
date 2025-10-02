import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../api/user";

const Profile = () => {
  const [form, setForm] = useState({
    fullName: "",
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    confirmEmail: "",
    facebook: "",
    twitter: "",
    memberSince: "",
    avatar: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProfile();
        setForm({
          fullName: data.name || "",
          username: data.username || "",
          password: "************",
          confirmPassword: "************",
          email: data.email || "",
          confirmEmail: data.email || "",
          facebook: data.facebook || "",
          twitter: data.twitter || "",
          memberSince: data.created_at
            ? new Date(data.created_at).toLocaleDateString()
            : "",
          avatar:
            data.avatar || "https://randomuser.me/api/portraits/men/1.jpg",
        });
      } catch {
        setMessage("Failed to load profile.");
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({
        name: form.fullName,
        username: form.username,
        email: form.email,
        avatar: form.avatar,
        facebook: form.facebook,
        twitter: form.twitter,
      });
      setMessage("Profile updated!");
    } catch {
      setMessage("Update failed.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center w-full md:w-80">
          <div className="w-32 h-32 rounded-full bg-gray-200 mb-4 overflow-hidden flex items-center justify-center">
            {form.avatar ? (
              <img
                src={form.avatar}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-sm text-gray-400">No avatar</div>
            )}
          </div>
          <h2 className="text-xl font-bold mb-1">{form.fullName}</h2>
          <p className="text-gray-500 mb-4">@{form.username}</p>
          <button className="bg-red-500 text-white px-4 py-2 rounded mb-4 hover:bg-red-600">
            Upload New Photo
          </button>
          <div className="text-xs text-gray-500 text-center mb-2">
            Upload a new avatar. Larger image will be resized automatically.
            <br />
            Maximum upload size is 1 MB
          </div>
          <div className="text-xs text-gray-400">
            Member Since:{" "}
            <span className="font-semibold">{form.memberSince}</span>
          </div>
        </div>

        {/* Right Card */}
        <form
          className="bg-white rounded-2xl shadow-lg p-8 w-full md:w-[500px] space-y-6"
          onSubmit={handleUpdate}
        >
          <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
          <div className="border-b mb-4 pb-2 flex gap-8">
            <span className="font-semibold border-b-2 border-indigo-600 pb-1">
              User info
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Full Name
              </label>
              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Username</label>
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                className="w-full p-2 border rounded"
             
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Confirm Email Address
              </label>
              <input
                type="email"
                name="confirmEmail"
                value={form.confirmEmail}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                disabled
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Social Profile
            </label>
            <div className="flex gap-4">
              <input
                name="facebook"
                placeholder="Facebook Username"
                value={form.facebook}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
              <input
                name="twitter"
                placeholder="Twitter Username"
                value={form.twitter}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600 mt-4"
          >
            Update info
          </button>
          {message && (
            <div className="text-green-600 text-center mt-2">{message}</div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile;
