import { MouseEvent, FocusEvent, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import Select from "react-select";
import ReCAPTCHA from "react-google-recaptcha-enterprise";

import { UniversiModal } from "@/components/UniversiModal";
import { UniversimeApi } from "@/services"
import { isEmail } from "@/utils/regexUtils";
import { setStateAsValue } from "@/utils/tsxUtils";
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

    const [emailAvailable, setEmailAvailable] = useState<boolean>(false);
    const [emailAvailableChecked, setEmailAvailableChecked] = useState<boolean>(false);
    const [emailUnavailableMessage, setEmailUnavailableMessage] = useState<string>('');

    const [department, setDepartment] = useState<Optional<string>>( undefined );

    const [recaptchaToken, setRecaptchaToken] = useState<string | undefined>(undefined);
    const [recaptchaRef, setRecaptchaRef] = useState<any>(null);

    const isFirstnameFull = (firstname.length) >= FIRST_NAME_MAX_LENGTH;
    const isLastnameFull = (lastname.length) >= LAST_NAME_MAX_LENGTH;

    const canSignUp = enableSignUp(username, email, password) && isPasswordValid && usernameAvailable && emailAvailable;

    const closeModal = () => props.toggleModal(false);

    const handleRecaptchaChange = (token: string | null) => {
        setRecaptchaToken(token ?? undefined);
    };

    useEffect(() => {
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
        setEmailAvailableChecked(false);
        const delayDebounceFn = setTimeout(async () => {
            if(email.length < 1) {
                setEmailAvailable(false);
                return;
            }
            const resp = await UniversimeApi.User.emailAvailable( email );
            setEmailAvailable(resp.isSuccess() && resp.body?.available);
            setEmailUnavailableMessage((resp.body as any)!?.reason ?? 'Email não está disponivel para uso.');
            setEmailAvailableChecked(true);
        }, 1000)
        return () => clearTimeout(delayDebounceFn)
    }, [email])

    const organizationEnv = (((auth.organization??{} as any).groupSettings??{} as any).environment??{} as any);
    const ENABLE_RECAPTCHA = organizationEnv.recaptcha_enabled ?? (import.meta.env.VITE_ENABLE_RECAPTCHA === "true" || import.meta.env.VITE_ENABLE_RECAPTCHA === "1");
    const RECAPTCHA_SITE_KEY = organizationEnv.recaptcha_site_key ?? import.meta.env.VITE_RECAPTCHA_SITE_KEY;

    return (
        <UniversiModal>
            <div id="sign-up-modal">
                <div className="heading">
                        <button className="close-modal-button" onClick={closeModal}>
                            <i className="bi bi-x-lg" />
                        </button>
                </div>

                <form>
                <fieldset id="fieldset-name">
                        <label className="legend" htmlFor="firstname">
                            <span className="counter-wrapper">
                                <legend className="required-input">Nome</legend>
                                <span className={`counter ${isFirstnameFull ? 'full-counter' : ''}`}>{firstname.length} / {FIRST_NAME_MAX_LENGTH}</span>
                            </span>
                            <input type="text" name="firstname" id="firstname" placeholder="Insira seu nome" defaultValue={""} onChange={setStateAsValue(setFirstname)} required maxLength={FIRST_NAME_MAX_LENGTH} />
                        </label>

                        <label className="legend" htmlFor="lastname">
                            <span className="counter-wrapper">
                                <legend className="required-input">Sobrenome</legend>
                                <span className={`counter ${isLastnameFull ? 'full-counter' : ''}`}>{lastname.length} / {LAST_NAME_MAX_LENGTH}</span>
                            </span>

                            <input type="text" name="lastname" id="lastname" placeholder="Insira seu sobrenome" defaultValue={""} onChange={setStateAsValue(setLastname)} required maxLength={LAST_NAME_MAX_LENGTH} />
                        </label>
                </fieldset>
                <fieldset id="email-fieldset">
                        <legend>Email</legend>
                        <input type="text" name="email" maxLength={255}
                            placeholder="novousuario@email.com" required
                            onBlur={onBlurEmail} onChange={e => {
                                document.querySelector("#email-fieldset")
                                    ?.classList.remove(INVALID_EMAIL_CLASS);
                                setEmail(e.currentTarget.value)
                            }}
                        />
                        <section className="password-requirements">
                            { emailAvailableChecked ? <p className={`bi fieldset-info ${emailAvailable?'success-validation':'failed-validation'}`}>{emailAvailable?'Email Disponível para uso.':emailUnavailableMessage}</p> : null }
                        </section>
                    </fieldset>

                    <fieldset>
                        <legend>Nome de usuário</legend>
                        <input type="text" name="username" maxLength={255}
                            placeholder="nome_sobrenome" required
                            onChange={e => {
                                const filteredValue = Array.from(e.currentTarget.value)
                                    .filter(c => USERNAME_CHAR_REGEX.exec(c) !== null)
                                    .join("");

                                e.currentTarget.value = filteredValue;
                                setUsername(filteredValue);
                            }}
                        />
                        <section className="password-requirements">
                            { usernameAvailableChecked ? <p className={`bi fieldset-info ${usernameAvailable?'success-validation':'failed-validation'}`}>{usernameAvailable?'Usuário Disponível para uso.':usernameUnavailableMessage}</p> : null }
                            <p className="fieldset-info">
                                Você só pode usar letras minúsculas, números, hífen (-), underscore (_) e ponto (.).<br/>
                                Todos irão acessar seu perfil em: <div className="profile-url-preview">{location.origin}/profile/{username || "<insira um nome de usuário>"}</div>
                            </p>
                            {/* <p className="fieldset-info">Seu nome de usuário será usado para acessar seu perfil em: {location.origin}/profile/{username}</p> */}
                        </section>
                    </fieldset>

                    { props.departments.length > 0 && <fieldset id="department-fieldset">
                        <legend>Órgão/Área</legend>
                        <Select isSearchable isClearable
                            options={departmentOptions()}
                            onChange={ ({ option }: { option: { value: string; label: string; } }) => setDepartment( option.value ) }
                            placeholder={ "Selecionar órgão/área" }
                            noOptionsMessage={ ({ inputValue }: { inputValue: string }) => `Não foi possível encontrar o órgão/área "${inputValue}"` }
                        />
                    </fieldset> }

                    <fieldset id="password-fieldset">
                        <legend>Senha</legend>
                        <NewPasswordInput password={password} setPassword={setPassword} valid={isPasswordValid} setValid={setIsPasswordValid}/>
                    </fieldset>

                    {
                        !ENABLE_RECAPTCHA ? null :
                            <center>
                                <br/>
                                <ReCAPTCHA ref={(r) => setRecaptchaRef(r) } sitekey={RECAPTCHA_SITE_KEY} onChange={handleRecaptchaChange} />
                                <br/>
                            </center>
                    }

                    <div className="submit">
                        <button type="submit" className="create-account" onClick={createAccount}
                            disabled={!canSignUp} title={!canSignUp ? "Preencha todos os campos corretamente para poder se cadastrar" : undefined}>
                            Criar conta
                        </button>
                    </div>
                </form>
            </div>
        </UniversiModal>
    );

    function createAccount(e: MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        UniversimeApi.User.signup({ firstname, lastname, username, email, password, recaptchaToken, department })
            .then(res => {
                if (!res.isSuccess()) {
                    recaptchaRef.reset();
                    SwalUtils.fireModal({
                        title: "Erro ao criar sua conta",
                        text: res.errorMessage ?? "Houve algo de errado em nosso sistema.",
                        icon: "error",
                    });
                } else {
                    navigate("/login");
                }
            })
    }

    function departmentOptions() {
        return props.departments
            .map( d => ({ value: d.id, label: `${d.acronym} - ${d.name}` }) )
            .sort( ( d1, d2 ) => d1.label.localeCompare( d2.label ) );
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
