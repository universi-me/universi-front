import { useApi } from "../hooks/useApi";
import { Navigate, redirect, useParams, useSearchParams } from "react-router-dom";

export function oauthSignIn() {
    // Google's OAuth 2.0 endpoint for requesting an access token
    var oauth2Endpoint = '';

    // Parameters to pass to OAuth 2.0 endpoint.
    var params = {
        'client_id': '110833050076-ib680ela4hfqr2c0lhc9h19snrsvltnd.apps.googleusercontent.com',
        'redirect_uri': 'http://localhost:5173/google-oauth-redirect',
        'response_type': 'id_token',
        'scope': 'https://www.googleapis.com/auth/admin.directory.user.readonly',
        'include_granted_scopes': 'true',
        'state': 'pass-through value',
        'nonce': 'aaa4ss-ss'
       
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
    const type_token =  params.get("token_type") as string
    const access_token = params.get("access_token") as string
    console.log("token: ",params)
    const response = useApi().login_google(`${type_token} ${access_token}`)
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