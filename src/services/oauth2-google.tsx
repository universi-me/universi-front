import { useContext, useEffect, useRef } from "react";
import { UniversimeApi } from "@/services";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/contexts/Auth/AuthContext";
import * as SweetAlertUtils from "@/utils/sweetalertUtils";

const oauth2Endpoint = "https://accounts.google.com/o/oauth2/v2/auth";
const oauth2Params = {
    redirect_uri: location.origin + "/google-oauth-redirect",
    response_type: "token id_token",
    scope: "openid email",
    include_granted_scopes: "true",
    state: "pass-through value",
};

export type OauthSignInParams = {
    client_id: string;
}

export function oauthSignInUrl(options: OauthSignInParams) {
    const params = { ...oauth2Params, ...options, nonce: Date.now() }
    const url = new URL(oauth2Endpoint);

    for (const [k, v] of Object.entries(params)) {
        url.searchParams.set(k, v.toLocaleString());
    }

    return url;
}

export function OAuth2Element() {
    const auth = useContext(AuthContext);
    const navigate = useNavigate()

    // prevents StrictMode to run two login functions simultaneously
    // https://react.dev/reference/react/StrictMode
    const loggingIn = useRef( false );

    const id_token = new URLSearchParams(window.location.hash.substring(1)).get("id_token")!;

    useEffect(() => { handleGoogleLogin() }, []);

    return <></>

    async function handleGoogleLogin() {
        if ( loggingIn.current ) return;
        loggingIn.current = true;

        const response = await UniversimeApi.Auth.login_google({ token: id_token })
            .catch(err => null);

        if (response === null) {
            await SweetAlertUtils.fireModal({
                title: "Erro ao fazer login com Google",
                text: "Não foi possível efetuar o login com Google."
                    + "Tente novamente em alguns minutos ou entre em contato com o suporte.",
                confirmButtonText: "Voltar para o login",
            });
        }

        else if ( response.isSuccess() ) {
            await auth.updateLoggedUser();
        }

        else {
            await SweetAlertUtils.fireModal({
                title: "Erro ao fazer login com Google",
                text: response.errorMessage,
                confirmButtonText: "Voltar para o login",
            });
        }

        await navigate( "/" );
        loggingIn.current = false;
    }
}
