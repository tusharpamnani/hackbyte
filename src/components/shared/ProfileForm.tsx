/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable  @typescript-eslint/no-unused-vars */

"use client"

import { useState } from "react";
import { UpdateUserDetails } from "../actions/user";

const ProfileForm = ({ user }: { user: any }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    lastName: user.lastName,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await UpdateUserDetails(user.id, formData);

      if (res) {
        setMessage("Profile updated successfully.");
      } else {
        setMessage("Something went wrong.");
      }
    } catch (error) {
      setMessage("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div>
        <label className="block text-sm font-medium text-black">First Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded-md text-black focus:ring-2 focus:ring-blue-400 outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-black">Last Name</label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          className="w-full p-2 border rounded-md text-black focus:ring-2 focus:ring-blue-400 outline-none"
        />
      </div>

      <div>
        <label className="block text-black text-sm font-medium  ">Email (Non-Editable)</label>
        <input
          type="email"
          value={user.email}
          disabled
          className="w-full p-2 text-black border rounded-md bg-gray-200"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-black">Username (Non-Editable)</label>
        <input
          type="text"
          value={user.userName}
          disabled
          className="w-full p-2 border rounded-md text-black bg-gray-200"
        />
      </div>

      <div className="mt-6">
        <button
          type="submit"
          className={`px-4 py-2 rounded-md text-white w-full ${
            loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
          }`}
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </div>

      {message && <p className="text-center text-sm mt-2 text-green-500">{message}</p>}
    </form>
  );
};

export default ProfileForm;