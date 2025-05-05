import { FocusEvent, useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router";
import ReCAPTCHA from "react-google-recaptcha-enterprise";

import UniversiForm from "@/components/UniversiForm2";
import { UniversimeApi } from "@/services"
import { isEmail } from "@/utils/regexUtils";
import { AuthContext } from "@/contexts/Auth/AuthContext";
import { enableSignUp } from "./helperFunctions";
import * as SwalUtils from "@/utils/sweetalertUtils";

import "./SignUpModal.less"
import NewPasswordInput from "@/components/NewPasswordInput/NewPasswordInput";

export type SignUpModalProps = {
    toggleModal: (state: boolean) => any;
    departments: Department.DTO[];
};

const FIRST_NAME_MAX_LENGTH = 21;
const LAST_NAME_MAX_LENGTH = 21;
const EMAIL_MAX_LENGTH = 255;
const USERNAME_MAX_LENGTH = 255;

const USERNAME_CHAR_REGEX = /[a-z0-9_.-]/

export function SignUpModal(props: SignUpModalProps) {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    const [firstname, setFirstname] = useState<string>("");
    const [lastname, setLastname] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const [isPasswordValid, setIsPasswordValid] = useState<NullableBoolean>(false);

    const [usernameAvailable, setUsernameAvailable] = useState<boolean>(false);
    const [usernameAvailableChecked, setUsernameAvailableChecked] = useState<boolean>(false);
    const [usernameUnavailableMessage, setUsernameUnavailableMessage] = useState<string>('');
    const usernameRef = useRef<Nullable<HTMLInputElement>>(null);

    const [emailAvailable, setEmailAvailable] = useState<Nullable<boolean>>( null );
    const emailAvailableChecked = emailAvailable !== null;
    const [emailUnavailableMessage, setEmailUnavailableMessage] = useState<string>('');

    const [department, setDepartment] = useState<Optional<string>>( undefined );

    const [recaptchaToken, setRecaptchaToken] = useState<string | undefined>(undefined);
    const recaptchaRef = useRef<Nullable<ReCAPTCHA>>(null);

    const isFirstnameFull = (firstname.length) >= FIRST_NAME_MAX_LENGTH;
    const isLastnameFull = (lastname.length) >= LAST_NAME_MAX_LENGTH;

    const canSignUp = enableSignUp(username, email, password) && isPasswordValid && usernameAvailable && emailAvailable;

    const handleRecaptchaChange = (token: string | null) => {
        setRecaptchaToken(token ?? undefined);
    };

    useEffect(() => {
        if ( usernameRef.current )
            usernameRef.current.value = username;

        setUsernameAvailableChecked(false);
        const delayDebounceFn = setTimeout(async () => {
            if(username.length < 1) {
                setUsernameAvailable(false);
                return;
            }
            const resp = await UniversimeApi.User.usernameAvailable( username );
            setUsernameAvailable(resp.isSuccess() && resp.body?.available);
            setUsernameUnavailableMessage((resp.body as any)!?.reason ?? 'Usuário não está disponivel para uso.');
            setUsernameAvailableChecked(true);
        }, 1000)
        return () => clearTimeout(delayDebounceFn)
    }, [username])

    useEffect(() => {
        setEmailAvailable( null );
        const delayDebounceFn = setTimeout(async () => {
            if(email.length < 1) {
                setEmailAvailable( null );
                return;
            }
            const resp = await UniversimeApi.User.emailAvailable( email );
            setEmailAvailable(resp.isSuccess() && resp.body?.available);
            setEmailUnavailableMessage( resp.errorMessage ?? 'Email não está disponível para uso.' );
        }, 1000)
        return () => clearTimeout(delayDebounceFn)
    }, [email])

    const organizationEnv = (((auth.organization??{} as any).groupSettings??{} as any).environment??{} as any);
    const ENABLE_RECAPTCHA = organizationEnv.recaptcha_enabled ?? (import.meta.env.VITE_ENABLE_RECAPTCHA === "true" || import.meta.env.VITE_ENABLE_RECAPTCHA === "1");
    const RECAPTCHA_SITE_KEY = organizationEnv.recaptcha_site_key ?? import.meta.env.VITE_RECAPTCHA_SITE_KEY;

    return <UniversiForm.Root id="sign-up-modal" title="Cadastro" asModal callback={ createAccount } >
        <UniversiForm.Input.Text required param="firstname"
            label="Nome" placeholder="Insira seu nome"
            maxLength={FIRST_NAME_MAX_LENGTH} onChange={ setFirstname }
        />

        <UniversiForm.Input.Text required param="lastname"
            label="Sobrenome" placeholder="Insira seu sobrenome"
            maxLength={LAST_NAME_MAX_LENGTH} onChange={ setLastname }
        />

        <div>
        <UniversiForm.Input.Text param="email"
            label="Email"
            placeholder="novousuario@email.com" required
            maxLength={EMAIL_MAX_LENGTH} omitCharLimit
            type="email" onBlur={ onBlurEmail }
            onChange={ newEmail => { setEmail( newEmail ) } }
        />
        { emailAvailableChecked && <section className="password-requirements">
             <p className={`bi fieldset-info ${emailAvailable?'success-validation':'failed-validation'}`}>
                { emailAvailable ? 'Email Disponível para uso.' : emailUnavailableMessage }
            </p>
        </section> }
        </div>

        <div>
        <UniversiForm.Input.Text required param="username"
            label="Nome de usuário" ref={ usernameRef }
            placeholder="nome_sobrenome" maxLength={USERNAME_MAX_LENGTH} omitCharLimit
            onChange={ newUsername => {
                const filteredUsername = Array.from( newUsername )
                    .filter(c => USERNAME_CHAR_REGEX.exec(c) !== null)
                    .join( "" );

                setUsername( filteredUsername );
            } }
        />
        <section className="password-requirements">
            { usernameAvailableChecked ? <p className={`bi fieldset-info ${usernameAvailable?'success-validation':'failed-validation'}`}>{usernameAvailable?'Usuário Disponível para uso.':usernameUnavailableMessage}</p> : null }
            <p className="fieldset-info">
                Você só pode usar letras minúsculas, números, hífen (-), underscore (_) e ponto (.).<br/>
                Todos irão acessar seu perfil em: <div className="profile-url-preview">{location.origin}/profile/{username || "<insira um nome de usuário>"}</div>
            </p>
        </section>
        </div>

        { props.departments.length > 0 && <UniversiForm.Input.Select
            param="department"
            label="Órgão/Área"
            placeholder="Selecionar órgão/área"
            isClearable
            options={ props.departments }
            getOptionLabel={ d => `${ d.acronym } – ${ d.name }` }
            getOptionUniqueValue={ d => d.id }
            onChange={ d => setDepartment( d?.id ) }
            optionNotFoundMessage={ inputValue => `Não foi possível encontrar o órgão/área "${ inputValue }"` }
        /> }

        <UniversiForm.Input.Password
            param="password"
            label="Senha"
            required
            mustConfirm
            mustMatchRequirements
            onChange={ setPassword }
            onCheckValidity={ v => setIsPasswordValid( v.allValid ) }
        />

        { ENABLE_RECAPTCHA && <UniversiForm.Input.ReCaptcha
            param="recaptchaToken"
            sitekey={ RECAPTCHA_SITE_KEY }
            onChange={ handleRecaptchaChange }
            ref={ recaptchaRef }
        />}
    </UniversiForm.Root>

    // return (
    //     <UniversiModal>
    //         <div id="sign-up-modal">
    //             <form>
    //                 <div className="submit">
    //                     <button type="submit" className="create-account" onClick={createAccount}
    //                         disabled={!canSignUp} title={!canSignUp ? "Preencha todos os campos corretamente para poder se cadastrar" : undefined}>
    //                         Criar conta
    //                     </button>
    //                 </div>
    //             </form>
    //         </div>
    //     </UniversiModal>
    // );

    async function createAccount( data: UniversiForm.Data<SignUpForm> ) {
        if ( !data.confirmed ) {
            props.toggleModal( false );
            return
        }

        const { firstname, lastname, username, email, password, department, recaptchaToken } = data.body;
        const res = await UniversimeApi.User.signup({ firstname, lastname, username, email, password, recaptchaToken, department: department?.acronym });

        if ( res.isSuccess() ) {
            navigate( "/login" );
            return;
        }

        recaptchaRef.current?.reset();
        SwalUtils.fireModal({
            title: "Erro ao criar sua conta",
            text: res.errorMessage ?? "Houve algo de errado em nosso sistema.",
            icon: "error",
        });
    }
}

const INVALID_EMAIL_CLASS = "invalid-email";
function onBlurEmail(e: FocusEvent<HTMLInputElement>) {
    const fieldsetElement = document.querySelector("#email-fieldset");

    const email = e.currentTarget.value;

    if (!!email && !isEmail(email))
        fieldsetElement?.classList.add(INVALID_EMAIL_CLASS);

    else
        fieldsetElement?.classList.remove(INVALID_EMAIL_CLASS);
}

type SignUpForm = {
    firstname: string;
    lastname: string;
    email: string;
    username: string;
    department: Optional<Department.DTO>;

    password: string;
    recaptchaToken: Nullable<string>;
};
