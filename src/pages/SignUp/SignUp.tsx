import { useContext, useState } from "react";

import AuthContext from "@/contexts/Auth";
import SignInWithGoogle from "@/components/SignInWithGoogle/SignInWithGoogle";
import { SignUpModal, SignUpPageData } from "@/pages/SignUp";

import "./SignUp.less"
import { useLoaderData } from "react-router";

export default function SignUpPage() {
    const authContext = useContext(AuthContext);
    const { departments } = useLoaderData() as SignUpPageData;

    const [showSignUpModal, setShowSignUpModal] = useState<boolean>(false);

    const googleClientId = authContext.organization.groupSettings.environment?.google_client_id;

    const ENABLE_GOOGLE_LOGIN = googleClientId !== undefined
        && (authContext.organization.groupSettings.environment?.login_google_enabled ?? false);

    return (
        <div id="sign-up-page">
            <div className="page-container">

                <div className="welcome-wrapper">
                    <h2 className="welcome-text">Faça parte agora mesmo!</h2>
                </div>

                <div className="signup-container">
                    <div className="signup-box">
                        { ENABLE_GOOGLE_LOGIN && <>
                                <SignInWithGoogle client_id={ googleClientId } />

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
                </div>

                {
                    showSignUpModal ? <SignUpModal toggleModal={setShowSignUpModal} departments={ departments } /> : null
                }

            </div>

        </div>
    );
}
