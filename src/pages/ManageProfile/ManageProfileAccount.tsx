import { useState, MouseEvent, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { UniversimeApi } from "@/services"
import { setStateAsValue } from "@/utils/tsxUtils";
import { minimumLength, numberOrSpecialChar, passwordValidationClass, upperAndLowerCase } from "@/utils/passwordValidation";
import { AuthContext } from "@/contexts/Auth";
import * as SwalUtils from "@/utils/sweetalertUtils";

export function ManageProfileAccount() {
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();

    const [hasPassword, setHasPassword] = useState<boolean>(false);

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
    const enableChangePassword = (!!oldPassword || !hasPassword) && validNewPassword;

    useEffect(() => {
        setHasPassword(!!authContext.profile?.user.hasPassword);
    }, [authContext.profile?.user.hasPassword]);

    return (
        <section id="card-password" className="card">
            <fieldset id="fieldset-password">
                <legend>Informações da Conta</legend>
                <br/>
                <h4>Email</h4>
                <input name="email" id="email" readOnly
                    type="text" value={authContext.profile?.user.email}
                />
                <br/><br/>
                <h4>Usuário</h4>
                <input name="username" id="username" readOnly
                    type="text" value={authContext.profile?.user.name}
                />
            </fieldset>
        </section>
    );

    function changePassword(e: MouseEvent<HTMLButtonElement>) {
        UniversimeApi.User.changePassword({
            password: (hasPassword ? oldPassword : newPassword),
            newPassword,
        }).then(res => {
            if (!res.isSuccess()) {
                throw new Error(res.errorMessage);
            }
            authContext.updateLoggedUser();
            navigate(`/profile/${authContext.profile!.user.name}`);
        }).catch((reason: Error) => {
            SwalUtils.fireModal({
                title: "Erro ao alterar senha",
                text: reason.message,
                icon: "error",
            })
        });
    }
}
