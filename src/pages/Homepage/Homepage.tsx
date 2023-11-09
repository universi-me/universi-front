import { AuthContext } from "@/contexts/Auth";
import { useContext } from "react";
import { Navigate } from "react-router-dom";

export function Homepage() {
    const authContext = useContext(AuthContext);

    if (!authContext.profile)
        return <Navigate to="/login" />;

    return null;
}
