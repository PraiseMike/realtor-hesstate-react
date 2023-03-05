import { useLocation, useNavigate } from "react-router"
export default function Header() {
    const location = useLocation()
    const navigate = useNavigate()
    function pathMathRoute(route){
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
                    <li className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent ${pathMathRoute("/") && "text-black border-b-red-500"}`}
                    onClick={()=>navigate("/")}>
                        Home</li>
                    <li className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-red-5 ${pathMathRoute("/offers") && "border-b-red-500 text-black"}`}
                    onClick={()=>navigate("/offers")}> 
                    Offers</li>
                    <li className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent ${pathMathRoute("/sign-in") && "text-black border-b-red-500"}`}
                    onClick={()=>navigate("/sign-in")}>
                        Sign In</li>
                </ul>
            </div>
        </header>
    </div>
  )
}
