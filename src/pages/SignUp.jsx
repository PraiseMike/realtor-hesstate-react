import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import OAuth from '../components/OAuth';
import {AiFillEyeInvisible, AiFillEye} from "react-icons/ai"
import {getAuth, createUserWithEmailAndPassword, updateProfile} from "firebase/auth"
import {db} from "../firebase"
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false); //remember to put it setShowPassword
  const [formData, setFormData] = useState({ //creating a formData hook
    name: "",
    email: "",
    password: ""
  });
  const {name, email, password} =formData; // destructuring the email and password from it and using the value
  const navigate = useNavigate()
  function onChange(e){
    setFormData((prevState)=>({
      ...prevState,
      [e.target.id]: e.target.value,
    }))
  }
  async function onsubmit(e){
    e.preventDefault()

    try {
      const auth = getAuth()
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      updateProfile(auth.currentUser, {
        displayName: name
      })
      const user = userCredential.user
      const formDataCopy = {...formData} //for getting the password using spread and deleting the password
      delete formDataCopy.password;
      formDataCopy.timestamp = serverTimestamp();

      await setDoc(doc(db, "users", user.uid), formDataCopy);
      toast.success("sign up successful")  
      navigate("/")
    } catch (error) {
      toast.error("Something Went wrong with the Registration");
    }
  }
  return (
    <section>
      <h1 className='text-3xl text-center mt-6 font-bold'>Sign Up</h1>
      <div className='flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto'>
        <div className='md:w-[67%] lg:w-[50%] mb-12 md:mb-6'>
          <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=773&q=80" alt="Key" className='w-full rounded-2xl'/>
        </div>
        <div className='w-full md:w-[67%] lg:w-[40%] lg:ml-20'>
          <form onSubmit={onsubmit}>
            <input className='w-full mb-6 px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out' type="name" id='name' value={name} onChange={onChange} placeholder="Full Name" />

            <input className='w-full mb-6 px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out' type="email" id='email' value={email} onChange={onChange} placeholder="Email address" />

            <div className='relative mb-6'>
            <input className='w-full my-2 px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out' type={showPassword ? "text" : "password"} id='password' value={password} onChange={onChange} placeholder="Password" />
            {showPassword ? 
              <AiFillEyeInvisible className="absolute right-3 top-6 text-xl cursor-pointer" onClick={()=>setShowPassword((prevState)=>!prevState)}/>
            : <AiFillEye className="absolute right-3 top-6 text-xl cursor-pointer" onClick={()=>setShowPassword((prevState)=>!prevState)}/>} 
            </div>
            <div className='flex justify-between whitespace-nowrap text-sm sm:text-lg'>
              <p className='mb-6'>Have an account?
              <Link to="/sign-in" className='text-red-600 hover:text-red-700 transition duration-200 ease-in-out ml-1'>Sign In</Link>
              </p>
              <p>
                <Link to="/forgot-password" className='text-blue-600 hover:text-blue-800 transition duration-150'>Forgot Password?</Link>
              </p>
            </div>

            <button className='w-full text-sm font-medium uppercase rounded bg-blue-600
           text-white px-7 py-3 shadow-lg hover:bg-blue-700 transition duration-150 
           ease-in-out hover:shadow-lg active:bg-blue-800' type='submit'>Sign Up</button>
           <div className=' flex items-center my-4 before:border-t before:flex-1 
            before:border-gray-400  after:border-t after:flex-1 
            after:border-gray-400'> 
            <p className="text-center font-semibold mx-4">OR</p>
           </div>
            <OAuth />

          </form>

        </div>
      </div>
    </section>
  )
}