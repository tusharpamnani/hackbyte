import { GetUserByUserName } from "../../../../components/actions/user";
import ProfileForm from "../../../../components/shared/ProfileForm";

const Page = async ({ params }: { params: { userName: string } }) => {

  let user = null;
  const{userName} = await params

  if (params.userName){
    user = await GetUserByUserName(params.userName);
  }

  if (!user) {
    return <div className="text-center text-red-500 text-lg">User not found</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-400 p-4">
      <div className="w-full max-w-lg bg-white shadow-md rounded-lg p-6">
        <div className="flex items-center space-x-4 border-b pb-4">
          {user.avatar && <img src={user.avatar} alt="Avatar" className="w-16 h-16 rounded-full border" />}
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

export default Page;
