import { useContext, useEffect } from "react";
import { UniversimeApi } from "@/services";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/contexts/Auth/AuthContext";

export function KeyCloakOAuth2Element() {
    const auth = useContext(AuthContext);
    const navigate = useNavigate()

    const params = new URLSearchParams(window.location.href);
    const code = params.get("code")!;

    useEffect(() => {
        UniversimeApi.Auth.login_keycloak({ code: code })
        .then((res) => {
            if (!res.isSuccess())
                navigate("/login")
            
            else {
                var profile = auth.signinGoogle();
            
                if(profile != null) {
                    navigate("/");
                }
            }
        })
        .catch((err) => {
            console.log("Error ao logar com keycloak");
            navigate("/");
        })
    }, [code])

    return <></>
}
