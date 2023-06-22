import Singin from "../../../src/pages/singin/Singin";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export const RequireAuth = ({children} : {children : JSX.Element}) => {
    
    const auth = useContext(AuthContext);

    if (auth.user == null) {
        return <Singin />;
    }

    return children;
}