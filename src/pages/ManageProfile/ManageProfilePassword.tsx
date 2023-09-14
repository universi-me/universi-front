import UniversimeApi from "@/services/UniversimeApi";
import { setStateAsValue } from "@/utils/tsxUtils";
import { useState, MouseEvent } from "react";

export function ManageProfilePassword() {
    const [oldPassword, setOldPassword] = useState<string>("");
    const [showOldPassword, setShowOldPassword] = useState<boolean>(false);

    const [newPassword, setNewPassword] = useState<string>("");
    const [showNewPassword, setShowNewPassword] = useState<boolean>(false);

    const toggleOldPassword = () => setShowOldPassword(!showOldPassword);
    const toggleNewPassword = () => setShowNewPassword(!showNewPassword);

    const enableChangePassword = !!oldPassword && !!newPassword;

    return (
        <section id="fieldset-password">
            <legend>Alterar minha senha</legend>

            <div className="password-container">
                <input name="old-password" id="old-password" onChange={setStateAsValue(setOldPassword)}
                    type={showOldPassword ? "text" : "password"} placeholder="Insira sua senha atual"
                />
                <button type="button" onClick={toggleOldPassword} id="toggle-password-visibility" title="Alterar visibilidade da senha">
                    <span className={`bi ${showOldPassword ? "bi-eye-fill" : "bi-eye-slash-fill"}`} />
                </button>
            </div>

            <div className="password-container">
                <input name="new-password" id="new-password" onChange={setStateAsValue(setNewPassword)}
                    type={showNewPassword ? "text" : "password"} placeholder="Insira sua nova senha"
                />
                <button type="button" onClick={toggleNewPassword} id="toggle-password-visibility" title="Alterar visibilidade da senha">
                    <span className={`bi ${showNewPassword ? "bi-eye-fill" : "bi-eye-slash-fill"}`} />
                </button>
            </div>

            <button type="button" onClick={changePassword}
                disabled={ !enableChangePassword } title={ !enableChangePassword ? "Preencha os campos de senha" : undefined}
            >
                Alterar senha
            </button>
        </section>
    );

    function changePassword(e: MouseEvent<HTMLButtonElement>) {
        UniversimeApi.User.edit({
            currentPassword: oldPassword,
            newPassword,
        });
    }
}
