import { ChangeEvent, MouseEvent, useState } from "react";

import { UniversiModal } from "@/components/UniversiModal";
import UniversimeApi from "@/services/UniversimeApi";

import "./SignUpModal.less"

export type SignUpModalProps = {
    toggleModal: (state: boolean) => any;
};

const MINIMUM_PASSWORD_LENGTH = 8;

export function SignUpModal(props: SignUpModalProps) {
    const [password, setPassword] = useState<string>("");

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
                        <input type="text" name="username" placeholder="Insira seu nome e sobrenome" required />
                    </fieldset>

                    <fieldset>
                        <legend>Email</legend>
                        <input type="text" name="email" placeholder="novousuario@email.com" required />
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
                        <p className={`min-length ${minimumLength(password, MINIMUM_PASSWORD_LENGTH)}`}>Tamanho mínimo de oito caracteres</p>
                        <p className={`upper-lower-case ${upperAndLowerCase(password)}`}>Letras minúsculas e maiúsculas</p>
                        <p className={`number-special-char ${numberOrSpecialChar(password)}`}>Números ou caracteres especiais</p>
                    </section>

                    <div className="submit">
                        <button type="submit" className="create-account" onClick={createAccount}>
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

const FAIL_VALIDATION_CLASS =    "failed-validation";
const SUCCESS_VALIDATION_CLASS = "success-validation";

function minimumLength(password: string, length: number): string {
    if (!password)
        return "";

    return password.length >= length
        ? SUCCESS_VALIDATION_CLASS
        : FAIL_VALIDATION_CLASS;
}

function upperAndLowerCase(password: string): string {
    if (!password)
        return "";

    return RegExp(/[A-Z]/).exec(password) === null || RegExp(/[a-z]/).exec(password) === null
        ? FAIL_VALIDATION_CLASS
        : SUCCESS_VALIDATION_CLASS;
}

function numberOrSpecialChar(password: string): string {
    if (!password)
        return "";

    return RegExp(/[^A-Za-zçÇ]/).exec(password) === null
        ? FAIL_VALIDATION_CLASS
        : SUCCESS_VALIDATION_CLASS;
}
