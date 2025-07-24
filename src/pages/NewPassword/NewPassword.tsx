import { useNavigate, useParams } from "react-router-dom"
import "./NewPassword.css"
import { UniversimeApi } from "@/services"
import * as SwalUtils from "@/utils/sweetalertUtils"
import UniversiForm from "@/components/UniversiForm";

export default function NewPassword(){
    const navigate = useNavigate();

    const { id: token } = useParams();

    return(
        <UniversiForm.Root id="new-password-modal" title="Definição de Nova Senha" callback={ newPassword } >
            <UniversiForm.Input.Password
                param="newPassword"
                label="Nova Senha"
                required
                mustConfirm
                mustMatchRequirements
            />
        </UniversiForm.Root>
    )

    async function newPassword( data: UniversiForm.Data<UniversimeApi.Auth.RecoverNewPassword_RequestDTO> ) {
        if ( !data.confirmed ) {
            navigate( "/" )
            return;
        }

        SwalUtils.fireToasty({title: "Verificando dados"})
        const res = await UniversimeApi.Auth.newPassword({
            newPassword: data.body!.newPassword,
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
    };
}