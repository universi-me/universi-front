import { useParams } from "react-router-dom"
import { useState } from "react"
import "./NewPassword.css"
import UniversimeApi from "@/services/UniversimeApi";
import { minimumLength, numberOrSpecialChar, passwordValidationClass, upperAndLowerCase } from "@/utils/passwordValidation";
import * as SwalUtils from "@/utils/sweetalertUtils"
import NewPasswordInput from "@/components/NewPasswordInput/NewPasswordInput";
import { NullableBoolean } from "@/types/utils";

export default function NewPassword(){
    const { id: token } = useParams();
    const [password, setPassword] = useState<string>("")

    function handleNewPassword(){

        SwalUtils.fireToasty({title: "Verificando dados"})

        UniversimeApi.User.newPassword({password, token})
    }

    const [canChangePassword, setCanChangePassword] = useState<NullableBoolean>(false)

    return(
        <div>
            <div className="center-container">
                <h3 className="center-text">Recuperação de senha: escolha sua nova senha</h3>
                <div className="container form-container">
                    <NewPasswordInput password={password} setPassword={setPassword} valid={canChangePassword} setValid={setCanChangePassword}/>

                    <button disabled={!canChangePassword}
                        type="submit"
                        value="Entrar"
                        className="btn_form"
                        onClick={handleNewPassword}
                    >
                        ENVIAR
                    </button>

                </div>
            </div>
        </div>
    )


}