import { useContext, useState } from "react";

import AuthContext from "@/contexts/Auth";
import AlternativeSignIns from "@/components/AlternativeSignIns";
import { SignUpModal, SignUpPageData } from "@/pages/SignUp";

import "./SignUp.less"
import { useLoaderData } from "react-router";

export default function SignUpPage() {
    const authContext = useContext(AuthContext);
    const { departments } = useLoaderData() as SignUpPageData;

    const [showSignUpModal, setShowSignUpModal] = useState<boolean>(false);

    return (
        <div id="sign-up-page">
            <div className="page-container">

                <div className="welcome-wrapper">
                    <h2 className="welcome-text">Faça parte agora mesmo!</h2>
                </div>

                <div className="signup-container">
                    <div className="signup-box">
                        <AlternativeSignIns
                            environment={ authContext.organization.groupSettings.environment }
                            bottomDivider={ { text: "ou com outro email", color: "var(--font-color-v1)" } }
                            style={ { marginBottom: "15px" } }
                        />

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
