import React, { useState } from 'react'

export default function CreateListing() {
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
    })
    const {type, regularPrice, offer, name, bedrooms, bathrooms, parking, furnished, description, address, discountedPrice} = formData
    function onChange(){}
  return (
    <main className='max-w-md px-2 mx-auto'>
         <h1 className='text-3xl mt-8 text-center font-bold'>Create a Listing</h1> 
         
         <form >
            <p className='font-semibold text-lg mt-6'>Sell / Rent</p>
            <div className="flex space-x-6">
            <button id='type' type='button' onClick={onChange} value="sale" className={`font-medium text-sm shadow-md hover:shadow-lg active:shadow-lg focus:shadow-lg transition duration-150 ease-in-out uppercase w-full rounded px-7 py-3 ${
                type === "rent" ? "bg-white text-black" : "bg-slate-600 text-white"
            }`} >sell</button>
            <button id='type' type='button' onClick={onChange} value="sale" className={`font-medium text-sm shadow-md hover:shadow-lg active:shadow-lg focus:shadow-lg transition duration-150 ease-in-out uppercase w-full rounded px-7 py-3 ${
                type === "sale" ? "bg-white text-black" : "bg-slate-600 text-white"
            }`} >rent</button>
            </div>

            <p className="font-semibold text-lg mt-6">Name</p>
            <input type="text" id='name' value={name} placeholder="Name" required maxLength="32" minLength="12" onChange={onChange} className="w-full rounded px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white active:bg-white focus:border-slate-600 mb-6"/>

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
            <button type='button' id='parking' value={true} className={`font-medium text-sm shadow-md hover:shadow-lg active:shadow-lg focus:shadow-lg transition duration-150 ease-in-out uppercase w-full rounded px-7 py-3 ${
                !parking ? "bg-white text-black" : "bg-slate-700 text-white"
            }`}>yes</button>
            <button type='button' id='parking' value={false} className={`font-medium text-sm shadow-md hover:shadow-lg active:shadow-lg focus:shadow-lg transition duration-150 ease-in-out uppercase w-full rounded px-7 py-3 ${
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
