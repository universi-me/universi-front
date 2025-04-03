import { useNavigate, useParams } from "react-router-dom"
import { useState } from "react"
import "./NewPassword.css"
import { UniversimeApi } from "@/services"
import * as SwalUtils from "@/utils/sweetalertUtils"
import NewPasswordInput from "@/components/NewPasswordInput/NewPasswordInput";

export default function NewPassword(){
    const navigate = useNavigate();

    const { id: token } = useParams();
    const [password, setPassword] = useState<string>("")

    async function handleNewPassword(){

        SwalUtils.fireToasty({title: "Verificando dados"})
        const res = await UniversimeApi.Auth.newPassword({
            newPassword: password,
            token: token!,
        })

        if ( res.isSuccess() ) {
            SwalUtils.fireToasty({
                title: "Senha alterada com sucesso!",
                text: "Você já pode fazer login com sua nova senha",
                timer: 10_000,
            });
            navigate( "/" )
        }

        else {
            SwalUtils.fireModal({
                title: "Erro ao alterar senha",
                text: res.errorMessage,
            });
        }
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