import { MouseEvent, FocusEvent, useState } from "react";

import { UniversiModal } from "@/components/UniversiModal";
import UniversimeApi from "@/services/UniversimeApi";
import { isEmail } from "@/utils/regexUtils";

import { enableSignUp, minimumLength, numberOrSpecialChar, passwordValidationClass,
         upperAndLowerCase } from "./helperFunctions";

import "./SignUpModal.less"

export type SignUpModalProps = {
    toggleModal: (state: boolean) => any;
};


export function SignUpModal(props: SignUpModalProps) {
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const canSignUp = enableSignUp(username, email, password);

    const closeModal = () => props.toggleModal(false);

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
                            placeholder="nome.sobrenome" required
                            onChange={e => setUsername(e.currentTarget.value)}
                        />
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

                    <fieldset>
                        <legend>Senha</legend>
                        <input type="password" name="password"
                            placeholder="Insira sua senha" required
                            onChange={e => setPassword(e.currentTarget.value)}
                        />
                    </fieldset>

                    <section className="password-requirements">
                        <h3>Sua senha precisa conter:</h3>
                        <p className={`min-length ${passwordValidationClass(minimumLength(password))}`}>Tamanho mínimo de oito caracteres</p>
                        <p className={`upper-lower-case ${passwordValidationClass(upperAndLowerCase(password))}`}>Letras minúsculas e maiúsculas</p>
                        <p className={`number-special-char ${passwordValidationClass(numberOrSpecialChar(password))}`}>Números ou caracteres especiais</p>
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
}

function getValuesFromPage() {
    const modalElement = document.querySelector("#sign-up-page #sign-up-modal") as HTMLDivElement;

    const usernameElement = modalElement.querySelector('input[name="username"]') as HTMLInputElement;
    const emailElement = modalElement.querySelector('input[name="email"]') as HTMLInputElement;
    const passwordElement = modalElement.querySelector('input[name="password"]') as HTMLInputElement;

    return {
        username: usernameElement.value,
        email: emailElement.value,
        password: passwordElement.value,
    };
}

function createAccount(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    const values = getValuesFromPage();

    UniversimeApi.User.signUp({
        email:    values.email,
        password: values.password,
        username: values.username,
    }).then(res => {
        console.dir(res);
    })
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
