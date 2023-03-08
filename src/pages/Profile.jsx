import { getAuth } from 'firebase/auth';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';


export default function Profile() {
  const auth = getAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: "Praisemike023@gmail.com",
  });

  const {name, email} =formData;
  function onLogout(){ //for the logout/sign-out
    auth.signOut();
    navigate("/")
  }
  return (
    <>
      <section className='max-w-6xl mx-auto flex justify-center items-center flex-col'>
        <h1 className='text-3xl text-center mt-6 font-bold'>My Profile</h1>
        <div className='w-full md:w-[50%] m-6 px-3'>
          <form >
            {/* Name Input */}

            <input type="text" id='name' value={name} disabled className='w-full mb-7 px-4 py-2 text-xl text-gray-600 bg-white border-grey-300 rounded transition ease-in-out '/>

            {/* Email Input */}

            <input type="email" id='email' value={email} disabled className='w-full mb-7 px-4 py-2 text-xl text-gray-600 bg-white border-grey-300 rounded transition ease-in-out '/>

            <div className='flex font-semibold mb-6 justify-between whitespace-nowrap text-sm sm:text-lg '>
              <p className='flex items-center'>Do you want to change your name? 
                <span className='text-red-500 hover:text-red-700 transition ease-in-out duration-200 cursor-pointer
               ml-1'>Edit</span>
              </p>
              <p onClick={onLogout} className='text-blue-600 hover:text-blue-800 transition ease-in-out duration-200 cursor-pointer '>Sign Out</p>
            </div>

          </form>
        </div>
      </section>
    </>
  )
}
