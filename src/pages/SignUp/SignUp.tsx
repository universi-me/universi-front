import { oauthSignIn } from "@/services/oauth2-google";

import dcxImage from "@/assets/imgs/dcx-png 1.png"

import "./SignUp.less"

export default function SignUpPage() {
    const googleUrl = oauthSignIn();

    return (
        <div id="sign-up-page">
            <div className="welcome-wrapper">
                <h2 className="welcome-text">Faça parte agora mesmo!</h2>
            </div>

            <div className="signup-container">
                <div className="signup-box">
                    <a href={googleUrl.href} className="google-login">
                        <img src={dcxImage} alt="DCX" />
                        Entrar com DCX
                    </a>

                    <div className="signup-line-container">
                        <div className="signup-line" />
                        <div className="other-email">ou com outro email</div>
                        <div className="signup-line" />
                    </div>

                    <button className="create-account-button">Criar conta</button>
                </div>
                <div className="tos">Ao se inscrever, você concorda com os <a>Termos de Serviço</a> e a <a>Política de Privacidade</a>.</div>
            </div>
        </div>
    );
}
