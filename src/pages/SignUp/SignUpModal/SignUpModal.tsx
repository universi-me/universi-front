import { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router";
import type ReCAPTCHA from "react-google-recaptcha-enterprise";

import UniversiForm from "@/components/UniversiForm";
import { UniversimeApi } from "@/services"
import { isEmail } from "@/utils/regexUtils";
import { AuthContext } from "@/contexts/Auth/AuthContext";
import * as SwalUtils from "@/utils/sweetalertUtils";
import { isValidUsernamePattern, USERNAME_CHAR_REGEX } from "@/types/Profile";

import styles from "./SignUpModal.module.less";
import BootstrapIcon from "@/components/BootstrapIcon";

export type SignUpModalProps = {
    toggleModal: (state: boolean) => any;
    departments: Department.DTO[];
};

const FIRST_NAME_MAX_LENGTH = 21;
const LAST_NAME_MAX_LENGTH = 21;
const EMAIL_MAX_LENGTH = 255;
const USERNAME_MAX_LENGTH = 255;

export function SignUpModal( props: Readonly<SignUpModalProps> ) {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");

    const [usernameUnavailableMessage, setUsernameUnavailableMessage] = useState<Nullable<string>>();
    const usernameAvailable = usernameUnavailableMessage === null;
    const usernameAvailableChecked = usernameUnavailableMessage !== undefined;
    const usernameRef = useRef<Nullable<HTMLInputElement>>(null);

    const [emailUnavailableMessage, setEmailUnavailableMessage] = useState<Nullable<string>>();
    const emailAvailable = emailUnavailableMessage === null;
    const emailAvailableChecked = emailUnavailableMessage !== undefined;

    const recaptchaRef = useRef<Nullable<ReCAPTCHA>>(null);

    useEffect(() => {
        setUsernameUnavailableMessage( undefined );
        const delayDebounceFn = setTimeout(async () => {
            if(username.length < 1) {
                setUsernameUnavailableMessage( undefined );
                return;
            }
            const resp = await UniversimeApi.User.usernameAvailable( username );
            if ( resp.body?.available )
                setUsernameUnavailableMessage( null );
            else
                setUsernameUnavailableMessage( resp.body?.reason ?? 'Nome de usuário não disponível' );
        }, 1000)
        return () => clearTimeout(delayDebounceFn)
    }, [username])

    useEffect(() => {
        setEmailUnavailableMessage( undefined );
        const delayDebounceFn = setTimeout(async () => {
            if(email.length < 1) {
                setEmailUnavailableMessage( undefined );
                return;
            }
            const resp = await UniversimeApi.User.emailAvailable( email );
            if ( resp.body?.available )
                setEmailUnavailableMessage( null );
            else
                setEmailUnavailableMessage( resp.body?.reason ?? 'Email não disponível' );
        }, 1000)
        return () => clearTimeout(delayDebounceFn)
    }, [email])

    const organizationEnv = (((auth.organization??{} as any).groupSettings??{} as any).environment??{} as any);
    const ENABLE_RECAPTCHA = organizationEnv.recaptcha_enabled ?? (import.meta.env.VITE_ENABLE_RECAPTCHA === "true" || import.meta.env.VITE_ENABLE_RECAPTCHA === "1");
    const RECAPTCHA_SITE_KEY = organizationEnv.recaptcha_site_key ?? import.meta.env.VITE_RECAPTCHA_SITE_KEY;

    return <UniversiForm.Root id="sign-up-modal" title="Cadastro" callback={ createAccount } allowConfirm={ emailAvailable && usernameAvailableChecked && usernameAvailable }>
        <UniversiForm.Input.Text required param="firstname"
            label="Nome" placeholder="Insira seu nome"
            maxLength={FIRST_NAME_MAX_LENGTH}
        />

        <UniversiForm.Input.Text required param="lastname"
            label="Sobrenome" placeholder="Insira seu sobrenome"
            maxLength={LAST_NAME_MAX_LENGTH}
        />

        <div>
        <UniversiForm.Input.Text param="email"
            label="Email"
            placeholder="novousuario@email.com" required
            maxLength={EMAIL_MAX_LENGTH} omitCharLimit
            type="email"
            onChange={ newEmail => { setEmail( newEmail ) } }
            validations={[ isEmail ]}
        />
        { emailAvailableChecked && <section className={ styles.validation_message }>
            <p className={ emailAvailable ? styles.valid : styles.invalid }>
                <BootstrapIcon className={ styles.icon } icon={ emailAvailable ? "check-circle-fill" : "x-circle-fill" }/>
                { emailAvailable ? "Email disponível para uso." : emailUnavailableMessage }
            </p>
        </section> }
        </div>

        <div>
        <UniversiForm.Input.Text required param="username"
            label="Nome de usuário" ref={ usernameRef }
            placeholder="nome_sobrenome" maxLength={USERNAME_MAX_LENGTH} omitCharLimit
            validations={ [ isValidUsernamePattern ] }
            onChange={ newUsername => {
                const filteredUsername = Array.from( newUsername )
                    .filter(c => USERNAME_CHAR_REGEX.exec(c) !== null)
                    .join( "" );

                usernameRef.current!.value = filteredUsername;
                setUsername( filteredUsername );
            } }
        />
        <section className={ styles.validation_message }>
            { usernameAvailableChecked && <p className={ usernameAvailable ? styles.valid : styles.invalid }>
                <BootstrapIcon className={ styles.icon } icon={ usernameAvailable ? "check-circle-fill" : "x-circle-fill" }/>
                { usernameAvailable ? "Nome de usuário disponível para uso." : usernameUnavailableMessage }
            </p> }

            <p>
                Você só pode usar letras minúsculas, números, hífen (-), underscore (_) e ponto (.).<br/>
                Todos irão acessar seu perfil em: <span className={ styles.profile_url_preview }>
                    { location.origin }/profile/{ username || "<insira um nome de usuário>" }
                </span>
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
            optionNotFoundMessage={ inputValue => `Não foi possível encontrar o órgão/área "${ inputValue }"` }
        /> }

        <UniversiForm.Input.Password
            param="password"
            label="Senha"
            required
            mustConfirm
            mustMatchRequirements
        />

        { ENABLE_RECAPTCHA && <UniversiForm.Input.ReCaptcha
            param="recaptchaToken"
            sitekey={ RECAPTCHA_SITE_KEY }
            ref={ recaptchaRef }
        />}
    </UniversiForm.Root>

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

type SignUpForm = {
    firstname: string;
    lastname: string;
    email: string;
    username: string;
    department: Optional<Department.DTO>;

    password: string;
    recaptchaToken: Nullable<string>;
};
