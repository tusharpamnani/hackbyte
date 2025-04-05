import Image from 'next/image';
import React from 'react';
import { GiRamProfile } from 'react-icons/gi';
// import { SignOutButton } from '../auth/buttons/SignOut';

interface TopbarProps {
  image?: string | React.ReactNode;
  name?: string;
  signature?: string;
}

const Topbar: React.FC<TopbarProps> = ({ image, name = "Guest", signature = "Leader" }) => {
  // Get the current date
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year : 'numeric'
  });

  return (
    <div className="flex justify-between items-center p-4 bg-gray-100 shadow-md">
      <div className="text-lg font-semibold text-gray-700">{formattedDate}</div>

      <div className="flex gap-4 items-center">
        <div className="border-black border-2 p-1 rounded-full bg-slate-200">
          {typeof image === 'string' ? (
            <Image 
              alt="profile" 
              src={image} 
              width={48} 
              height={48} 
              className="object-cover flex items-center justify-center rounded-full" 
            />
          ) : (
            image || <GiRamProfile size={25} className="text-black" />
          )}
        </div>

        {/* Name & Signature */}
        <div className="flex flex-col">
          <span className="text-lg font-medium text-gray-800">{name}</span>
          {signature && <span className="text-sm italic text-gray-600">- {signature}</span>}
        </div>
        <div>
        {/* <SignOutButton className='text-black'/> */}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
