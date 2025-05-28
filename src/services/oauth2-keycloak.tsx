import { useContext, useEffect, useRef } from "react";
import { UniversimeApi } from "@/services";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/contexts/Auth/AuthContext";
import * as SweetAlertUtils from "@/utils/sweetalertUtils";


export function KeyCloakOAuth2Element() {
    const auth = useContext(AuthContext);
    const navigate = useNavigate()

    // prevents StrictMode to run two login functions simultaneously
    // https://react.dev/reference/react/StrictMode
    const loggingIn = useRef( false );

    useEffect(() => {
        handleKeycloakLogin();
    }, [])

    return <></>

    async function handleKeycloakLogin() {
        if ( loggingIn.current ) return;
        loggingIn.current = true;

        const code = new URLSearchParams( window.location.href ).get( "code" )!;

        const res = await UniversimeApi.Auth.login_keycloak( { code } );
        if ( res.isSuccess() ) {
            await auth.updateLoggedUser();
        }

        else {
            await SweetAlertUtils.fireModal( {
                title: "Erro ao fazer login com Keycloak",
                text: res.errorMessage
                    ?? "Não foi possível efetuar o login com Google.\nTente novamente em alguns minutos ou entre em contato com o suporte.",
                confirmButtonText: "Voltar para o login",
            } );
        }

        await navigate( "/" );
        loggingIn.current = false;
    }
}
