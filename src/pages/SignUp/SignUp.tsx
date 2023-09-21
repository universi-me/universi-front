import { useState } from "react";

import { oauthSignIn } from "@/services/oauth2-google";
import { SignUpModal } from "@/pages/SignUp";
import { IMG_DCX_LOGO } from "@/utils/assets";

import "./SignUp.less"

export default function SignUpPage() {
    const [showSignUpModal, setShowSignUpModal] = useState<boolean>(false);

    const googleUrl = oauthSignIn();

    const ENABLE_GOOGLE_LOGIN = import.meta.env.VITE_ENABLE_GOOGLE_LOGIN === "true" || import.meta.env.VITE_ENABLE_GOOGLE_LOGIN === "1";

    return (
        <div id="sign-up-page">
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
    );
}
