import React from 'react';
import {Link} from "react-router-dom";
import Moment from "react-moment";
import {MdLocationOn} from "react-icons/md"

export default function Listingitem({listing, id}) {
  return <li className='bg-white relative flex flex-col justify-between items-center shadow-md hover:shadow-xl rounded-md overflow-hidden transition-shadow duration-150 m-[10px]'>
      <Link className='contents' to={`/category/${listing.type}/${id}`}>
          <img className='h-[170px] w-full object-cover hover:scale-105 transition-scale duration-200 ease-in' loading='lazy' src={listing.imgUrls[0]} alt={listing.name} />
          <Moment className="absolute top-2 left-2 bg-[#3377cc] text-white uppercase rounded-md text-xs font-semibold px-2 py-1 shadow-lg" fromNow>{listing.timestamp?.toDate()}</Moment>
          <div className="w-full p-[10px]">
            <div className="flex items-center space-x-1">
              <MdLocationOn className='h-4 w-4 text-green-700'></MdLocationOn>
              <p className='font-semibold text-sm mb-[2px] text-gray-600 truncate'>{listing.address}</p>
            </div>
            <p className='m-0 font-semibold text-xlg truncate'>{listing.name}</p>
            <p className='text-[#457b9d] mt-2 font-semibold'>${listing.offer
                 ? listing.discountedPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : listing.regularPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            {listing.type === "rent" && " / month"}
            </p>
            <div className="flex items-center mt-[10px] space-x-3">
              <div className="flex items-center space-x-1">
                <p className='font-bold text-xs'>{listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : "1 Bed"}</p>
              </div>
              <div className="flex items-center space-x-1">
                <p className='font-bold text-xs'>{listing.bathrooms > 1 ? `${listing.bathrooms} Baths` : "1 Bath"}</p>
              </div>
            </div>
          </div>
      </Link>
  </li>
}
