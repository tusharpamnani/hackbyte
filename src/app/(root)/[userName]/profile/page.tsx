/* eslint-disable  @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { GetUserByUserName } from "../../../../components/actions/user";
import ProfileForm from "../../../../components/shared/ProfileForm";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const userName = params.userName as string;

  useEffect(() => {
    const fetchUser = async () => {
      if (userName) {
        try {
          const userData = await GetUserByUserName(userName);
          setUser(userData);
        } catch (error) {
          console.error("Error fetching user:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userName]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return <div className="text-center text-red-500 text-lg">User not found</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-400 p-4">
      <div className="w-full max-w-lg bg-white shadow-md rounded-lg p-6">
        <div className="flex items-center space-x-4 border-b pb-4">
          {user.avatar && <Image src={user.avatar} alt="Avatar" height={16} width={16} className="w-16 h-16 rounded-full border" />}
          <div>
            <h2 className="text-xl font-semibold text-black">{user.name} {user.lastName}</h2>
            <p className="text-black font-bold italic underline-offset-1 ">@{user.userName}</p>
          </div>
        </div>

        {/* Client-side User Update Form */}
        <ProfileForm user={user} />
      </div>
    </div>
  );
};

export default ProfilePage;