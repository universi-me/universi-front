import { useContext } from "react";
import { UniversimeApi } from "@/services/UniversimeApi";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/contexts/Auth/AuthContext";


const oauth2Endpoint = "https://accounts.google.com/o/oauth2/v2/auth";
const oauth2Params = {
    client_id: "110833050076-ib680ela4hfqr2c0lhc9h19snrsvltnd.apps.googleusercontent.com",
    redirect_uri: location.origin + "/google-oauth-redirect",
    response_type: "token id_token",
    scope: "openid email",
    include_granted_scopes: "true",
    state: "pass-through value",
};

export function oauthSignIn() {
    const params = { ...oauth2Params, nonce: Date.now() }
    const url = new URL(oauth2Endpoint);

    for (const [k, v] of Object.entries(params)) {
        url.searchParams.set(k, v as string);
    }

    return url;
}

export function OAuth2Element() {
    const auth = useContext(AuthContext);
    const navigate = useNavigate()

    const params = new URLSearchParams(window.location.hash.substring(1));
    const id_token = params.get("id_token") as string;

    UniversimeApi.Auth.login_google({ token: id_token })
        .then((res) => {
            if (!res.success)
                navigate("/login")
            
            else {
                auth.signin_google(res)
                .then(success => {
                    if (success)
                        navigate(`/capacitacao`);

                    else
                        navigate("/login")
                })
            }
        })
        .catch((err) => {
            console.log("Error ao logar com conta google");
        })

    return <></>
}
