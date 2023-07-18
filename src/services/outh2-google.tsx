import { useContext } from "react";
import { useApi } from "../hooks/useApi";
import {
  Navigate,
  redirect,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { AuthContext } from "../contexts/Auth/AuthContext";


export function oauthSignIn() {
  var oauth2Endpoint = "";

  var params = {
    client_id:
      "110833050076-ib680ela4hfqr2c0lhc9h19snrsvltnd.apps.googleusercontent.com",
    redirect_uri: "http://localhost:5173/google-oauth-redirect",
    response_type: "token id_token",
    scope: "openid email",
    include_granted_scopes: "true",
    state: "pass-through value",
    nonce: Date.now(),
  };

  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");

  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v as string);
  }

  return url;
}

export function Outh2Element() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate()
    
  const params = new URLSearchParams(window.location.hash.substring(1));
  const id_token = params.get("id_token") as string;
  const response = useApi()
    .login_google(`${id_token}`)
    .then((res) => {
      auth.signin_google(res);
      if (auth.user !== null)
        navigate("/profile")
              
    })
    .catch((err) => {
      console.log("Error ao logar com conta google");
    })

    // if(auth.user != null){
    //   return <Navigate to={"/profile"}></Navigate>
    // }
    
  return <></>
}
