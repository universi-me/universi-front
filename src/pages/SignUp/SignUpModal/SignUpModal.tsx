import { MouseEvent } from "react";

import { UniversiModal } from "@/components/UniversiModal";
import UniversimeApi from "@/services/UniversimeApi";

import "./SignUpModal.less"

export type SignUpModalProps = {
    toggleModal: (state: boolean) => any;
};

export function SignUpModal(props: SignUpModalProps) {
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
                        <legend>Nome</legend>
                        <input type="text" name="name" placeholder="Insira seu nome e sobrenome" required />
                    </fieldset>

                    <fieldset>
                        <legend>Email</legend>
                        <input type="text" name="email" placeholder="novousuario@email.com" required />
                    </fieldset>

                    <fieldset>
                        <legend>Senha</legend>
                        <input type="password" name="password" placeholder="Insira sua senha" required />
                    </fieldset>

                    <section className="password-requirements">
                        <h3>Sua senha precisa conter:</h3>
                        <p className="min-length">Tamanho mínimo de oito caracteres</p>
                        <p className="upper-lower-case">Letras minúsculas e maiúsculas</p>
                        <p className="number-special-char">Números ou caracteres especiais</p>
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

    const nameElement = modalElement.querySelector('input[name="name"]') as HTMLInputElement;
    const emailElement = modalElement.querySelector('input[name="email"]') as HTMLInputElement;
    const passwordElement = modalElement.querySelector('input[name="password"]') as HTMLInputElement;

    return {
        name: nameElement.value,
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
        // todo: change input to username
        username: values.name,
    }).then(res => {
        console.dir(res);
    })
}
