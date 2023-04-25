import React, { useRef, useState } from 'react'
import Spinner from '../components/Spinner';
import {toast} from "react-toastify"
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { getAuth } from 'firebase/auth';
import {v4 as uuidv4} from "uuid";
import {addDoc, collection, serverTimestamp} from "firebase/firestore"
import {db} from "../firebase"
import {useNavigate} from "react-router-dom"

export default function CreateListing() {
    const navigate = useNavigate();
    const auth = getAuth();
    const [geolocationEnabled, setGeolocationEnabled] = useState(false);  // No bank card for now
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        type: "rent",
        name: "",
        bedrooms: 1,
        bathrooms: 1,
        parking: false,
        furnished: false,
        address: "",
        description: "",
        offer: false,
        regularPrice: 1,
        discountedPrice: 1,
        latitude: 0,
        longitude: 0,
        images: {}
    })
    const {type, regularPrice, offer, name, bedrooms, bathrooms, parking, furnished, description, address, discountedPrice, latitude, longitude, images} = formData
    
    function onChange(e){
        let boolean = null;
        if(e.target.value === "true"){
            boolean = true
        }
        if(e.target.value === "false"){
            boolean = false
        }
        //Files 
        if(e.target.files){
            setFormData((prevState)=>({
                ...prevState,
                images: e.target.files
            }))
        }
        // Text/boolean/number
        if(!e.target.files){
            setFormData((prevState)=>({
                ...prevState,
                [e.target.id]: boolean ?? e.target.value,
            }));
        }
    }
    async function onSubmit(e){
        e.preventDefault();
        setLoading(true);
        if(+discountedPrice >= +regularPrice){
            setLoading(false)
            toast.error("Discounted price needs to be less than Regular price")
            return;
        }
        if(images.length > 6){
            setLoading(false)
            toast.error("Maximum of 6 images are allowed")
            return;
        }
        let geolocation = {}
        let location; 
        if(geolocationEnabled){
            const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GEOCODE_API_KEY}`);
            const data = await response.json()
            geolocation.lat = data.result[0]?.geometry.location.lat ?? 0;
            geolocation.lng = data.result[0]?.geometry.location.lng ?? 0;

            location = data.status === "ZERO_RESULTS" && undefined;

            if(location === undefined){
                setLoading(false)
                toast.error("Please enter a correct address")
                return;
            }
        }else{
            geolocation.lat = latitude;
            geolocation.lng = longitude;
        }

        async function storeImage(image) {
            return new Promise((resolve, reject)=>{
                const storage = getStorage()
                const filename = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
                const storageRef = ref(storage, filename);
                const uploadTask = uploadBytesResumable(storageRef, image);

                uploadTask.on('state_changed', 
                    (snapshot) => {
                        // Observe state change events such as progress, pause, and resume
                        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log('Upload is ' + progress + '% done');
                        switch (snapshot.state) {
                            case 'paused':
                                console.log('Upload is paused');
                                break;
                            case 'running':
                                console.log('Upload is running');
                                break;
                        }
                    }, 
                    (error) => {
                        // Handle unsuccessful uploads
                        reject(error)
                    }, 
                    () => {
                        // Handle successful uploads on complete
                        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                            resolve(downloadURL);
                        });
                    }
                );


            });
        }

        // for uploading the image
        const imgUrls = await Promise.all(
            [...images].map((image)=>storeImage(image))).catch((error)=>{
                setLoading(false)
                toast.error("Images not uploaded")
                return;
            });


        const formDataCopy = {
            ...formData,
            imgUrls,
            geolocation,
            timestamp: serverTimestamp(),
            userRef: auth.currentUser.uid,
        };
        delete formDataCopy.images;
        !formDataCopy.offer && delete formDataCopy.discountedPrice;
        const docRef = await addDoc(collection(db, "listings"), formDataCopy);
        setLoading(false)
        toast.success("Listing Created")
        navigate(`/category/${formDataCopy.type}/${docRef.id}`)

    }

    if(loading){
        return <Spinner/>;
    }

  return (
    <main className='max-w-md px-2 mx-auto'>
         <h1 className='text-3xl mt-8 text-center font-bold'>Create a Listing</h1> 
         
         <form onSubmit={onSubmit}>
            <p className='font-semibold text-lg mt-6'>Sell / Rent</p>
            <div className="flex space-x-6">
            <button id='type' type='button' onClick={onChange} value="sale" className={`font-medium text-sm shadow-md hover:shadow-lg active:shadow-lg focus:shadow-lg transition duration-150 ease-in-out uppercase w-full rounded px-7 py-3 ${
                type === "rent" ? "bg-white text-black" : "bg-slate-600 text-white"
            }`} >sell</button>
            <button id='type' type='button' onClick={onChange} value="rent" className={`font-medium text-sm shadow-md hover:shadow-lg active:shadow-lg focus:shadow-lg transition duration-150 ease-in-out uppercase w-full rounded px-7 py-3 ${
                type === "sale" ? "bg-white text-black" : "bg-slate-600 text-white"
            }`} >rent</button>
            </div>

            <p className="font-semibold text-lg mt-6">Name</p>
            <input type="text" id='name' value={name} placeholder="Name" required maxLength="35" minLength="12" onChange={onChange} className="w-full rounded px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white active:bg-white focus:border-slate-600 mb-6"/>

            <div className="flex space-x-6 mb-6">
                <div className="">
                    <p className="w-full font-semibold text-lg">Beds</p>
                    <input type="number" id="bedrooms" value={bedrooms} onChange={onChange}  min="1" max="49" required className='px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 transition duration-150 ease-in-out focus:bg-white focus:text-gray-700 focus:border-slate-600 text-center'/>
                </div>
                <div className="">
                    <p className="font-semibold text-lg">Baths</p>
                    <input type="number" id="bathrooms" value={bathrooms} onChange={onChange}  min="1" max="49" required className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 transition duration-150 ease-in-out focus:bg-white focus:text-gray-700 focus:border-slate-600 text-center'/>
                </div>
            </div>

            <p className="text-lg font-semibold">Parking spot</p>
            <div className="flex space-x-6 mb-6">
            <button type='button' id='parking' onClick={onChange} value={true} className={`font-medium text-sm shadow-md hover:shadow-lg active:shadow-lg focus:shadow-lg transition duration-150 ease-in-out uppercase w-full rounded px-7 py-3 ${
                !parking ? "bg-white text-black" : "bg-slate-700 text-white"
            }`}>yes</button>
            <button type='button' id='parking' onClick={onChange} value={false} className={`font-medium text-sm shadow-md hover:shadow-lg active:shadow-lg focus:shadow-lg transition duration-150 ease-in-out uppercase w-full rounded px-7 py-3 ${
                parking ? "bg-white text-black" : "bg-slate-700 text-white"
            }`}>No</button>
            </div>
            
            <p className="font-medium text-lg ">Furnished</p>
            <div className="flex space-x-6 mb-6">
                <button id='furnished' type='button' onClick={onChange} value={true} className={`font-medium text-sm shadow-md hover:shadow-lg active:shadow-lg focus:shadow-lg transition duration-150 ease-in-out uppercase w-full rounded px-7 py-3 ${
                !furnished ? "bg-white text-black" : "bg-slate-700 text-white"
            }`} >yes</button>
                <button id='furnished' type='button' onClick={onChange} value={false} className={`font-medium text-sm shadow-md hover:shadow-lg active:shadow-lg focus:shadow-lg transition duration-150 ease-in-out uppercase w-full rounded px-7 py-3 ${
                furnished ? "bg-white text-black" : "bg-slate-700 text-white"
            }`} >No</button>
            </div>

            <p className="font-semibold text-lg mt-6">Address</p>
            <textarea type="text" id='address' value={address} placeholder="Address" required onChange={onChange} className="w-full rounded px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white active:bg-white focus:border-slate-600 mb-6"/>

            {!geolocationEnabled && (
                <div className="flex space-x-6 justify-start mb-6">
                    <div className="">
                        <p className='text-lg font-semibold'>Latitude</p>
                        <input type="number" id="latitude" value={latitude} onChange={onChange}
                        required min="-90" max="90" className='w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300
                        rounded transition duration-150 ease-in-out focus:bg-white focus:text-gray-700 focus:border-slate-600
                        text-center'/>
                    </div>
                    <div className="">
                        <p className='text-lg font-semibold'>Longitude</p>
                        <input type="number" id="longitude" value={longitude} onChange={onChange}
                        required min="-180" max="180" className='w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300
                        rounded transition duration-150 ease-in-out focus:bg-white focus:text-gray-700 focus:border-slate-600
                        text-center'/>
                    </div>
                </div>
            )}
            <p className="font-semibold text-lg mt-6">Description</p>
            <textarea type="text" id='description' value={description} placeholder="Description" required onChange={onChange} className="w-full rounded px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white active:bg-white focus:border-slate-600 mb-6"/>
         
            <p className="font-medium text-lg ">Offer</p>
            <div className="flex space-x-6 mb-6">
                <button id='offer' type='button' onClick={onChange} value={true} className={`font-medium text-sm shadow-md hover:shadow-lg active:shadow-lg focus:shadow-lg transition duration-150 ease-in-out uppercase w-full rounded px-7 py-3 ${
                !offer ? "bg-white text-black" : "bg-slate-700 text-white"
            }`} >yes</button>
                <button id='offer' type='button' onClick={onChange} value={false} className={`font-medium text-sm shadow-md hover:shadow-lg active:shadow-lg focus:shadow-lg transition duration-150 ease-in-out uppercase w-full rounded px-7 py-3 ${
                offer ? "bg-white text-black" : "bg-slate-700 text-white"
            }`} >No</button>
            </div>

            <div className="flex items-center mb-6">
                <div className="">
                    <p className='text-lg font-semibold'>Regular Price</p>
                   <div className="flex w-full space-x-6 items-center justify-center">
                        <input type="number" id='regularPrice' value={regularPrice} onChange={onChange} min="50" max="300000000" required className='text-center w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600' />
                                {type === "rent" && (
                            <div className="text-md w-full whitespace-nowrap">
                                <p>$ / Month</p>
                            </div>
                            )}
                   </div>
                </div>
            </div>

            {offer && (
                <div className="flex items-center mb-6">
                <div className="">
                    <p className='text-lg font-semibold'>Discounted Price</p>
                   <div className="flex w-full space-x-6 items-center justify-center">
                        <input type="number" id='discountedPrice' value={discountedPrice} onChange={onChange} min="50" max="300000000" className='text-center w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600' />
                                {type === "rent" && (
                            <div className="text-md w-full whitespace-nowrap">
                                <p>$ / Month</p>
                            </div>
                            )}
                   </div>
                </div>
            </div>
            )}

            <div className="mb-6">
                <p className='font-medium text-lg'>Images</p>
                <p className='text-gray-400'>The first image will be the cover (max 6)</p>
                <input type="file" id="images" onChange={onChange} accept=".jpg,.png,.jpeg" required 
                className='bg-white w-full rounded py-2 px-3 text-gray-700 border border-gray-300 transition duration-150 ease-in-out focus:bg-white focus:border-slate-600 '/>
            </div>

            <button type="submit" className='w-full px-7 py-3 bg-blue-600 text-white font-medium mb-4 rounded uppercase shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg active:bg-blue-800 transition duration-150 ease-in-out'>Create Listing</button>
         </form>
    </main>
  )
}
