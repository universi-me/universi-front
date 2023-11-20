import { Header } from "@/components/UniversiHeader"
import "./Recovery.css"
import { transform } from "@babel/core"
import { Translate } from "phosphor-react"
import "../singin/signinForm.css"
import {useState} from "react"
import UniversimeApi from "@/services/UniversimeApi"
import * as SwalUtils from "@/utils/sweetalertUtils"
import ReCAPTCHA from "react-google-recaptcha-enterprise";

export default function Recovery(){

    const [username, setUsername] = useState("")
    const [msg, setMsg] = useState<null | string>(null)
    const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
    const [recaptchaRef, setRecaptchaRef] = useState<any>(null);

    const handleRecaptchaChange = (token: string | null) => {
        setRecaptchaToken(token);
    };

    function handleRecover(){
        SwalUtils.fireToasty({title: "Verificando dados"})
        UniversimeApi.User.recoverPassword({username, recaptchaToken})
        .then(res =>{
            if(res.success) {
                setMsg(res.message ?? "Houve um erro")
            } else {
                recaptchaRef.reset();
            }
        })
    }

    const ENABLE_RECAPTCHA = import.meta.env.VITE_ENABLE_RECAPTCHA === "true" || import.meta.env.VITE_ENABLE_RECAPTCHA === "1";

    return(
        <div>
            <div className="center-container">
                <h3 className="center-text">Recuperação de senha</h3>
                <div className="container form-container">
                    <div className="form-group">
                        <div className="label-form">
                            <span className="material-symbols-outlined">mail</span>
                        </div>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Insira seu usuario ou e-mail"
                            required
                        />
                    </div>

                    {
                        !ENABLE_RECAPTCHA ? null :
                            <center>
                                <br/>
                                <ReCAPTCHA ref={(r) => setRecaptchaRef(r) } sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY} onChange={handleRecaptchaChange} />
                                <br/>
                            </center>
                    }

                    <button
                        type="submit"
                        value="Entrar"
                        className="btn_form"
                        onClick={handleRecover}
                    >
                        ENVIAR
                    </button>

                </div>
            </div>
        </div>

    )

}