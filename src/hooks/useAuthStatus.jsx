import { getAuth, onAuthStateChanged } from 'firebase/auth'
import React, { useEffect, useState } from 'react'

export function useAuthStatus() {
    const [loggedIn, setLoggedIn] = useState(false)
    const [checkingStatus, setCheckingStatus] = useState(true)

    useEffect(()=>{
        const auth = getAuth()
        onAuthStateChanged(auth, (user)=>{
            if(user){
                setLoggedIn(true)
            }
            setCheckingStatus(false)
        })
    }, []) // add the square bracket to call the useEffect 1 time
  return {loggedIn, checkingStatus}
}
// added two hooks using useState(). The login is false as default but we set true if the person is
//  authenticated and we gonna check it by the onAuthStateChange() and it gives us true or false
// after checking we use the loggedIn and checkingStatus in the PrivateRoute