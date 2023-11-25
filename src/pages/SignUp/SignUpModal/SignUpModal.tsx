import { MouseEvent, FocusEvent, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import ReCAPTCHA from "react-google-recaptcha-enterprise";

import { UniversiModal } from "@/components/UniversiModal";
import UniversimeApi from "@/services/UniversimeApi";
import { isEmail } from "@/utils/regexUtils";
import { setStateAsValue } from "@/utils/tsxUtils";
import { minimumLength, numberOrSpecialChar, passwordValidationClass, upperAndLowerCase } from "@/utils/passwordValidation";
import { enableSignUp } from "./helperFunctions";
import * as SwalUtils from "@/utils/sweetalertUtils";

import "./SignUpModal.less"

export type SignUpModalProps = {
    toggleModal: (state: boolean) => any;
};

const FIRST_NAME_MAX_LENGTH = 21;
const LAST_NAME_MAX_LENGTH = 21;

const USERNAME_CHAR_REGEX = /[a-z0-9_.-]/

export function SignUpModal(props: SignUpModalProps) {
    const navigate = useNavigate();

    const [firstname, setFirstname] = useState<string>("");
    const [lastname, setLastname] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const [showPassword, setShowPassword] = useState<boolean>(false);

    const [usernameAvailable, setUsernameAvailable] = useState<boolean>(false);
    const [usernameAvailableChecked, setUsernameAvailableChecked] = useState<boolean>(false);

    const [emailAvailable, setEmailAvailable] = useState<boolean>(false);
    const [emailAvailableChecked, setEmailAvailableChecked] = useState<boolean>(false);

    const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
    const [recaptchaRef, setRecaptchaRef] = useState<any>(null);

    const isFirstnameFull = (firstname.length) >= FIRST_NAME_MAX_LENGTH;
    const isLastnameFull = (lastname.length) >= LAST_NAME_MAX_LENGTH;

    const canSignUp = enableSignUp(username, email, password);

    const closeModal = () => props.toggleModal(false);
    const togglePassword = () => setShowPassword(!showPassword);

    const handleRecaptchaChange = (token: string | null) => {
        setRecaptchaToken(token);
    };

    useEffect(() => {
        setUsernameAvailableChecked(false);
        const delayDebounceFn = setTimeout(async () => {
            if(username.length < 1) {
                setUsernameAvailable(false);
                return;
            }
            const resp = await UniversimeApi.User.usernameAvailable({username: username});
            setUsernameAvailable(resp.success);
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
            const resp = await UniversimeApi.User.emailAvailable({email: email});
            setEmailAvailable(resp.success);
            setEmailAvailableChecked(true);
        }, 1000)
        return () => clearTimeout(delayDebounceFn)
    }, [email])

    const ENABLE_RECAPTCHA = import.meta.env.VITE_ENABLE_RECAPTCHA === "true" || import.meta.env.VITE_ENABLE_RECAPTCHA === "1";

    return (
        <UniversiModal>
            <div id="sign-up-modal">
                <div className="heading">
                    <div/>
                    <h2>Cadastro</h2>
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
                            <input type="text" name="firstname" id="firstname" defaultValue={""} onChange={setStateAsValue(setFirstname)} required maxLength={FIRST_NAME_MAX_LENGTH} />
                        </label>

                        <label className="legend" htmlFor="lastname">
                            <span className="counter-wrapper">
                                <legend className="required-input">Sobrenome</legend>
                                <span className={`counter ${isLastnameFull ? 'full-counter' : ''}`}>{lastname.length} / {LAST_NAME_MAX_LENGTH}</span>
                            </span>

                            <input type="text" name="lastname" id="lastname" defaultValue={""} onChange={setStateAsValue(setLastname)} required maxLength={LAST_NAME_MAX_LENGTH} />
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
                            { emailAvailableChecked ? <p className={`bi fieldset-info ${emailAvailable?'success-validation':'failed-validation'}`}>{emailAvailable?'Email Disponível para uso.':'Email não está disponivel para uso.'}</p> : null }
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
                            { usernameAvailableChecked ? <p className={`bi fieldset-info ${usernameAvailable?'success-validation':'failed-validation'}`}>{usernameAvailable?'Usuário Disponível para uso.':'Usuário não está disponivel para uso.'}</p> : null }
                            <p className="fieldset-info">
                                Você só pode usar letras minúsculas, números, hífen (-), underscore (_) e ponto (.).<br/>
                                Todos irão acessar seu perfil em: <div className="profile-url-preview">{location.origin}/profile/{username || "<insira um nome de usuário>"}</div>
                            </p>
                            {/* <p className="fieldset-info">Seu nome de usuário será usado para acessar seu perfil em: {location.origin}/profile/{username}</p> */}
                        </section>
                    </fieldset>

                    <fieldset id="password-fieldset">
                        <legend>Senha</legend>
                        <input type={showPassword ? "text" : "password"} name="password"
                            placeholder="Insira sua senha" required
                            onChange={e => setPassword(e.currentTarget.value)}
                        />
                        <button type="button" onClick={togglePassword} id="toggle-password-visibility" title="Alterar visibilidade da senha">
                            <span className={`bi ${showPassword ? "bi-eye-fill" : "bi-eye-slash-fill"}`} />
                        </button>
                    </fieldset>

                    <section className="password-requirements">
                        <h3>Sua senha precisa conter:</h3>
                        <p className={`bi min-length ${passwordValidationClass(minimumLength(password))}`}>Tamanho mínimo de oito caracteres</p>
                        <p className={`bi upper-lower-case ${passwordValidationClass(upperAndLowerCase(password))}`}>Letras minúsculas e maiúsculas</p>
                        <p className={`bi number-special-char ${passwordValidationClass(numberOrSpecialChar(password))}`}>Números ou caracteres especiais</p>
                    </section>

                    {
                        !ENABLE_RECAPTCHA ? null :
                            <center>
                                <br/>
                                <ReCAPTCHA ref={(r) => setRecaptchaRef(r) } sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY} onChange={handleRecaptchaChange} />
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
        UniversimeApi.User.signUp({ firstname, lastname, username, email, password, recaptchaToken })
            .then(res => {
                if (!res.success) {
                    recaptchaRef.reset();
                    SwalUtils.fireModal({
                        title: "Erro ao criar sua conta",
                        text: res.message ?? "Houve algo de errado em nosso sistema.",
                        icon: "error",
                    });
                } else {
                    navigate("/login");
                }
            })
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
