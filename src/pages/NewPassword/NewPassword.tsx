import { useParams } from "react-router-dom"
import { useState } from "react"
import "./NewPassword.css"
import UniversimeApi from "@/services/UniversimeApi";
import { minimumLength, numberOrSpecialChar, passwordValidationClass, upperAndLowerCase } from "@/utils/passwordValidation";
import * as SwalUtils from "@/utils/sweetalertUtils"

export default function NewPassword(){
    const { id: token } = useParams();
    const [password, setPassword] = useState<string>("")
    const [showPassword, setShowPassword] = useState(false)

    function toggleShowPassword(){
        setShowPassword(!showPassword)
    }

    function handleNewPassword(){

        SwalUtils.fireToasty({title: "Verificando dados"})

        UniversimeApi.User.newPassword({password, token})
    }

    const validPasswordLength = minimumLength(password);
    const validPasswordCase = upperAndLowerCase(password);
    const validPasswordSpecial = numberOrSpecialChar(password);

    const canChangePassword = validPasswordLength && validPasswordCase && validPasswordSpecial;

    return(
        <div>
            <div className="center-container">
                <h3 className="center-text">Recuperação de senha: escolha sua nova senha</h3>
                <div className="container form-container">
                    <div className="form-group">
                        <div className="label-form">
                            <span className="material-symbols-outlined">lock</span>
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            id="username"
                            name="newPassword"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Insira sua nova senha"
                            required
                        />
                        <span className="toggle" onClick={toggleShowPassword}>
                            <span className="material-symbols-outlined">
                            {showPassword == false ? "visibility" : "visibility_off"}
                            </span>
                        </span>
                    </div>
                    <div className="password-validation-box">
                        <h3>Sua senha precisa conter:</h3>
                        <p className={`bi min-length ${passwordValidationClass(minimumLength(password))}`}>Tamanho mínimo de oito caracteres</p>
                        <p className={`bi upper-lower-case ${passwordValidationClass(upperAndLowerCase(password))}`}>Letras minúsculas e maiúsculas</p>
                        <p className={`bi number-special-char ${passwordValidationClass(numberOrSpecialChar(password))}`}>Números ou caracteres especiais</p>
                    </div>

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