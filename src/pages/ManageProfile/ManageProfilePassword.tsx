import { useState, MouseEvent } from "react";

import UniversimeApi from "@/services/UniversimeApi";
import { setStateAsValue } from "@/utils/tsxUtils";
import { minimumLength, numberOrSpecialChar, passwordValidationClass, upperAndLowerCase } from "@/utils/passwordValidation";

export function ManageProfilePassword() {
    const [oldPassword, setOldPassword] = useState<string>("");
    const [showOldPassword, setShowOldPassword] = useState<boolean>(false);

    const [newPassword, setNewPassword] = useState<string>("");
    const [showNewPassword, setShowNewPassword] = useState<boolean>(false);

    const toggleOldPassword = () => setShowOldPassword(!showOldPassword);
    const toggleNewPassword = () => setShowNewPassword(!showNewPassword);

    const isMinLength = minimumLength(newPassword);
    const isCase = upperAndLowerCase(newPassword);
    const isSpecial = numberOrSpecialChar(newPassword);
    const validNewPassword = isMinLength && isCase && isSpecial;
    const enableChangePassword = !!oldPassword && validNewPassword;

    return (
        <section id="card-password" className="card">
            <fieldset id="fieldset-password">
                <legend>Alterar minha senha</legend>

                <div className="password-container">
                    <input name="old-password" id="old-password" onChange={setStateAsValue(setOldPassword)}
                        type={showOldPassword ? "text" : "password"} placeholder="Insira sua senha atual"
                    />
                    <button type="button" onClick={toggleOldPassword} className="toggle-password-visibility" title="Alterar visibilidade da senha">
                        <span className={`bi ${showOldPassword ? "bi-eye-fill" : "bi-eye-slash-fill"}`} />
                    </button>
                </div>

                <div className="password-container">
                    <input name="new-password" id="new-password" onChange={setStateAsValue(setNewPassword)}
                        type={showNewPassword ? "text" : "password"} placeholder="Insira sua nova senha"
                    />
                    <button type="button" onClick={toggleNewPassword} className="toggle-password-visibility" title="Alterar visibilidade da senha">
                        <span className={`bi ${showNewPassword ? "bi-eye-fill" : "bi-eye-slash-fill"}`} />
                    </button>
                </div>

                <section className="submit">
                    <button type="button" onClick={changePassword}
                        disabled={ !enableChangePassword } title={ !enableChangePassword ? "Preencha os campos de senha" : undefined}
                    >
                        Alterar senha
                    </button>
                </section>
            </fieldset>
            <section id="password-requirements">
                <h3>Sua nova senha precisa conter:</h3>
                    <p className={`bi min-length ${passwordValidationClass(minimumLength(newPassword))}`}>No mínimo oito caracteres</p>
                    <p className={`bi upper-lower-case ${passwordValidationClass(upperAndLowerCase(newPassword))}`}>Letras minúsculas e maiúsculas</p>
                    <p className={`bi number-special-char ${passwordValidationClass(numberOrSpecialChar(newPassword))}`}>Números ou caracteres especiais</p>
            </section>
        </section>
    );

    function changePassword(e: MouseEvent<HTMLButtonElement>) {
        UniversimeApi.User.edit({
            currentPassword: oldPassword,
            newPassword,
        });
    }
}
