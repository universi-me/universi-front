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
            console.log("storage", storageData);
            if (storageData) {
                const data = await api.validateToken(storageData);
                if (data.user) {
                    setUser(data.user);
                }
            }
        }
        validateToken();
    }, []);

    const signin = async (email :string , password : string) =>{
        const data = await api.signin(email,password)
        console.log("data", data.user)
        if(data.user && data.token){
            setUser(data.user)
            setToken(data.token)
            console.log("entrou")
            return true
           
        }
        return false
    }
    const signout = async () => {
       await api.logout();
       setUser(null); 
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

