import { useContext, useState } from "react";

import { oauthSignInUrl } from "@/services/oauth2-google";
import { SignUpModal } from "@/pages/SignUp";
import { IMG_DCX_LOGO } from "@/utils/assets";

import "./SignUp.less"
import AuthContext from "@/contexts/Auth";

export default function SignUpPage() {
    const authContext = useContext(AuthContext);
    const [showSignUpModal, setShowSignUpModal] = useState<boolean>(false);

    const googleClientId = authContext.organization.groupSettings.environment?.google_client_id;
    const googleUrl = googleClientId
        ? oauthSignInUrl({ client_id: googleClientId })
        : undefined;

    const ENABLE_GOOGLE_LOGIN = googleUrl !== undefined
        && (authContext.organization.groupSettings.environment?.login_google_enabled ?? false);

    return (
        <div id="sign-up-page">
            <div className="page-container">

                <div className="welcome-wrapper">
                    <h2 className="welcome-text">Faça parte agora mesmo!</h2>
                </div>

                <div className="signup-container">
                    <div className="signup-box">
                        {
                            !ENABLE_GOOGLE_LOGIN ? null
                            : <>
                                <a href={googleUrl.href} className="google-login">
                                    <img src={IMG_DCX_LOGO} alt="DCX" />
                                    Entrar com DCX
                                </a>

                                <div className="signup-line-container">
                                    <div className="signup-line" />
                                    <div className="other-email">ou com outro email</div>
                                    <div className="signup-line" />
                                </div>
                            </>
                        }

                        <button className="create-account-button" onClick={() => setShowSignUpModal(true)}>
                            Criar conta
                        </button>
                    </div>
                    <div className="tos">Ao se inscrever, você concorda com os <a>Termos de Serviço</a> e a <a>Política de Privacidade</a>.</div>
                </div>

                {
                    showSignUpModal ? <SignUpModal toggleModal={setShowSignUpModal} /> : null
                }

            </div>

        </div>
    );
}
