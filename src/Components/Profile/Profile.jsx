import React, { useEffect, useState } from 'react';
import images from '../../asstes/images';
import { useStateValue } from '../../state/StateProvider';

const Profile = () => {
  const [{ user }] = useStateValue();
  const [newName, setNewName] = useState("");

  useEffect(() => {
    if (user !== null) {
      setNewName(user.name);
    }
  }, [user]);


  return (
    <>
      {
        user === null ?
          <div className='h-screen w-full flex flex-col items-center justify-center'>
            <span className="loading loading-spinner loading-lg"></span>
          </div> :
          <div className='w-[600px] m-auto gap-4 flex flex-col items-center mt-12'>
            <div className='text-xl font-bold'>Edit Profile</div>
            <div className='relative'>
              <div className='h-40 w-40 rounded-full overflow-hidden border-2 border-[#3c4750] object-contain'>
                <img src={images.download} alt="profile" />
              </div>
              <label htmlFor="upload" className='absolute cursor-pointer right-0 bottom-4'>
                <img src={images.camera} alt="upload" className='w-8' />
              </label>
              <input type="file" id="upload" className='hidden' accept="image/*" />
            </div>
            <div className='flex flex-col'>
              <label htmlFor="name" className='flex flex-col text-lg font-bold'>Name:
              </label>
              <input type="text" id='name' value={newName} onChange={(e) => setNewName(e.target.value)} className={`p-2 rounded-md bg-[transparent] focus:outline-none border-2 ${newName.length===0?'border-[#f15b50]':'border-[#85b8ff]'} `} />
              {
                newName.length===0&&(
                  <p className='text-xs text-[#f15b50] px-2 mt-1'>please enter your name</p>
                )
              }
            </div>
            <div className='flex flex-col'>
              <label htmlFor="name" className='flex flex-col text-lg font-bold'>Email:
              </label>
              <input type="text" id='name' value={user.email} readOnly className='p-2 rounded-md bg-[transparent] focus:outline-none border-2 border-[#85b8ff]' />
            </div>
            <button className='btn btn-accent'>
              Save changes
            </button>
          </div>
      }
    </>
  )
}

export default Profile;
