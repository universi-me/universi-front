import { useState } from "react";
import { AuthContext } from "./AuthContext";
import { User } from "../../types/User";

export const AuthProvider =  ({children} : {children: JSX.Element}) => {

    const [user, setUser] = useState<User | null>(null)

    const signin = (email :string , password : string) =>{
        
    }
    // const signout = () => {
        
    // }

    // return(
    //     <AuthContext.Provider value={{user,signin, signout}}>
    //         {children}
    //     </AuthContext.Provider>
    // )
}

