import { useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "@/contexts/Auth";
import "./LoginButton.less"

export function LoginButton() {
    const auth = useContext(AuthContext);

    const isLogged = useMemo(() => {
        return auth?.user !== null;
    }, [auth, auth?.user]);

    return isLogged
        ? <button onClick={auth?.signout} className="auth-button logout">Sair</button>
        : <Link to="/login" className="auth-button login">Entrar</Link>;
}
