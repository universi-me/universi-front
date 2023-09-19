import { MouseEvent, FocusEvent, useState } from "react";
import { useNavigate } from "react-router";

import { UniversiModal } from "@/components/UniversiModal";
import UniversimeApi from "@/services/UniversimeApi";
import { isEmail } from "@/utils/regexUtils";
import { minimumLength, numberOrSpecialChar, passwordValidationClass, upperAndLowerCase } from "@/utils/passwordValidation";
import { enableSignUp } from "./helperFunctions";


import "./SignUpModal.less"

export type SignUpModalProps = {
    toggleModal: (state: boolean) => any;
    setWarningMessage: (message: string) => any;
};


const USERNAME_CHAR_REGEX = /[a-z0-9_.-]/

export function SignUpModal(props: SignUpModalProps) {
    const navigate = useNavigate();

    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const [showPassword, setShowPassword] = useState<boolean>(false);

    const canSignUp = enableSignUp(username, email, password);

    const closeModal = () => props.toggleModal(false);
    const togglePassword = () => setShowPassword(!showPassword);

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
                        <p className="fieldset-info">Você só pode usar letras minúsculas, números, hífen (-), underscore (_) e ponto (.).</p>
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
        UniversimeApi.User.signUp({ username, email, password })
            .then(res => {
                if (!res.success)
                    props.setWarningMessage(res.message ?? "Houve algo de errado em nosso sistema.")

                else
                    navigate("/login");
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
