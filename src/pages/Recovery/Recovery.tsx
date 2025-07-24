import "./Recovery.css"
import "../singin/SignInForm.less"
import {useState, useContext, useRef} from "react"
import { useNavigate } from "react-router-dom"
import { UniversimeApi } from "@/services"
import { AuthContext } from "@/contexts/Auth/AuthContext";
import * as SwalUtils from "@/utils/sweetalertUtils"
import ReCAPTCHA from "react-google-recaptcha-enterprise";
import UniversiForm from "@/components/UniversiForm";

export default function Recovery(){
    const navigate = useNavigate();
    const auth = useContext(AuthContext);

    const recaptchaRef = useRef<Nullable<ReCAPTCHA>>(null);
    const [recaptchaWidgetKey, setRecaptchaWidgetKey] = useState(0);

    const organizationEnv = (((auth.organization??{} as any).groupSettings??{} as any).environment??{} as any);
    const ENABLE_RECAPTCHA = organizationEnv.recaptcha_enabled ?? (import.meta.env.VITE_ENABLE_RECAPTCHA === "true" || import.meta.env.VITE_ENABLE_RECAPTCHA === "1");
    const RECAPTCHA_SITE_KEY = organizationEnv.recaptcha_site_key ?? import.meta.env.VITE_RECAPTCHA_SITE_KEY;

    return(
        <UniversiForm.Root id="recovery-password-modal" title="Recuperação de Conta" callback={ recoveryAccount } skipCancelConfirmation={ true } >
            <UniversiForm.Input.Text
                required
                param="username"
                label="Nome de usuário ou e-mail"
                placeholder="Insira seu usuario ou e-mail"
            />
            { ENABLE_RECAPTCHA && RECAPTCHA_SITE_KEY && <UniversiForm.Input.ReCaptcha
                key={ recaptchaWidgetKey }
                param="recaptchaToken"
                sitekey={ RECAPTCHA_SITE_KEY }
                ref={ recaptchaRef }
                required
            />}
        </UniversiForm.Root>
    )

    async function recoveryAccount( data: UniversiForm.Data<UniversimeApi.Auth.RecoverPassword_RequestDTO> ) {
        if ( !data.confirmed ) {
            navigate( "/" )
            return;
        }
    
        SwalUtils.fireToasty({title: "Verificando dados"})
        const res = await UniversimeApi.Auth.recoverPassword({
            username: data.body!.username,
            recaptchaToken: data.body!.recaptchaToken ?? undefined,
        })
        .then(res =>{
            if(res.isSuccess()) {
                SwalUtils.fireToasty({
                    title: "Recuperação de Conta",
                    text: "Uma mensagem foi enviada para o seu e-mail com as instruções de recuperação",
                });
                navigate( "/" )
            }
        })
        setRecaptchaWidgetKey(prev => prev + 1);
    };
}