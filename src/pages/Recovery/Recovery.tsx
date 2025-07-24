import "./Recovery.css"
import "../singin/SignInForm.less"
import {useState, useContext, useRef} from "react"
import { UniversimeApi } from "@/services"
import { AuthContext } from "@/contexts/Auth/AuthContext";
import * as SwalUtils from "@/utils/sweetalertUtils"
import ReCAPTCHA from "react-google-recaptcha-enterprise";

export default function Recovery(){
    const auth = useContext(AuthContext);

    const [username, setUsername] = useState("")
    const [msg, setMsg] = useState<null | string>(null)
    const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
    const recaptchaRef = useRef<Nullable<ReCAPTCHA>>(null);
    const [recaptchaWidgetKey, setRecaptchaWidgetKey] = useState(0);

    const handleRecaptchaChange = (token: string | null) => {
        setRecaptchaToken(token);
    };

    function handleRecover(){
        SwalUtils.fireToasty({title: "Verificando dados"})
        UniversimeApi.Auth.recoverPassword({username, recaptchaToken: recaptchaToken ?? undefined})
        .then(res =>{
            if(res.isSuccess()) {
                setMsg(res.errorMessage ?? "Houve um erro")
            }
        })
        setRecaptchaWidgetKey(prev => prev + 1);
        setRecaptchaToken(null);
    }

    const organizationEnv = (((auth.organization??{} as any).groupSettings??{} as any).environment??{} as any);
    const ENABLE_RECAPTCHA = organizationEnv.recaptcha_enabled ?? (import.meta.env.VITE_ENABLE_RECAPTCHA === "true" || import.meta.env.VITE_ENABLE_RECAPTCHA === "1");
    const RECAPTCHA_SITE_KEY = organizationEnv.recaptcha_site_key ?? import.meta.env.VITE_RECAPTCHA_SITE_KEY;

    return(
        <div>
            <div className="center-container container">
                <h3 className="center-text">Recuperação de senha</h3>
                <div className="form-container">
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
                        ENABLE_RECAPTCHA && RECAPTCHA_SITE_KEY &&
                        <center>
                            <br/>
                                <ReCAPTCHA key={ recaptchaWidgetKey } ref={ recaptchaRef } sitekey={ RECAPTCHA_SITE_KEY } onChange={ handleRecaptchaChange } />
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