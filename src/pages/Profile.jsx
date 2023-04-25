import { getAuth, updateProfile } from 'firebase/auth';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import {db} from "../firebase"
import { toast } from 'react-toastify';
import {collection, doc, getDocs, orderBy, where, query, updateDoc} from "firebase/firestore"
import {FcHome} from "react-icons/fc"
import Listingitem from '../components/Listingitem';


export default function Profile() {
  const auth = getAuth()
  const navigate = useNavigate()
  const [changeDetail, setChangeDetail] = useState(false)
  const [listings, setListings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  const {name, email} =formData;
  function onLogout(){ //for the logout/sign-out
    auth.signOut();
    navigate("/")
  }

  function onChange(e){
    setFormData((prevState)=>({
      ...prevState,
      [e.target.id]: e.target.value,
    })) //we return an object. First we want to spread the prevState
  }
  async function onSubmit(){
    try {
      if(auth.currentUser.displayName !== name){
        //Update display name in firebase auth
        await updateProfile(auth.currentUser, {
          displayName: name,
        });

        // update name in firestore
        const docRef = doc(db, "users", auth.currentUser.uid)
        await updateDoc(docRef, {
          name,
        }) 
      }
      toast.success("Profile Updated")
    } catch (error) {
      toast.error("Could not update profile details")
    }
  }
  useEffect(()=>{
    async function fetchUserListings(){
      const listingRef = collection(db, "listings");
      const q = query(
        listingRef, 
        where("userRef", "==", auth.currentUser.uid), 
        orderBy("timestamp", "desc")
        );
      const querySnap = await getDocs(q);
      let listings = [];
      querySnap.forEach((doc)=>{
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings(listings)
      setLoading(false)
    }
    fetchUserListings();
  }, [auth.currentUser.uid]);
  return (
    <>
      <section className='max-w-6xl mx-auto flex justify-center items-center flex-col'>
        <h1 className='text-3xl text-center mt-6 font-bold'>My Profile</h1>
        <div className='w-full md:w-[50%] m-6 px-3'>
          <form >
            {/* Name Input */}

           <input type="text" 
           id='name'
           value={name}
           disabled={!changeDetail}
           onChange={onChange}
           className={`mb-7 w-full px-4 py-2 text-xl text-gray-700 bg-white border-grey-300 rounded transition ease-in-out ${
            changeDetail && "bg-red-200 focus:bg-red-200"
           }`}
           />

            {/* Email Input */}

            <input type="email" id='email' value={email} disabled className='w-full mb-7 px-4 py-2 text-xl text-gray-600 bg-white border-grey-300 rounded transition ease-in-out '/>

            <div className='flex font-semibold mb-6 justify-between whitespace-nowrap text-sm sm:text-lg '>
              <p className='flex items-center'>Do you want to change your name? 
                <span onClick={()=> {
                  changeDetail && onSubmit()
                  setChangeDetail((prevState)=> !prevState);
              }}
            className='text-red-500 hover:text-red-700 transition ease-in-out duration-200 cursor-pointer
               ml-1'> {/*so as not to make the setChangeDetail prevState loop infinitely, we make it a function and return the setChangeDetail */}
                {changeDetail ? "Apply Change" : "Edit"}
               </span> 
              </p>
              <p onClick={onLogout} className='text-blue-600 hover:text-blue-800 transition ease-in-out duration-200 cursor-pointer '>Sign Out</p>
            </div>

          </form>
  
            <Link to="/create-listing">
            <button className='w-full bg-blue-600 text-white uppercase px-7 py-3 text-sm rounded font-medium shadow-md hover:shadow-lg hover:bg-blue-700 transition duration-150 ease-in-out active:bg-blue-800 flex justify-center items-center' type="submit">
            <FcHome className='mr-3 text-2xl bg-red-100 rounded-full p-1 border-2 '/>
            Sell or Rent your home
            </button>
            </Link>
        </div>
      </section>


      <section className='max-w-6xl px-3 mt-3 mx-auto'>
      {!loading && listings.length > 0 && (
        <>
          <h2 className=' font-semibold text-center font-sans text-2xl'>My Listings</h2>
          <ul>
            {listings.map((listing)=>(
              <Listingitem key={listing.id} id={listing.id} listing={listing.data}/>
            ))}
          </ul>
        </>
      )}
      </section>

    </>
  )
}
