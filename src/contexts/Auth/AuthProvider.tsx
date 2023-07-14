import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { User } from "../../types/User";
import { useApi } from "../../hooks/useApi";

export const AuthProvider =  ({children} : {children: JSX.Element}) => {

    const [user, setUser] = useState<User | null>(null)
    const api = useApi();

    useEffect(() => {
        const validateToken = async () => {
            const storageData = localStorage.getItem('AuthToken');
            if (storageData) {
                const data = await api.validateToken();
                if (data.user) {
                    setUser(data.user);
                }
            }
        }
        validateToken();
    }, [api]);

    const signin = async (email :string , password : string) =>{
        const data = await api.signin(email,password)
        if(data.body.user && data.token){
            setUser(data.body.user)
            setToken(data.token)
            return true
           
        }
        return false    
    }
    const signout = async () => {
       await api.logout();
       setUser(null); 
       setToken("");
    }
    const setToken = (token: string) => {
        localStorage.setItem("AuthToken", token);
    }

    return(
        <AuthContext.Provider value={{user,signin, signout}}>
            {children}
        </AuthContext.Provider>
    )
}

