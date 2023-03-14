import { useEffect, useState } from "react"
import{getAuth, onAuthStateChanged} from "firebase/auth"
import { useLocation, useNavigate } from "react-router"
export default function Header() {
    const [pageState, setPagesState] = useState("Sign in")
    const location = useLocation()
    const navigate = useNavigate()
    const auth = getAuth()
    useEffect(()=>{
        onAuthStateChanged(auth, (user)=>{
            if(user){
                setPagesState("Profile")
            }
            else{
                setPagesState("Sign in")
            }
        })
    }, [auth])
    function pathMatchRoute(route){
        if(route === location.pathname){
            return true
        }
    }
    
  return (
    <div className='bg-white border-b shadow-sm sticky top-0 z-50'>
        <header className='flex justify-between items-center px-3 max-w-6xl mx-auto'>
            <p className="cursor-pointer text-red-500 text-2xl" 
            onClick={()=>navigate("/")}
            >HESS<span className="text-black">tate.com</span></p>
            <div>
                <ul className="flex space-x-10">
                    <li className={`cursor-pointer py-3 text-sm font-semibold text-gray-500 border-b-[3px] border-b-transparent ${pathMatchRoute("/") && " text-black border-b-red-600"}`}
                    onClick={()=>navigate("/")}>
                        Home</li>
                    <li className={`cursor-pointer py-3 text-sm font-semibold text-gray-500 border-b-[3px] border-b-transparent ${pathMatchRoute("/offers") && "border-b-red-600 text-black"}`}
                    onClick={()=>navigate("/offers")}> 
                    Offers</li>
                    <li className={`cursor-pointer py-3 text-sm font-semibold text-gray-500 border-b-[3px] border-b-transparent ${(pathMatchRoute("/sign-in") || pathMatchRoute("/profile")) && "text-black border-b-red-600"}`}
                    onClick={()=>navigate("/profile")}>
                        {pageState}
                    </li>
                </ul>
            </div>
        </header>
    </div>
  )
}
