import { useApi } from "../hooks/useApi";
import { Navigate, redirect, useParams, useSearchParams } from "react-router-dom";

export function oauthSignIn() {
    // Google's OAuth 2.0 endpoint for requesting an access token
    var oauth2Endpoint = '';

    // Parameters to pass to OAuth 2.0 endpoint.
    var params = {
        'client_id': '110833050076-ib680ela4hfqr2c0lhc9h19snrsvltnd.apps.googleusercontent.com',
        'redirect_uri': 'http://localhost:5173/google-oauth-redirect',
        'response_type': 'token id_token',
        'scope': 'openid email',
        'include_granted_scopes': 'true',
        'state': 'pass-through value',
        'nonce': Date.now(),
		
    };

    const url = new URL(

        "https://accounts.google.com/o/oauth2/v2/auth"
    )

    for(const [k,v] of Object.entries(params)){
        url.searchParams.set(k,v)
    }


    return url
    

}

export function Outh2Element() {
    // const [params, setParams] = useSearchParams()
    const params = new URLSearchParams(window.location.hash.substring(1))
    const id_token = params.get("id_token") as string
    console.log("token: ",params)
    const response = useApi().login_google(`${id_token}`)
        .then((res)=> {
            console.log(res)
        })
    
    
    return (
       // <Navigate to={"/profile"} />
        <div>
            dadasd
        </div>
    )
}